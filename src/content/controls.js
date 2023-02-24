
(() => {
    const PlaybackSpeedDefaults = [1, 1.5, 2, 2.5, 3];

    class CSSClassHelper {
        static Button = 'ytp-button';
        static SpeedButton = 'faster-button';
        static SpeedButtonSelected = 'faster-button-selected';
        static SpeedButtonClasses = [CSSClassHelper.Button, CSSClassHelper.SpeedButton];

        static SpeedParentWidget = 'speed-widget';
        static SpeedControlsContainer = 'speed-widget-controls';
    }

    class DOMHelper {
        static Video = 'video[src]';
        static VideoContainer = `div.html5-video-container:has(${DOMHelper.Video})`;
        static SiblingToken = ' ~ ';
        static ControlContainer = 'div.ytp-chrome-bottom .ytp-left-controls';

        static fetchVideo = () => document.querySelector(DOMHelper.Video);
        static fetchSpeedButtons = () => document.querySelectorAll(`span.${CSSClassHelper.SpeedButton}`)
        static fetchVideoControls = () => document.querySelector([
            DOMHelper.VideoContainer, DOMHelper.SiblingToken, DOMHelper.ControlContainer].join(''));
    }

    const setSpeedLabelActive = (speed) => {
        for (let child of DOMHelper.fetchSpeedButtons()) {
            child.classList.remove(CSSClassHelper.SpeedButtonSelected);
            if (child.dataset.speed === speed.toFixed(1)) {
                child.classList.add(CSSClassHelper.SpeedButtonSelected);
            }
        }
    };

    const videoSpeedControlContainer = (video) => {
        const createSpeedParent = () => {
            const speedParent = document.createElement('div');
            speedParent.className = CSSClassHelper.SpeedParentWidget;
            return speedParent;
        };
        const createSpeedLabel = () => {
            const indicator = document.createElement('span');
            indicator.innerText = 'Speed: ';
            indicator.style.fontWeight = 'bold';
            return indicator;
        };
        const createControlsContainer = () => {
            const container = document.createElement('div');
            container.id = '_faster_for_speed_controls';
            container.className = CSSClassHelper.SpeedControlsContainer;
            return container;
        };
        const updateVideoSpeed = (speed) => {
            DOMHelper.fetchVideo().playbackRate = speed;
            setSpeedLabelActive(speed);
        };
        const broadcastSpeedUpdate = speed => chrome.runtime.sendMessage(Object.assign({}, video,
            {'type': 'speedUpdated', 'rate': speed}));
        const createSpeedButton = (speed) => {
            const b = document.createElement('span');
            b.dataset.speed = speed.toFixed(1);
            b.classList.add(...CSSClassHelper.SpeedButtonClasses);
            b.addEventListener('click', () => {
                updateVideoSpeed(speed);
                broadcastSpeedUpdate(speed);
            });
            return b;
        }

        const parent = createSpeedParent();
        parent.appendChild(createSpeedLabel());
        const container = parent.appendChild(createControlsContainer());
        PlaybackSpeedDefaults.forEach(v => container.appendChild(createSpeedButton(v)));
        return parent;
    };

    const addVideoControlsToPage = (video) => {
        const setSpeedFromEvent = (event) => setSpeedLabelActive(event.target.playbackRate);
        const attachVideoRateChangeUpdate = () => DOMHelper.fetchVideo().addEventListener('ratechange', setSpeedFromEvent);

        const playerControlContainer = DOMHelper.fetchVideoControls();
        const needsControlsAdded = (e) => !e.querySelector('#_faster_for_speed_controls');

        needsControlsAdded(playerControlContainer) && playerControlContainer.appendChild(videoSpeedControlContainer(video));
        attachVideoRateChangeUpdate();
    };

    const updateHTMLVideoPlaybackRate = (rate) => DOMHelper.fetchVideo().playbackRate = rate;

    chrome.runtime.onMessage.addListener((request) => {
        if (request.type === 'videoResponse') {
            const video = {
                'channelId': request.channelId,
                'author': request.author,
                'rate': request.rate ?? DOMHelper.fetchVideo().playbackRate,
                'videoId': request.videoId
            };
            addVideoControlsToPage(video);
            updateHTMLVideoPlaybackRate(video.rate);
            setSpeedLabelActive(video.rate);
        }
    });
})();