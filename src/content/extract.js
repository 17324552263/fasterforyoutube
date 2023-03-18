(() => {
    const extractVideoDetails = (event) => {
        const playerResponse = event.detail.response.playerResponse;
        return {
            'author': playerResponse?.videoDetails?.author,
            'channelId': playerResponse?.videoDetails?.channelId,
            'videoId': playerResponse?.videoDetails?.videoId,
            'status': playerResponse.playabilityStatus.status
        };
    };

    const sendMessage = videoDetails => window.postMessage(
        Object.assign({'source': '_FasterFor_', 'type': 'videoRequest'}, videoDetails));

    const isPageWatch = event => event?.detail?.pageType === 'watch';

    document.addEventListener('yt-navigate-finish', event => {
        if (isPageWatch(event)) {
            const videoDetails = extractVideoDetails(event);
            if (videoDetails.status !== 'ERROR') {
                sendMessage(videoDetails);
            }
        }
    });

    const isPageEmbedVideo = (pathname) => pathname.indexOf('/embed/') === 0 && pathname.length > 7;
    const isControlsAllowed = (search) => search.indexOf('controls=0') === -1;
    if (isPageEmbedVideo(document.location.pathname)) {
        const videoDetails = {
            'author': document.querySelector('.ytp-title-expanded-title > a').textContent,
            'channelId': document.querySelector("a.ytp-title-channel-logo").href.match(/\/(?:channel|c|user)\/(UC[a-zA-Z0-9_-]{22}|[a-zA-Z0-9_-]+)/)[1],
            'videoId': document.location.pathname.match(/\/embed\/(.*)/)[1],
            'status': isControlsAllowed(document.location.search) ? 'OK' : 'NOCONTROLS'
        };
        sendMessage(videoDetails);
    }
})();