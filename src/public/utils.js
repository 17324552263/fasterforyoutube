
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

// Pads a sub-unit number with a figure space (\u2007) when single-digit.
// \u2007 is defined to match digit width, pairing with tabular-nums to keep
// sub-unit columns stable as values tick from 9 → 10.
const _fp = (n) => n < 10 ? `\u2007${n}` : `${n}`;

const formatWatchedTime = (seconds) => {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    if (seconds < 3600) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return s > 0 ? `${m}m ${_fp(s)}s` : `${m}m`;
    }
    if (seconds < 86400) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return m > 0 ? `${h}h ${_fp(m)}m` : `${h}h`;
    }
    if (seconds < 604800) {
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        let s = `${d}d`;
        if (h > 0) s += ` ${_fp(h)}h`;
        if (m > 0) s += ` ${_fp(m)}m`;
        return s;
    }
    const w = Math.floor(seconds / 604800);
    const d = Math.floor((seconds % 604800) / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    let s = `${w}w`;
    if (d > 0) s += ` ${_fp(d)}d`;
    if (h > 0) s += ` ${_fp(h)}h`;
    if (m > 0) s += ` ${_fp(m)}m`;
    return s;
};

// HTML variant used by animateCount. For non-zero sub-units the number and
// label are both visible. For zero sub-units the number is hidden but the
// label stays visible — so "  d" appears instead of nothing or "0d".
// Every character position is always occupied, keeping the width stable.
const _sub = (n, unit) => {
    const num = n > 0 ? _fp(n) : `<span style="visibility:hidden">${_fp(0)}</span>`;
    return ` ${num}${unit}`;
};

const formatWatchedTimeHTML = (seconds) => {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    if (seconds < 3600) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}m` + _sub(s, 's');
    }
    if (seconds < 86400) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h` + _sub(m, 'm');
    }
    if (seconds < 604800) {
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${d}d` + _sub(h, 'h') + _sub(m, 'm');
    }
    const w = Math.floor(seconds / 604800);
    const d = Math.floor((seconds % 604800) / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${w}w` + _sub(d, 'd') + _sub(h, 'h') + _sub(m, 'm');
};

// Returns the lower boundary of the unit tier for `seconds`,
// so animations stay within one unit format and avoid layout jank.
const unitThreshold = (seconds) => {
    if (seconds >= 604800) return 604800;
    if (seconds >= 86400)  return 86400;
    if (seconds >= 3600)   return 3600;
    if (seconds >= 60)     return 60;
    return 0;
};

// easing: 'linear' or 'easeOut'
const animateCount = (el, from, to, duration = 1000, easing = 'easeOut') => {
    if (!el) return new Promise(r => r());
    // Clamp the start to the unit tier of `to` so the format string
    // never changes mid-animation (eliminates text-layout jank).
    const animFrom = Math.max(from, unitThreshold(to));
    // Reserve the final value's full width (including hidden placeholders for
    // zero sub-units) before animating so surrounding text never moves.
    el.innerHTML = formatWatchedTimeHTML(to);
    el.style.display = 'inline-block';
    el.style.minWidth = el.offsetWidth + 'px';
    return new Promise(resolve => {
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const e = easing === 'easeOut' ? 1 - Math.pow(1 - t, 3) : t;
            el.innerHTML = formatWatchedTimeHTML(animFrom + (to - animFrom) * e);
            if (t < 1) requestAnimationFrame(tick);
            else resolve();
        };
        requestAnimationFrame(tick);
    });
};
