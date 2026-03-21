
const buildDataset = (channelDefs) => {
    const storage = {};
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
            storage[vId] = {
                elapsed,
                watched: Math.floor(elapsed * (1 - 1 / rate)),
            };
        }
    }
    return storage;
};
