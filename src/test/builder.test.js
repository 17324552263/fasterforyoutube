
describe('buildDataset — watched formula', () => {
    it('uses elapsed × (rate − 1) at 2x', () => {
        const storage = buildDataset([
            { id: 'UCaaaaaaaaaaaaaaaaaaaaaaaa', author: 'Test', rate: 2, videoCount: 1 },
        ]);
        const vId = Object.keys(storage).find(k => !k.startsWith('UC'));
        const { elapsed, watched } = storage[vId];
        assert.equal(watched, Math.floor(elapsed * (2 - 1)));
    });

    it('watched equals elapsed at 2x', () => {
        const storage = buildDataset([
            { id: 'UCaaaaaaaaaaaaaaaaaaaaaaaa', author: 'Test', rate: 2, videoCount: 1 },
        ]);
        const vId = Object.keys(storage).find(k => !k.startsWith('UC'));
        assert.equal(storage[vId].watched, storage[vId].elapsed);
    });

    it('uses elapsed × (rate − 1) at 1.5x', () => {
        const storage = buildDataset([
            { id: 'UCaaaaaaaaaaaaaaaaaaaaaaaa', author: 'Test', rate: 1.5, videoCount: 1 },
        ]);
        const vId = Object.keys(storage).find(k => !k.startsWith('UC'));
        const { elapsed, watched } = storage[vId];
        assert.equal(watched, Math.floor(elapsed * (1.5 - 1)));
    });

    it('uses elapsed × (rate − 1) at 5x', () => {
        const storage = buildDataset([
            { id: 'UCaaaaaaaaaaaaaaaaaaaaaaaa', author: 'Test', rate: 5, videoCount: 1 },
        ]);
        const vId = Object.keys(storage).find(k => !k.startsWith('UC'));
        const { elapsed, watched } = storage[vId];
        assert.equal(watched, Math.floor(elapsed * (5 - 1)));
    });
});

describe('buildDataset — daily/video totals consistency', () => {
    const daily = buildDailyData([
        { daysAgo: 0, elapsed: 3600, watched: 1800 },
        { daysAgo: 1, elapsed: 2400, watched: 1200 },
        { daysAgo: 3, elapsed: 1800, watched:  900 },
    ]);
    const storage = buildDataset([
        { id: 'UCaaaaaaaaaaaaaaaaaaaaaaaa', author: 'Channel A', rate: 2,   videoCount: 3 },
        { id: 'UCbbbbbbbbbbbbbbbbbbbbbbbb', author: 'Channel B', rate: 1.5, videoCount: 2 },
        { id: 'UCcccccccccccccccccccccccc', author: 'Channel C', rate: 4,   videoCount: 2 },
    ], daily);

    const videoIds = Object.keys(storage).filter(k => !k.startsWith('UC') && k !== '_daily');
    const videoWatched = videoIds.reduce((s, id) => s + storage[id].watched, 0);
    const videoElapsed = videoIds.reduce((s, id) => s + storage[id].elapsed, 0);
    const dailyWatched = Object.values(storage['_daily']).reduce((s, d) => s + d.watched, 0);
    const dailyElapsed = Object.values(storage['_daily']).reduce((s, d) => s + d.elapsed, 0);

    it('daily watched total matches video watched total', () =>
        assert.equal(dailyWatched, videoWatched));

    it('daily elapsed total matches video elapsed total', () =>
        assert.equal(dailyElapsed, videoElapsed));

    it('daily watched total is not the unscaled input sum', () => {
        // Input watched sum = 3900 — if scaling is skipped this would pass through unchanged
        assert.notEqual(dailyWatched, 3900);
    });

    it('daily preserves relative day proportions', () => {
        // Day 0 had elapsed=3600, day 1 had elapsed=2400 — ratio 3:2.
        // After scaling, elapsed values should preserve that ratio.
        const keys = Object.keys(storage['_daily']).sort().reverse(); // most recent first
        const d0 = storage['_daily'][keys[0]].elapsed;
        const d1 = storage['_daily'][keys[1]].elapsed;
        assert.equal(Math.round(d0 / d1 * 10), Math.round((3600 / 2400) * 10));
    });
});
