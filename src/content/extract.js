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
})();