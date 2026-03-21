
const formatDuration = (seconds) => {
    if (seconds < 60)   return `${Math.floor(seconds)}s`;
    if (seconds < 3600) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return s > 0 ? `${m}m ${s}s` : `${m}m`;
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

const formatWatchedTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = (seconds % 60).toFixed(1).padStart(4, '0');
    return `${h}:${String(m).padStart(2, '0')}:${s}`;
};

// easing: 'linear' or 'easeOut'
const animateCount = (el, from, to, duration = 1000, easing = 'linear') => {
    if (!el) return new Promise(r => r());
    return new Promise(resolve => {
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const e = easing === 'easeOut' ? 1 - Math.pow(1 - t, 3) : t;
            el.innerText = formatWatchedTime(from + (to - from) * e);
            if (t < 1) requestAnimationFrame(tick);
            else resolve();
        };
        requestAnimationFrame(tick);
    });
};
