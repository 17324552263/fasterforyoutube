var dt = new Date().getTime();
var FFYP_UUID = Array(8).fill('x').map(i => {
    const r = (dt + Math.random()*16)%16 | 0;
    dt = Math.floor(dt/16);
    return r.toString(16);
}).join('');
// FFYP UUID is a gloabl identifier for this injection of scripts.
// We could have multiple copies of a content script injected into
// a page that has more than one embedded video.
// When the background page messages a video response to the tab,
// all the scripts would get notified. This causes each new response
// to overwrite all previous video-id-specific responses. This UUID
// could have been the video-id if we could guarantee finding it in
// the url.

(() => {
    const attachExtractionScript = () => {
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('content/extract.js');
        document.head.appendChild(s).onload = () => s.remove();
    };
    
    const forwardMessageToRuntime = () => window.addEventListener('message', event =>
        event?.data?.source === '_FasterFor_' && chrome.runtime.sendMessage(Object.assign(
            {}, event?.data, {'uuid': FFYP_UUID})));

    attachExtractionScript();
    forwardMessageToRuntime();
})();