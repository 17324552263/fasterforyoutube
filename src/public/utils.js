
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

    el.innerHTML = formatWatchedTimeHTML(to);
    el.style.display = 'inline-block';
    el.style.minWidth = el.offsetWidth + 'px';

    // Final decomposed values — used for settle and free-roll phases.
    const g = {
        w: Math.floor(to / 604800),
        d: Math.floor((to % 604800) / 86400),
        h: Math.floor((to % 86400) / 3600),
        m: Math.floor((to % 3600) / 60),
        s: Math.floor(to % 60),
    };

    const MODS   = { d: 7, h: 24, m: 60, s: 60 };
    const SCALES = { w: 604800, d: 86400, h: 3600, m: 60, s: 1 };
    const SETTLE = 350; // ms per sub-unit settle spin

    const units = to >= 604800 ? ['w','d','h','m']
                : to >= 86400  ? ['d','h','m']
                : to >= 3600   ? ['h','m']
                : to >= 60     ? ['m','s']
                :                ['s'];

    const primaryEase = (t) => easing === 'easeOut' ? 1 - Math.pow(1 - t, 3) : t;

    const render = (p) => {
        if (to >= 604800) return `${p.w}w` + _sub(p.d,'d') + _sub(p.h,'h') + _sub(p.m,'m');
        if (to >= 86400)  return `${p.d}d` + _sub(p.h,'h') + _sub(p.m,'m');
        if (to >= 3600)   return `${p.h}h` + _sub(p.m,'m');
        if (to >= 60)     return `${p.m}m` + _sub(p.s,'s');
        return `${p.s}s`;
    };

    // Three phases per sub-unit (index i, 0-based within units.slice(1)):
    //
    // 1. ODOMETER  (0 → duration)
    //    All units driven by the interpolated total-seconds value — the natural
    //    cascade where minutes roll into hours, hours into days, etc.
    //
    // 2. FREE ROLL (duration → duration + i*SETTLE)
    //    Primary has settled; sub-unit rolls at constant speed.
    //    Rate is exactly mod ticks per SETTLE ms, so after i*SETTLE ms the
    //    unit has completed i full cycles and arrives cleanly at g[unit].
    //
    // 3. SETTLE    (duration + i*SETTLE → duration + (i+1)*SETTLE)
    //    One final easeOut cycle: g[unit] → g[unit]+mod displayed as %mod.
    //    Starts and ends at g[unit]; decelerates visibly into the final value.

    const totalDuration = duration + units.length * SETTLE; // generous upper bound

    return new Promise(resolve => {
        const startTime = performance.now();
        const tick = (now) => {
            const elapsed = now - startTime;
            const parts = { ...g };

            const primaryT = Math.min(elapsed / duration, 1);
            const currentSeconds = animFrom + (to - animFrom) * primaryEase(primaryT);

            // Primary unit: pure odometer, no modulo.
            parts[units[0]] = Math.floor(currentSeconds / SCALES[units[0]]);

            units.slice(1).forEach((unit, subIdx) => {
                const mod = MODS[unit];

                if (elapsed < duration) {
                    // Phase 1: odometer — all sub-units driven by interpolated seconds.
                    parts[unit] = Math.floor(currentSeconds / SCALES[unit]) % mod;
                } else if (subIdx === 0) {
                    // The first sub-unit (e.g. days when primary is weeks) is already
                    // at g[unit] from the odometer — no free-roll or settle needed.
                    parts[unit] = g[unit];
                } else {
                    // Phases 2 & 3 only apply to sub-units with subIdx >= 1, which
                    // needed to "wait" while closer units settled first.
                    const settleStart = duration + (subIdx - 1) * SETTLE;

                    if (elapsed < settleStart) {
                        // Phase 2: free roll — mod ticks per SETTLE ms, landing on g[unit].
                        const waitElapsed = elapsed - duration;
                        parts[unit] = (g[unit] + Math.floor(mod * (waitElapsed / SETTLE))) % mod;
                    } else {
                        // Phase 3: settle spin — one easeOut cycle landing on g[unit].
                        const settleT = Math.min((elapsed - settleStart) / SETTLE, 1);
                        parts[unit] = Math.floor(g[unit] + mod * primaryEase(settleT)) % mod;
                    }
                }
            });

            el.innerHTML = render(parts);
            if (elapsed < totalDuration) {
                requestAnimationFrame(tick);
            } else {
                // Crossfade to compact format — strips figure-space padding from sub-units.
                const compact = formatWatchedTime(to).replace(/\u2007/g, '');
                el.style.transition = 'opacity 200ms';
                el.style.opacity = '0';
                setTimeout(() => {
                    el.innerHTML = compact;
                    el.style.minWidth = '';
                    el.style.opacity = '1';
                    setTimeout(() => { el.style.transition = ''; resolve(); }, 200);
                }, 200);
            }
        };
        requestAnimationFrame(tick);
    });
};
