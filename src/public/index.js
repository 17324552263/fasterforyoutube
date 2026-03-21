const splitChannelsAndVideos = (storage) => {
    const storageIndex = (id) => {
        const isChannel = (id) => id.startsWith('UC');
        return +!isChannel(id);
    };

    return Object.keys(storage).reduce((p, c) => {
        p[storageIndex(c)].push(c); return p;        
    }, [[], []]);
};

const setPopUpBehavior = () =>
    document.location.hash === '#ff' && (document.getElementById('headerRule').className = 'popup');

let _totalWatchedSeconds = 0;

const hourCountEl = () => document.getElementById('allHourCount');

chrome.storage.onChanged.addListener((changes) => {
    const delta = Object.entries(changes)
        .filter(([k]) => !k.startsWith('UC'))
        .reduce((sum, [, c]) => sum + ((c.newValue?.watched ?? 0) - (c.oldValue?.watched ?? 0)), 0);
    if (delta > 0) {
        const from = _totalWatchedSeconds;
        _totalWatchedSeconds += delta;
        animateCount(hourCountEl(), from, _totalWatchedSeconds);
    }
});

const setStatisticsOverview = (channelIds, videoIds, storage) => {
    document.getElementById('nodata').style.display = channelIds.length ? 'none' : 'flex';
    document.getElementById('statisticsOverview').style.display = channelIds.length ? 'flex' : 'none';
    document.getElementById('allStatisticsLink').style.display = channelIds.length ? 'flex' : 'none';

    _totalWatchedSeconds = videoIds.reduce((p, c) => p + (storage[c]?.watched ?? 0), 0);
    animateCount(hourCountEl(), 0, _totalWatchedSeconds, 1500, 'easeOut');
};

const setChannelStatistics = (channelIds, videoIds, storage) => {
    const findChannelId = (url) => {
        const videoMatch = url.match(/[?&]v=([\w\-]+)/);
        if (videoMatch?.length === 2) {
            const videoId = videoMatch[1];
            return channelIds.find(c => storage[c].videos.indexOf(videoId) !== -1);
        }

        const channelNameMatch = url.match(/\/@([^\/]*)/);
        if (channelNameMatch?.length === 2) {
            const name = channelNameMatch[1].replaceAll(' ', '').toLowerCase();
            return channelIds.find(c => storage[c].author.replaceAll(' ', '').toLowerCase() === name);
        }

        const channelIdMatch = url.match(/\/channel\/(.*)/);
        if (channelIdMatch?.length === 2) {
            const id = channelIdMatch[1];
            return channelIds.find(c => c === id);
        }
    };

    const setChannelViewVisble = () =>
        document.getElementById('channelStatistics').style.display = 'flex';

    const updateChannelView = (channel) => {
        document.getElementById('channelName').innerText = channel.author;
        document.getElementById('channelVideoCount').innerText = channel.videos.length;
        document.getElementById('channelHourCount').innerText = formatDuration(channel.videos.reduce((p, c) => p + (storage[c]?.watched ?? 0), 0));
    };

    const ActiveTabQuery = { active: true, currentWindow: true };
    chrome.tabs.query(ActiveTabQuery).then(tabs => {
        if (tabs[0].url) {
            const channelId = findChannelId(tabs[0].url);
            if (channelId) {
                setChannelViewVisble();
                updateChannelView(storage[channelId]);
            }
        }
    });
};

const setStatisticsLink = () => {
    const container = document.getElementById('allStatisticsLink');
    const text = document.createElement('span');
    text.innerHTML = 'See all&nbsp;';
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = chrome.runtime.getURL('public/channels.html');
    link.innerText = 'channel stats';
    link.className = 'emphasis';
    text.appendChild(link);
    container.appendChild(text);
}

const setStorePageLinks = () => {
    const help = document.getElementById('help');
    const isFirefox = navigator.userAgent.includes('Firefox');
    const storeUrl = isFirefox
        ? 'https://addons.mozilla.org/firefox/addon/faster-for-youtube/'
        : 'https://chrome.google.com/webstore/detail/faster-for-youtube/efbbmeojmlmbelbcfgcjpijfjeeleidh';
    help.onclick = () => window.open(storeUrl, '_blank');
};

const renderMilestoneBadges = (record) => {
    const earned = record?.earned ?? {};
    const categories = [...new Set(MILESTONES.map(m => m.category))];
    const top = categories.flatMap(cat => {
        const best = MILESTONES.filter(m => m.category === cat && earned[m.id])
            .sort((a, b) => earned[b.id] - earned[a.id])[0];
        return best ? [best] : [];
    });
    if (!top.length) return;

    const container = document.getElementById('milestones');
    container.style.display = 'flex';
    for (const m of top) {
        const badge = document.createElement('span');
        badge.className = 'milestone-badge';
        badge.innerHTML = m.svg;
        badge.title = `${m.label} — ${m.description}`;
        container.appendChild(badge);
    }
};

chrome.storage.local.get((storage) => {
    setPopUpBehavior();
    let [channelIds, videoIds] = splitChannelsAndVideos(storage);
    setStatisticsOverview(channelIds, videoIds, storage);
    setChannelStatistics(channelIds, videoIds, storage);
    setStatisticsLink();
    setStorePageLinks();
    renderMilestoneBadges(evaluateMilestones(storage));
});