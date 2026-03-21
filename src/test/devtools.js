
const setStatus = (msg, isError = false) => {
    const el = document.getElementById('status');
    el.textContent = msg;
    el.className = isError ? 'err' : 'ok';
    el.style.display = 'block';
};

const showOpenButton = () => {
    const btn = document.getElementById('open-channels');
    btn.style.display = 'block';
    btn.onclick = () => window.open(chrome.runtime.getURL('public/channels.html'));
};

document.querySelectorAll('.dataset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const dataset = window[btn.dataset.dataset];
        if (!dataset) {
            setStatus(`Dataset "${btn.dataset.dataset}" not found.`, true);
            return;
        }
        const entryCount = Object.keys(dataset).length;
        chrome.storage.local.clear(() => {
            chrome.storage.local.set(dataset, () => {
                const label = btn.querySelector('.label').textContent;
                setStatus(`"${label}" loaded — ${entryCount} storage entries.`);
                showOpenButton();
            });
        });
    });
});

document.getElementById('clear-btn').addEventListener('click', () => {
    chrome.storage.local.clear(() => {
        document.getElementById('open-channels').style.display = 'none';
        setStatus('Storage cleared.');
    });
});
