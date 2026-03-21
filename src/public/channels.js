
const createChannelsTable = (channels, sortByPropertyName = 'author') => {
    const createChannelHeaders = (channels) => {
        const createHeader = (title, classNames, sortProperty) => {
            const headerColumn = document.createElement('span');
            headerColumn.classList.add(...classNames);
            headerColumn.textContent = title;
            headerColumn.onclick = () => createChannelsTable(channels, sortProperty);
            return headerColumn;
        };

        const header = document.createElement('div');
        header.className = 'channel-detail';
        header.appendChild(createHeader('Channel', ['channel-author', 'clickable'], 'author'));
        header.appendChild(createHeader('Videos', ['channel-videos', 'clickable'], 'videos'));
        header.appendChild(createHeader('Speed', ['channel-rates', 'clickable'], 'rate'));
        header.appendChild(createHeader('Time Saved', ['channel-saved', 'clickable'], 'time'));
        return header;
    };

    const container = document.getElementById('channels');
    container.innerHTML = '';
    container.appendChild(createChannelHeaders(channels));

    const watchedSeconds = videos => videos.reduce((p, c) => p + c.watched, 0);
    const sortChannelsInPlace = (channels, sortByPropertyName) => {
        const byAuthor = (a, b) => a.author.localeCompare(b.author);
        const byRate = (a, b) => b.rate - a.rate;
        const byTime = (a, b) => watchedSeconds(b.videos) - watchedSeconds(a.videos);
        const byVideos = (a, b) => b.videos.length - a.videos.length;
        const sortBy = { 'author': byAuthor, 'rate': byRate, 'time': byTime, 'videos': byVideos };
        channels.sort(sortBy[sortByPropertyName]);
    };

    sortChannelsInPlace(channels, sortByPropertyName);
    const createChannelRow = (id, author, rate, videoCount, savedTime) => {
        const details = document.createElement('div');
        details.className = 'channel-detail';
        details.dataset.channelId = id;

        const channelAuthor = document.createElement('span');
        channelAuthor.className = 'channel-author';
        channelAuthor.onclick = () => window.open(`https://www.youtube.com/channel/${id}`, '_blank');
        channelAuthor.textContent = author;

        const channelRates = document.createElement('span');
        channelRates.className = 'channel-rates';
        channelRates.textContent = rate % 1 === 0 ? `${rate}x` : `${rate.toFixed(1)}x`;

        const channelVideos = document.createElement('span');
        channelVideos.className = 'channel-video-count';
        channelVideos.textContent = videoCount;

        const timeSaved = document.createElement('span');
        timeSaved.className = 'time-saved';
        timeSaved.textContent = savedTime;

        details.appendChild(channelAuthor);
        details.appendChild(channelVideos);
        details.appendChild(channelRates);
        details.appendChild(timeSaved);
        return details;
    };

    for (let channel of channels) {
        container.appendChild(createChannelRow(channel.id, channel.author, channel.rate, channel.videos.length, formatDuration(watchedSeconds(channel.videos))));
    }
};

let _totalWatchedSeconds = 0;
let _heartbeatCount = 0;

const refreshChannelTimes = () => {
    chrome.storage.local.get((storage) => {
        document.querySelectorAll('[data-channel-id]').forEach(row => {
            const channel = storage[row.dataset.channelId];
            if (!channel) return;
            const watched = channel.videos.reduce((p, vId) => p + (storage[vId]?.watched ?? 0), 0);
            const el = row.querySelector('.time-saved');
            if (!el) return;
            const next = formatDuration(watched);
            if (el.textContent !== next) {
                el.textContent = next;
                el.classList.remove('flash');
                void el.offsetWidth; // force reflow to restart animation
                el.classList.add('flash');
            }
        });
    });
};

chrome.storage.onChanged.addListener((changes) => {
    const delta = Object.entries(changes)
        .filter(([k]) => !k.startsWith('UC'))
        .reduce((sum, [, c]) => sum + ((c.newValue?.watched ?? 0) - (c.oldValue?.watched ?? 0)), 0);
    if (delta > 0) {
        const from = _totalWatchedSeconds;
        _totalWatchedSeconds += delta;
        animateCount(document.getElementById('hourCount'), from, _totalWatchedSeconds);
        if (++_heartbeatCount % 8 === 0) refreshChannelTimes();
    }
});

const createChannelSummary = (channels) => {
    const videos = channels.reduce((p, c) => {
        p.push(...c.videos);
        return p;
    }, []);
    const [elapsed, watched] = videos.reduce((p, c) => {
        p[0] += c.elapsed;
        p[1] += c.watched;
        return p;
    }, [0, 0]);

    _totalWatchedSeconds = watched;
    animateCount(document.getElementById('hourCount'), 0, _totalWatchedSeconds, 1500, 'easeOut');
    document.getElementById('videoCount').textContent = videos.length;
    document.getElementById('averageSpeed').textContent = elapsed > 0 ? ((elapsed + watched) / elapsed).toFixed(2) : '1.00';
    document.getElementById('channelCount').textContent = channels.length;
}

const toggleChannelsVisibility = (hasChannels) => {
    document.getElementById('nochannels').style.display = hasChannels ? 'none' : 'flex';
    document.getElementById('channel-results').style.display = hasChannels ? 'flex' : 'none';
};

const buildChannelsWithVideos = (storage) => {
    const isChannel = id => id.startsWith('UC');
    return Object.keys(storage)
        .filter(isChannel)
        .map(c => { return {
            ...storage[c],
            'id': c,
            'videos': storage[c].videos.map(vId => storage[vId] ?? { 'elapsed': 0, 'watched': 0 })}})
};

const setupCanvas = (id, logicalW, logicalH) => {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = logicalW * dpr;
    canvas.height = logicalH * dpr;
    canvas.style.width = logicalW + 'px';
    canvas.style.height = logicalH + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, W: logicalW, H: logicalH };
};

const renderHeatmap = (daily) => {
    const WEEKS = 52, DAYS = 7, CELL = 5, GAP = 2, COL_W = CELL + GAP, ROW_H = CELL + GAP, LABEL_H = 14;
    const setup = setupCanvas('heatmap', WEEKS * COL_W - GAP, LABEL_H + DAYS * ROW_H - GAP);
    if (!setup) return;
    const { ctx } = setup;

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const thisSunday = new Date(today); thisSunday.setDate(today.getDate() - today.getDay());
    const startDate = new Date(thisSunday); startDate.setDate(thisSunday.getDate() - 51 * 7);

    const maxWatched = Math.max(...Object.values(daily).map(d => d.watched ?? 0), 1);
    const logScale = (w) => w === 0 ? 0 : Math.log(w + 1) / Math.log(maxWatched + 1);
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    let lastLabelMonth = -1;

    ctx.font = '9px sans-serif'; ctx.textAlign = 'left';

    for (let week = 0; week < WEEKS; week++) {
        for (let dow = 0; dow < DAYS; dow++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + week * 7 + dow);
            if (d > today) continue;

            const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            const watched = daily[key]?.watched ?? 0;
            const cellX = week * COL_W;
            const cellY = LABEL_H + dow * ROW_H;

            if (dow === 0 && d.getMonth() !== lastLabelMonth) {
                lastLabelMonth = d.getMonth();
                ctx.fillStyle = 'rgba(232,234,237,0.4)';
                ctx.fillText(MONTHS[d.getMonth()], cellX, LABEL_H - 3);
            }

            ctx.fillStyle = watched === 0
                ? 'rgba(255,255,255,0.06)'
                : `rgba(129,201,149,${(0.3 + logScale(watched) * 0.7).toFixed(2)})`;
            ctx.fillRect(cellX, cellY, CELL, CELL);
        }
    }

    const canvas = document.getElementById('heatmap');
    const infoEl = document.getElementById('heatmap-info');

    const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

    canvas.onmousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const week = Math.floor(x / COL_W);
        const dow = Math.floor((y - LABEL_H) / ROW_H);
        if (week < 0 || week >= WEEKS || dow < 0 || dow >= DAYS) { infoEl.textContent = ''; return; }
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + week * 7 + dow);
        if (d > today) { infoEl.textContent = ''; return; }
        const watched = daily[dateKey(d)]?.watched ?? 0;
        const label = `${DAY_NAMES[dow]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        infoEl.textContent = watched > 0 ? `${label} — ${formatDuration(watched)} saved` : `${label} — no activity`;
    };

    canvas.onmouseleave = () => { infoEl.textContent = ''; };
};

const renderCharts = (daily) => {
    if (Object.keys(daily).length === 0) {
        document.getElementById('charts').innerHTML =
            '<div class="chart-empty">Activity tracking begins from your next session.</div>';
        return;
    }
    renderHeatmap(daily);
};

const CATEGORY_LABELS = { time: 'Time Saved', videos: 'Videos', channels: 'Channels', streak: 'Streaks' };

const renderMilestonesSection = (record) => {
    const earned = record?.earned ?? {};
    const container = document.getElementById('milestones-section');

    const grid = document.createElement('div');
    grid.className = 'milestone-grid';

    const categories = [...new Set(MILESTONES.map(m => m.category))];
    for (const cat of categories) {
        const catMilestones = MILESTONES.filter(m => m.category === cat);

        // Most recently earned in this category, falling back to the first locked one
        const earnedInCat = catMilestones
            .filter(m => earned[m.id])
            .sort((a, b) => earned[b.id] - earned[a.id]);
        const displayed = earnedInCat[0] ?? catMilestones[0];
        const isEarned  = !!earnedInCat[0];

        const card = document.createElement('div');
        card.className = `milestone-card ${isEarned ? 'earned' : 'locked'}`;
        if (isEarned) card.style.borderLeftColor = CATEGORY_COLORS[cat];

        const header = document.createElement('div');
        header.className = 'milestone-card-header';

        const icon = document.createElement('span');
        icon.className = 'milestone-card-icon';
        icon.innerHTML = displayed.svg;

        const catLabel = document.createElement('span');
        catLabel.className = 'milestone-card-cat';
        catLabel.textContent = CATEGORY_LABELS[cat];

        header.appendChild(icon);
        header.appendChild(catLabel);

        const label = document.createElement('div');
        label.className = 'milestone-card-label';
        label.textContent = displayed.label;

        const desc = document.createElement('div');
        desc.className = 'milestone-card-desc';
        if (isEarned) {
            const date = new Date(earned[displayed.id]).toLocaleDateString();
            desc.textContent = `${displayed.description} · ${date}`;
        } else {
            desc.textContent = displayed.description;
        }

        card.appendChild(header);
        card.appendChild(label);
        card.appendChild(desc);
        grid.appendChild(card);
    }

    container.appendChild(grid);

    const linkRow = document.createElement('div');
    linkRow.className = 'milestone-all-link';
    const a = document.createElement('a');
    a.href = chrome.runtime.getURL('public/milestones.html');
    a.target = '_blank';
    a.textContent = 'View all milestones →';
    linkRow.appendChild(a);
    container.appendChild(linkRow);
};

chrome.storage.local.get((storage) => {
    const channels = buildChannelsWithVideos(storage);
    toggleChannelsVisibility(!!channels.length);
    createChannelSummary(channels);
    createChannelsTable(channels);
    renderCharts(storage['_daily'] ?? {});
    renderMilestonesSection(evaluateMilestones(storage));
});