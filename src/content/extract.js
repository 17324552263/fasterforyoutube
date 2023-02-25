(() => {
    const extractVideoDetails = (event) => {
        const videoDetails = event.detail?.response?.playerResponse?.videoDetails;
        return {
            'author': videoDetails.author,
            'channelId': videoDetails.channelId,
            'videoId': videoDetails.videoId
        };
    };

    const sendMessage = videoDetails => window.postMessage(
        Object.assign({'source': '_FasterFor_', 'type': 'videoRequest'}, videoDetails));

    const isPageWatch = event => event?.detail?.pageType === 'watch';

    document.addEventListener('yt-navigate-finish', event =>
        isPageWatch(event) && sendMessage(extractVideoDetails(event)));
})();