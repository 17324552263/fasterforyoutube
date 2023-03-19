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

const setStatisticsOverview = (channelIds, videoIds, storage) => {
    document.getElementById('nodata').style.display = channelIds.length ? 'none' : 'flex';
    document.getElementById('statisticsOverview').style.display = channelIds.length ? 'flex' : 'none';
    document.getElementById('allStatisticsLink').style.display = channelIds.length ? 'flex' : 'none';

    const watchedSeconds = videoIds.reduce((p, c) => p + storage[c].watched, 0);
    document.getElementById('allHourCount').innerText = (watchedSeconds / 3600).toFixed(2);
};

const setChannelStatistics = (channelIds, videoIds, storage) => {
    const findChannelId = (url) => {
        const videoMatch = url.match(/\?v=(.*)/);
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
        document.getElementById('channelHourCount').innerText = (channel.videos.reduce((p, c) => p + storage[c].watched, 0) / 3600).toFixed(2);
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
    link.innerText = 'Channel Statistics!';
    link.className = 'emphasis';
    text.appendChild(link);
    container.appendChild(text);
}

const setStorePageLinks = () => {
    const help = document.getElementById('help');
    help.onclick = () => window.open('https://chrome.google.com/webstore/detail/faster-for-youtube/efbbmeojmlmbelbcfgcjpijfjeeleidh', '_blank');
};

chrome.storage.local.get((storage) => {
    setPopUpBehavior();
    let [channelIds, videoIds] = splitChannelsAndVideos(storage);
    setStatisticsOverview(channelIds, videoIds, storage);
    setChannelStatistics(channelIds, videoIds, storage);
    setStatisticsLink();
    setStorePageLinks();
});