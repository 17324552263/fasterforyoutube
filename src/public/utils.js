
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
    const animFrom = Math.max(from, unitThreshold(to));

    // Reserve the final value's width before any frame runs.
    el.innerHTML = formatWatchedTimeHTML(to);
    el.style.display = 'inline-block';
    el.style.minWidth = el.offsetWidth + 'px';

    // Decompose a seconds value into unit parts.
    const dec = (s) => ({
        w: Math.floor(s / 604800),
        d: Math.floor((s % 604800) / 86400),
        h: Math.floor((s % 86400) / 3600),
        m: Math.floor((s % 3600) / 60),
        s: Math.floor(s % 60),
    });
    const f = dec(animFrom), g = dec(to);

    // Each unit gets its own independent counter with a staggered start.
    // Most significant unit begins immediately; each subsequent unit follows
    // STAGGER ms later. This creates a "progressive precision" cascade:
    // weeks settle first, then days, then hours, then minutes.
    const STAGGER = 120;
    const units = to >= 604800 ? ['w','d','h','m']
                : to >= 86400  ? ['d','h','m']
                : to >= 3600   ? ['h','m']
                : to >= 60     ? ['m','s']
                :                ['s'];

    const ease = (x) => easing === 'easeOut' ? 1 - Math.pow(1 - x, 3) : x;

    const render = (p) => {
        if (to >= 604800) return `${p.w}w` + _sub(p.d,'d') + _sub(p.h,'h') + _sub(p.m,'m');
        if (to >= 86400)  return `${p.d}d` + _sub(p.h,'h') + _sub(p.m,'m');
        if (to >= 3600)   return `${p.h}h` + _sub(p.m,'m');
        if (to >= 60)     return `${p.m}m` + _sub(p.s,'s');
        return `${p.s}s`;
    };

    const totalDuration = duration + STAGGER * (units.length - 1);

    return new Promise(resolve => {
        const startTime = performance.now();
        const tick = (now) => {
            const elapsed = now - startTime;
            const parts = { ...g };
            units.forEach((unit, i) => {
                const progress = Math.min(Math.max(0, elapsed - i * STAGGER) / duration, 1);
                parts[unit] = Math.round(f[unit] + (g[unit] - f[unit]) * ease(progress));
            });
            el.innerHTML = render(parts);
            if (elapsed < totalDuration) requestAnimationFrame(tick);
            else resolve();
        };
        requestAnimationFrame(tick);
    });
};
