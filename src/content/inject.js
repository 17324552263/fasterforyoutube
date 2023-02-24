(() => {
    const attachExtractionScript = () => {
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('content/extract.js');
        document.head.appendChild(s).onload = () => s.remove();
    };
    
    const forwardMessageToRuntime = () => window.addEventListener('message', event =>
        event?.data?.source === '_FasterFor_' && chrome.runtime.sendMessage(event?.data));

    attachExtractionScript();
    forwardMessageToRuntime();
})();