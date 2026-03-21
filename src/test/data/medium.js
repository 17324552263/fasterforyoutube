
const _mediumChannels = [
    { id: 'UCddiUEpeqJcYeBxX1IVBKvQ', author: 'Fireship',          rate: 2,   videoCount: 60 },
    { id: 'UCBcRF18a7Qf58cCRy5xuWwQ', author: 'Mark Rober',         rate: 1.5, videoCount: 45 },
    { id: 'UCnUYZLuoy1rq1aVMwx4aTzw', author: 'CGP Grey',           rate: 2.5, videoCount: 30 },
    { id: 'UC9-y-6csu5WGm29I7JiwpnA', author: 'Computerphile',      rate: 1.5, videoCount: 80 },
    { id: 'UCWX3yGbODI3HLMTRFbzgkYg', author: 'Veritasium',         rate: 2,   videoCount: 55 },
    { id: 'UCHnyfMqiRRG1u-2MsSQLbXA', author: 'Vsauce',             rate: 2,   videoCount: 40 },
    { id: 'UCsooa4yRKGN_zEE8iknghZA', author: 'TED-Ed',             rate: 1.5, videoCount: 90 },
    { id: 'UCX6OQ3DkcsbYNE6H8uQQuVA', author: 'MrBeast',            rate: 3.5, videoCount: 70 },
    { id: 'UCVjlpEjEY9GpksqbEesJnNA', author: 'Practical Engineer', rate: 4,   videoCount: 25 },
    { id: 'UCCTVrRVmRZFOWZtkpdiNXPw', author: 'Half as Interesting', rate: 4.5, videoCount: 35 },
    { id: 'UCZYTClx2T1of7BRZ86-8fow', author: 'SciShow',            rate: 5,   videoCount: 100 },
    { id: 'UC7_gcs09iThXybpVgjHZ_7g', author: 'PBS Space Time',     rate: 2,   videoCount: 50 },
];

// 12 channels, 500+ videos, no activity history
window.MediumDataset = buildDataset(_mediumChannels);

// 12 channels, 90 days activity
window.MediumDatasetWithActivity = buildDataset(_mediumChannels, buildDailyRange(90, (i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    if (isWeekend && (i * 13) % 3 === 0) return null;
    const base = isWeekend
        ? 1200 + (i * 479) % 2400
        : 2400 + (i * 1337 + i * i * 7) % 7200;
    return { elapsed: base, watched: Math.floor(base * (0.4 + (i * 31 % 40) / 100)) };
}));
