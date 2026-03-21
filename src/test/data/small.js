
const _smallChannels = [
    { id: 'UCddiUEpeqJcYeBxX1IVBKvQ', author: 'Fireship',   rate: 2,   videoCount: 4 },
    { id: 'UCBcRF18a7Qf58cCRy5xuWwQ', author: 'Mark Rober', rate: 1.5, videoCount: 3 },
    { id: 'UCnUYZLuoy1rq1aVMwx4aTzw', author: 'CGP Grey',   rate: 2.5, videoCount: 2 },
    { id: 'UCVHFbw7woebytfOhLqX3Xww', author: 'Theo – t3',  rate: 4,   videoCount: 2 },
    { id: 'UCHnyfMqiRRG1u-2MsSQLsmol', author: 'ThePrimeagen', rate: 5, videoCount: 1 },
];

// Legacy: no activity history (_daily absent)
window.SmallDataset = buildDataset(_smallChannels);

// New: same channels + 14 days of activity data
window.SmallDatasetWithActivity = buildDataset(_smallChannels, buildDailyData([
    { daysAgo: 0,  elapsed: 2100, watched: 1050 },
    { daysAgo: 1,  elapsed: 3600, watched: 1800 },
    { daysAgo: 2,  elapsed: 1800, watched:  900 },
    { daysAgo: 3,  elapsed: 4200, watched: 2100 },
    { daysAgo: 5,  elapsed: 2700, watched: 1350 },
    { daysAgo: 6,  elapsed: 3000, watched: 1500 },
    { daysAgo: 8,  elapsed: 1200, watched:  600 },
    { daysAgo: 9,  elapsed: 3900, watched: 1950 },
    { daysAgo: 10, elapsed: 2400, watched: 1200 },
    { daysAgo: 12, elapsed: 1500, watched:  750 },
    { daysAgo: 13, elapsed: 3300, watched: 1650 },
]));
