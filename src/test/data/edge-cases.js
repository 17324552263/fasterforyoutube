
const _edgeChannels = [
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

    // Channel at 3.5x
    { id: 'UChhhhhhhhhhhhhhhhhhhhhhhh', author: 'Speed 3.5x',        rate: 3.5, videoCount: 5 },

    // Channel at 4x
    { id: 'UCiiiiiiiiiiiiiiiiiiiiiiii', author: 'Speed Demon 4x',    rate: 4,   videoCount: 6 },

    // Channel at 4.5x
    { id: 'UCjjjjjjjjjjjjjjjjjjjjjj', author: 'Speed 4.5x',        rate: 4.5, videoCount: 4 },

    // Channel at max speed 5x
    { id: 'UCkkkkkkkkkkkkkkkkkkkkkkkk', author: 'Max Speed 5x',      rate: 5,   videoCount: 3 },
];

// Legacy: no activity history (_daily absent) — backwards compat baseline
window.EdgeCasesDataset = buildDataset(_edgeChannels);

// New: same channels + activity data
window.EdgeCasesWithActivity = buildDataset(_edgeChannels, buildDailyData([
    { daysAgo: 0,  elapsed: 1800, watched: 900  },
    { daysAgo: 2,  elapsed: 5400, watched: 2700 },
    { daysAgo: 3,  elapsed: 7200, watched: 3600 },
    { daysAgo: 7,  elapsed: 3600, watched: 1800 },
    { daysAgo: 10, elapsed: 1200, watched:  600 },
]));

// Daily edge case: only a single day of activity (today)
// Tests that both charts render without errors on minimal data.
window.ActivitySingleDayDataset = buildDataset(_edgeChannels, buildDailyData([
    { daysAgo: 0, elapsed: 600, watched: 300 },
]));

// Daily edge case: a few scattered days over the past year
// Tests sparse heatmap rendering — most cells empty.
window.ActivitySparseDataset = buildDataset(_edgeChannels, buildDailyData([
    { daysAgo: 3,   elapsed: 1800, watched:  900 },
    { daysAgo: 47,  elapsed: 3600, watched: 1800 },
    { daysAgo: 130, elapsed: 2400, watched: 1200 },
    { daysAgo: 251, elapsed: 1200, watched:  600 },
    { daysAgo: 340, elapsed: 900,  watched:  450 },
]));

// Daily edge case: 45 consecutive days of activity ending today
// Tests dense heatmap and line chart with continuous data.
window.ActivityDenseStreakDataset = buildDataset(_edgeChannels,
    buildDailyRange(45, (i) => ({
        elapsed: 3600 + (i * 479) % 3600,
        watched: 1800 + (i * 271) % 1800,
    }))
);

// Daily edge case: all activity is older than 365 days (beyond heatmap range)
// Both charts should render empty / show no data for the visible window.
window.ActivityBeyondRangeDataset = buildDataset(_edgeChannels, buildDailyData([
    { daysAgo: 380, elapsed: 3600, watched: 1800 },
    { daysAgo: 400, elapsed: 7200, watched: 3600 },
    { daysAgo: 450, elapsed: 1800, watched:  900 },
]));

// Daily edge case: extreme spike — one very heavy day surrounded by light days
// Tests that color scaling doesn't wash out lower-intensity cells.
window.ActivitySpikyDataset = buildDataset(_edgeChannels, buildDailyData([
    { daysAgo: 0,  elapsed:   900, watched:   450 },
    { daysAgo: 1,  elapsed:  1200, watched:   600 },
    { daysAgo: 2,  elapsed: 72000, watched: 36000 }, // 20h session — the spike
    { daysAgo: 3,  elapsed:  1800, watched:   900 },
    { daysAgo: 4,  elapsed:   600, watched:   300 },
    { daysAgo: 5,  elapsed:  1500, watched:   750 },
]));
