
(() => {
    class StatisticsController {
        static _timeoutId = null;
        static _intervalId = null;
        static _intervalMilliseconds = 1000;
        static _playbackRate = null;

        static setRate = (rate) => StatisticsController._playbackRate = rate;

        static collect = (sendHeartbeat) => {
            StatisticsController._stop();
            const startCollecting = (shouldSendNow) => StatisticsController._start(sendHeartbeat, shouldSendNow);
    
            const video = document.querySelector('video[src]');
            video.addEventListener('play', startCollecting);
            video.addEventListener('pause', () => StatisticsController._stop());
    
            StatisticsController.catchPlayingVideo(video, startCollecting);
        }

        static _start = (sendHeartbeat, shouldSendNow = false) => {
            if (!StatisticsController._intervalId) {
                shouldSendNow && sendHeartbeat(StatisticsController._playbackRate);
                StatisticsController._intervalId = setInterval(() => {
                        const video = document.querySelector('video[src]');
                        if (!video || video?.paused) {
                            StatisticsController._stop();
                        } else {
                            sendHeartbeat(StatisticsController._playbackRate)
                        }
                    },
                    StatisticsController._intervalMilliseconds);
            }
        };
        static _stop = () => {
            if (StatisticsController._intervalId) {
                clearInterval(StatisticsController._intervalId);
                StatisticsController._intervalId = null;
            }

            if (StatisticsController._timeoutId) {
                clearTimeout(StatisticsController._timeoutId);
                StatisticsController._timeoutId = null;
            }
        };
        static catchPlayingVideo = (video, startCollecting) => {
            StatisticsController._timeoutId = setTimeout(() => {
                    StatisticsController._timeoutId = null;
                    if (!video.paused && !StatisticsController._intervalId) {
                        startCollecting(true);
                    }
                },
                StatisticsController._intervalMilliseconds);
        }
    }

    chrome.runtime.onMessage.addListener((request) => {
        if (['videoResponse', 'speedUpdated'].includes(request.type)) {
            StatisticsController.setRate(request.rate);
            if (request.type === 'videoResponse' && request.uuid === FFYP_UUID) {
                const sendHeartbeat = (rate) => (rate > 1) && chrome.runtime.sendMessage({
                    'channelId': request.channelId,
                    'author': request.author,
                    'videoId': request.videoId,
                    'rate': rate,
                    'type': 'heartbeat',
                    'elapsed': 1,
                    'watched': (rate - 1)});
                StatisticsController.collect(sendHeartbeat);
            }
        }
    });
})();