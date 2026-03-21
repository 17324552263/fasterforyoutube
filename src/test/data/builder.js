
// buildDailyData: takes an array of { daysAgo, elapsed, watched }
// and produces a _daily storage object keyed by local date string.
const buildDailyData = (entries) => {
    const daily = {};
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (const { daysAgo, elapsed, watched } of entries) {
        const d = new Date(today);
        d.setDate(today.getDate() - daysAgo);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        daily[key] = { elapsed, watched };
    }
    return daily;
};

// buildDailyRange: calls fn(daysAgo) for each day 0..totalDays-1.
// fn should return { elapsed, watched } or null to skip that day.
const buildDailyRange = (totalDays, fn) => {
    const entries = [];
    for (let i = 0; i < totalDays; i++) {
        const result = fn(i);
        if (result) entries.push({ daysAgo: i, ...result });
    }
    return buildDailyData(entries);
};

// buildDataset: builds channel/video storage from channel definitions.
// Pass a _daily object as the second argument to include activity history.
const buildDataset = (channelDefs, daily = null) => {
    const storage = {};
    let totalElapsed = 0, totalWatched = 0;
    for (const ch of channelDefs) {
        const videoIds = ch.videoIds ?? Array.from(
            { length: ch.videoCount ?? 0 },
            (_, i) => `${ch.id.slice(-6)}_${i}`
        );
        storage[ch.id] = { author: ch.author, rate: ch.rate, videos: videoIds };
        for (const vId of videoIds) {
            if (ch.skipVideos?.includes(vId)) continue;
            const elapsed = ch.elapsed?.(vId) ?? (600 + Math.abs(vId.charCodeAt(0)) % 3000);
            const rate = ch.rate > 1 ? ch.rate : 1.01;
            const watched = Math.floor(elapsed * (rate - 1));
            storage[vId] = { elapsed, watched };
            totalElapsed += elapsed;
            totalWatched += watched;
        }
    }
    if (daily) {
        // Scale daily entries proportionally so their totals match the video stats.
        // This keeps the day-to-day distribution shape while ensuring the heatmap
        // and summary header always show consistent totals.
        const dailyElapsedSum = Object.values(daily).reduce((s, d) => s + (d.elapsed ?? 0), 0);
        const dailyWatchedSum = Object.values(daily).reduce((s, d) => s + (d.watched ?? 0), 0);
        const scaled = {};
        for (const [key, d] of Object.entries(daily)) {
            scaled[key] = {
                elapsed: dailyElapsedSum > 0 ? Math.round(d.elapsed * totalElapsed / dailyElapsedSum) : d.elapsed,
                watched: dailyWatchedSum > 0 ? Math.round(d.watched * totalWatched / dailyWatchedSum) : d.watched,
            };
        }
        storage['_daily'] = scaled;
    }
    return storage;
};
