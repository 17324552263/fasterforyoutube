
const storage = {
    'UCabc123': { author: 'Test Channel', rate: 2, videos: ['vid1', 'vid2'] },
    'UCdef456': { author: 'Empty Channel', rate: 1.5, videos: [] },
    'vid1': { elapsed: 600,  watched: 300 },
    'vid2': { elapsed: 1200, watched: 600 },
};

describe('buildChannelsWithVideos', () => {
    const result = buildChannelsWithVideos(storage);

    it('returns only channel entries', () =>
        assert.equal(result.length, 2));

    it('maps channel id', () =>
        assert.equal(result[0].id, 'UCabc123'));

    it('maps author', () =>
        assert.equal(result[0].author, 'Test Channel'));

    it('maps rate', () =>
        assert.equal(result[0].rate, 2));

    it('resolves video objects from storage', () =>
        assert.equal(result[0].videos.length, 2));

    it('resolved video has correct elapsed', () =>
        assert.equal(result[0].videos[0].elapsed, 600));

    it('resolved video has correct watched', () =>
        assert.equal(result[0].videos[0].watched, 300));

    it('handles missing video with zero fallback', () => {
        const s = { 'UCzzz': { author: 'X', rate: 1, videos: ['missing'] } };
        const r = buildChannelsWithVideos(s);
        assert.equal(r[0].videos[0].elapsed, 0);
        assert.equal(r[0].videos[0].watched, 0);
    });

    it('handles channel with no videos', () =>
        assert.equal(result[1].videos.length, 0));
});

describe('createChannelSummary', () => {
    const channels = [{
        id: 'UCabc123', author: 'Test Channel', rate: 2,
        videos: [
            { elapsed: 600,  watched: 300 },
            { elapsed: 1200, watched: 600 },
        ],
    }];

    createChannelSummary(channels);

    it('sets hourCount', () =>
        assert.equal(document.getElementById('hourCount').textContent, (0.25).toFixed(2)));

    it('sets videoCount', () =>
        assert.equal(document.getElementById('videoCount').textContent, '2'));

    it('sets channelCount', () =>
        assert.equal(document.getElementById('channelCount').textContent, '1'));

    it('sets averageSpeed', () => {
        const elapsed = 1800, watched = 900;
        assert.equal(document.getElementById('averageSpeed').textContent,
            ((elapsed + watched) / elapsed).toFixed(2));
    });
});

describe('toggleChannelsVisibility', () => {
    it('shows results when channels exist', () => {
        toggleChannelsVisibility(true);
        assert.equal(document.getElementById('nochannels').style.display, 'none');
        assert.equal(document.getElementById('channel-results').style.display, 'flex');
    });

    it('shows empty state when no channels', () => {
        toggleChannelsVisibility(false);
        assert.equal(document.getElementById('nochannels').style.display, 'flex');
        assert.equal(document.getElementById('channel-results').style.display, 'none');
    });
});
