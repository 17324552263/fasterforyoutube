
window.EdgeCasesDataset = buildDataset([
    // Channel at 1x — no time saved
    { id: 'UCaaaaaaaaaaaaaaaaaaaaaaaa', author: 'No Speed Change',   rate: 1,   videoCount: 5 },

    // Channel at max standard speed
    { id: 'UCbbbbbbbbbbbbbbbbbbbbbbbb', author: 'Max Speed 3x',      rate: 3,   videoCount: 4 },

    // Channel with a single video
    { id: 'UCcccccccccccccccccccccccc', author: 'One Video Only',    rate: 2,   videoCount: 1 },

    // Channel with no videos
    { id: 'UCdddddddddddddddddddddddd', author: 'No Videos Yet',     rate: 1.5, videoCount: 0 },

    // Channel with orphaned video references (video keys missing from storage)
    {
        id: 'UCeeeeeeeeeeeeeeeeeeeeeeee', author: 'Orphaned Videos', rate: 2,
        videoIds: ['orphan_vid_0', 'orphan_vid_1', 'real_vid_0'],
        skipVideos: ['orphan_vid_0', 'orphan_vid_1'],
    },

    // Channel with very long name
    {
        id: 'UCffffffffffffffffffffff', author: 'A Very Long Channel Name That Should Overflow The Available Display Space',
        rate: 2, videoCount: 3,
    },

    // Channel with very high watch time (hundreds of hours)
    {
        id: 'UCgggggggggggggggggggggggg', author: 'Heavy Watcher',   rate: 2,
        videoCount: 20,
        elapsed: () => 14400, // 4 hours each
    },
]);
