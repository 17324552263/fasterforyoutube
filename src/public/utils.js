
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
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    if (seconds < 3600) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return s > 0 ? `${m}m ${s}s` : `${m}m`;
    }
    if (seconds < 86400) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    if (seconds < 604800) {
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        let s = `${d}d`;
        if (h > 0) s += ` ${h}h`;
        if (m > 0) s += ` ${m}m`;
        return s;
    }
    const w = Math.floor(seconds / 604800);
    const d = Math.floor((seconds % 604800) / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    let s = `${w}w`;
    if (d > 0) s += ` ${d}d`;
    if (h > 0) s += ` ${h}h`;
    if (m > 0) s += ` ${m}m`;
    return s;
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
