
const broadcastSpeedUpdated = (tabId, request) => 
    chrome.tabs.sendMessage(tabId, Object.assign({}, 
        request,
        { 'type': 'speedUpdated' }));

const save = (id, value) => chrome.storage.local.set({[id]: value});

const fetchVideo = (id) => new Promise((resolve) =>
    chrome.storage.local.get(id)
        .then(value => resolve(value?.[id] ?? {'elapsed': 0, 'watched': 0}))
);

const updateVideoStats = (id, elapsed, watched) =>
    fetchVideo(id)
        .then(video => {
            video.elapsed += elapsed;
            video.watched += watched;
            save(id, video)
        });

const fetchChannel = (id) => new Promise((resolve) =>
    chrome.storage.local.get(id)
        .then(value => resolve(value?.[id] ?? {'videos': []})));

const saveChannel = (request) => 
    fetchChannel(request.channelId)
        .then(channel => {
            if (!channel.videos.includes(request.videoId)) {
                channel.videos.push(request.videoId);
            }

            save(request.channelId, {
                'author': request.author,
                'rate': request.rate,
                'videos': channel.videos
            });
        });

const sendVideoResponse = (tabId, request, rate) =>
    chrome.tabs.sendMessage(tabId, Object.assign({},
        request, {
            'type': 'videoResponse',
            'rate': rate
        }));

const broadcastVideoResponse = (tabId, request) => 
    fetchChannel(request.channelId).then(channel =>
        sendVideoResponse(tabId, Object.assign({}, request, {'author': request?.author || channel?.author}), channel?.rate ?? null));

chrome.runtime.onMessage.addListener((request, sender, _) => {
    if (request.type === 'videoRequest') {
        if (request.status === 'OK') {
            broadcastVideoResponse(sender.tab.id, request);
        } else {
            console.info(`Video ${request?.videoId} has status ${request.status}`);
        }
    } else if (request.type === 'speedUpdated') {
        saveChannel(request);
        broadcastSpeedUpdated(sender.tab.id, request);
    } else if (request.type === 'heartbeat') {
        saveChannel(request);
        updateVideoStats(request.videoId, request.elapsed, request.watched);
    }
});