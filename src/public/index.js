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
    document.getElementById('channelCount').innerText = channelIds.length;
    document.getElementById('videoCount').innerText = videoIds.length;

    const watchedSeconds = videoIds.reduce((p, c) => p + storage[c].watched, 0);
    document.getElementById('hourCount').innerText = (watchedSeconds / 3600).toFixed(2);
};

const setStatisticsLink = () => {
    const container = document.getElementById('channelStatistics');
    const text = document.createElement('span');
    text.innerHTML = 'Check out your&nbsp;';
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = chrome.runtime.getURL('public/channels.html');
    link.innerText = 'Channel Statistics!';
    link.className = 'emphasis';
    text.appendChild(link);
    container.appendChild(text);
}

chrome.storage.local.get((storage) => {
    setPopUpBehavior();
    let [channelIds, videoIds] = splitChannelsAndVideos(storage);
    setStatisticsOverview(channelIds, videoIds, storage);
    setStatisticsLink();
});