
// ---------------------------------------------------------------------------
// Large dataset — 104 channels, up to 400 videos per channel, 3 years of history
// ---------------------------------------------------------------------------

const _largeChannels = [
    // --- Heavy watchers (200–400 videos) ---
    { id: 'UCiS7ZzBTMkSjopnRqKNkr7A', author: 'Kurzgesagt',             rate: 2,   videoCount: 390 },
    { id: 'UCWX3yGbODI3HLMTRFbzgkYA', author: 'Veritasium',             rate: 2,   videoCount: 370 },
    { id: 'UCHnyfMqiRRG1u-2MsSQLbXAA', author: 'Vsauce',                rate: 2.5, videoCount: 340 },
    { id: 'UC9-y-6csu5WGm29I7JiwpnAA', author: 'Computerphile',          rate: 1.5, videoCount: 320 },
    { id: 'UCZYTClx2T1of7BRZ86-8fowA', author: 'SciShow',               rate: 1.5, videoCount: 310 },
    { id: 'UCnUYZLuoy1rq1aVMwx4aTzwA', author: 'CGP Grey',              rate: 2.5, videoCount: 290 },
    { id: 'UCsooa4yRKGN_zEE8iknghZAA', author: 'TED-Ed',                rate: 2,   videoCount: 280 },
    { id: 'UC7_gcs09iThXybpVgjHZ_7gA', author: 'PBS Space Time',        rate: 2,   videoCount: 265 },
    { id: 'UCCTVrRVmRZFOWZtkpdiNXPwA', author: 'Half as Interesting',    rate: 2.5, videoCount: 240 },
    { id: 'UCddiUEpeqJcYeBxX1IVBKvQA', author: 'Fireship',              rate: 3.5, videoCount: 230 },

    // --- Regular watchers (50–150 videos) ---
    { id: 'UCBcRF18a7Qf58cCRy5xuWwQA', author: 'Mark Rober',             rate: 1.5, videoCount: 140 },
    { id: 'UCX6OQ3DkcsbYNE6H8uQQuVAA', author: 'MrBeast',               rate: 4,   videoCount: 135 },
    { id: 'UCVjlpEjEY9GpksqbEesJnNAA', author: 'Practical Engineering',  rate: 4.5, videoCount: 130 },
    { id: 'UC6107grRI4m0o2-emgoDnABw', author: 'Wendover Productions',   rate: 2,   videoCount: 120 },
    { id: 'UCoxcjq-8xIDTYp3uz647V5A',  author: 'Numberphile',            rate: 1.5, videoCount: 118 },
    { id: 'UCYO_jab_esuFRV4b17AJtAw',  author: '3Blue1Brown',            rate: 2.5, videoCount: 115 },
    { id: 'UCG-KntY7aVnIGXYEBQvmBAQ',  author: 'Smarter Every Day',      rate: 2,   videoCount: 110 },
    { id: 'UCR1IuLEqb6UEA_zQ81kwXfg',  author: 'Real Engineering',       rate: 2,   videoCount: 105 },
    { id: 'UConVfxXodg78Tzh5nNu85Ew',  author: 'Wendover Productions Alt', rate: 2, videoCount: 100 },
    { id: 'UCJ0-OtVpF0wOKEqT2Z1HEtA',  author: 'ElectroBOOM',            rate: 2,   videoCount:  95 },
    { id: 'UCbmNph6atAoGfqLoCL_duAg',  author: 'Techquickie',            rate: 2,   videoCount:  90 },
    { id: 'UCHnyfMqiRRG1u-2MsSQLbZZZ', author: 'Tom Scott',              rate: 2,   videoCount:  88 },
    { id: 'UCivA7_KLKWo43tFcCkFvydw',  author: 'Scott Manley',           rate: 2,   videoCount:  85 },
    { id: 'UCEIwxahdLz7bap-VDs9h35A',  author: 'Steve Mould',            rate: 2.5, videoCount:  82 },
    { id: 'UCnRSHCbmNph6atAoGfqLoCL',  author: 'Primer',                 rate: 5,   videoCount:  78 },
    { id: 'UCMOqf8ab-42UUQIdVoKwjlQ',  author: 'Practical Psychology',   rate: 2,   videoCount:  75 },
    { id: 'UCFettjMK-cHDi22FD3IkJtA',  author: 'Crash Course',           rate: 1.5, videoCount:  72 },
    { id: 'UC1DTYW241WD64ah5BFWn4JA',  author: 'Lex Fridman',            rate: 2,   videoCount:  70 },
    { id: 'UCnbMB_3vIbKfxHfMYAAFgeA',  author: 'Andrew Huberman',        rate: 1.5, videoCount:  68 },
    { id: 'UCHnyfMqiRRG1u-2MsSQLbLex', author: 'Jordan Peterson',        rate: 1.5, videoCount:  65 },
    { id: 'UCaXkIU1QidjPwiAYu6GcHjg',  author: 'Vsauce2',               rate: 2,   videoCount:  62 },
    { id: 'UC4a-Gbdw7vOakcIv8uz7xnQ',  author: 'Kurzgesagt – History',   rate: 2,   videoCount:  60 },
    { id: 'UCsXVk37bltHxD1rDPwtNM8Q',  author: 'Kurzgesagt Q&A',         rate: 2,   videoCount:  58 },
    { id: 'UCRijo3ddMTht_IHyNSNXpNQ',  author: 'Drift0r',                rate: 3.5, videoCount:  55 },
    { id: 'UCkK9UDm_ZNrq_rIXCz3xCGA',  author: 'Vihart',                 rate: 2,   videoCount:  52 },

    // --- Occasional watchers (5–40 videos) ---
    { id: 'UCddiUEpeqJcYeBxX1IVBzzz', author: 'BBC Earth',              rate: 1.5, videoCount:  40 },
    { id: 'UCBcRF18a7Qf58cCRy5xuyyy', author: 'National Geographic',     rate: 1.5, videoCount:  38 },
    { id: 'UCnUYZLuoy1rq1aVMwx4axxx', author: 'Vox',                    rate: 2,   videoCount:  36 },
    { id: 'UC9-y-6csu5WGm29I7Jiwwww', author: 'Vice',                   rate: 2,   videoCount:  34 },
    { id: 'UCWX3yGbODI3HLMTRFbzvvvv', author: 'The Economist',          rate: 2,   videoCount:  32 },
    { id: 'UCHnyfMqiRRG1u-2MsSQuuuu', author: 'Wired',                  rate: 2,   videoCount:  30 },
    { id: 'UCsooa4yRKGN_zEE8ikntttt', author: 'Motherboard',            rate: 2,   videoCount:  28 },
    { id: 'UCX6OQ3DkcsbYNE6H8uQssss', author: 'Linus Tech Tips',        rate: 2.5, videoCount:  27 },
    { id: 'UCVjlpEjEY9GpksqbEerrrr',  author: 'Dave2D',                 rate: 2,   videoCount:  26 },
    { id: 'UCCTVrRVmRZFOWZtkpdiqqqq', author: 'MKBHD',                  rate: 2,   videoCount:  25 },
    { id: 'UCZYTClx2T1of7BRZ86pppp',  author: 'Unbox Therapy',          rate: 2.5, videoCount:  24 },
    { id: 'UC7_gcs09iThXybpVgjoooo',  author: 'JerryRigEverything',     rate: 2.5, videoCount:  23 },
    { id: 'UCiS7ZzBTMkSjopnRqKnnnn',  author: 'Hardware Unboxed',       rate: 2,   videoCount:  22 },
    { id: 'UC6107grRI4m0o2-emgommm',  author: 'Jarrod\'s Tech',         rate: 2,   videoCount:  21 },
    { id: 'UCoxcjq-8xIDTYp3uz6llll',  author: 'GamersNexus',            rate: 2.5, videoCount:  20 },
    { id: 'UCYO_jab_esuFRV4b17Akkk',  author: 'Digital Foundry',        rate: 2,   videoCount:  19 },
    { id: 'UCG-KntY7aVnIGXYEBQvjjj',  author: 'DF Retro',               rate: 2,   videoCount:  18 },
    { id: 'UCR1IuLEqb6UEA_zQ81kiii',  author: 'John\'s Tech Review',    rate: 2,   videoCount:  17 },
    { id: 'UConVfxXodg78Tzh5nNuhhh',  author: 'ETA PRIME',              rate: 2.5, videoCount:  16 },
    { id: 'UCJ0-OtVpF0wOKEqT2Z1ggg',  author: 'Chris Titus Tech',       rate: 2,   videoCount:  15 },
    { id: 'UCbmNph6atAoGfqLoCLfff',   author: 'Wolfgang\'s Channel',    rate: 2,   videoCount:  14 },
    { id: 'UCHnyfMqiRRG1u-2MsSeee',   author: 'Solution Exists',        rate: 2,   videoCount:  13 },
    { id: 'UCivA7_KLKWo43tFcCkddd',   author: 'NetworkChuck',           rate: 2.5, videoCount:  12 },
    { id: 'UCEIwxahdLz7bap-VDs9ccc',  author: 'Professor Messer',       rate: 1.5, videoCount:  11 },
    { id: 'UCnRSHCbmNph6atAoGfbbb',   author: 'David Bombal',           rate: 1.5, videoCount:  10 },
    { id: 'UCMOqf8ab-42UUQIdVoKaaa',  author: 'The Coding Train',       rate: 2.5, videoCount:   9 },
    { id: 'UCFettjMK-cHDi22FD3I999',  author: 'Reducible',              rate: 2.5, videoCount:   9 },
    { id: 'UC1DTYW241WD64ah5BFW888',  author: 'Clément Mihailescu',     rate: 2,   videoCount:   8 },
    { id: 'UCnbMB_3vIbKfxHfMYAA777',  author: 'NeetCode',               rate: 2,   videoCount:   8 },
    { id: 'UCHnyfMqiRRG1u-2MsS666',   author: 'Tech With Tim',          rate: 2,   videoCount:   8 },
    { id: 'UCaXkIU1QidjPwiAYu6G555',  author: 'Corey Schafer',          rate: 2,   videoCount:   7 },
    { id: 'UC4a-Gbdw7vOakcIv8uz444',  author: 'sentdex',                rate: 2,   videoCount:   7 },
    { id: 'UCsXVk37bltHxD1rDPw333',   author: 'ArjanCodes',             rate: 2.5, videoCount:   7 },
    { id: 'UCRijo3ddMTht_IHyNSN222',  author: 'mCoding',                rate: 3,   videoCount:   6 },
    { id: 'UCkK9UDm_ZNrq_rIXCz111',   author: 'Low Level Learning',     rate: 2.5, videoCount:   6 },
    { id: 'UCddiUEpeqJcYeBxX100001',  author: 'ThePrimeagen',           rate: 3,   videoCount:   6 },
    { id: 'UCBcRF18a7Qf58cCRy500002', author: 'Theo – t3.gg',           rate: 2.5, videoCount:   6 },
    { id: 'UCnUYZLuoy1rq1aVMw500003', author: 'Melkey Dev',             rate: 2,   videoCount:   6 },
    { id: 'UC9-y-6csu5WGm29I7500004', author: 'Dreams of Code',         rate: 2,   videoCount:   5 },
    { id: 'UCWX3yGbODI3HLMTRFb500005', author: 'Hamy the Coder',        rate: 2.5, videoCount:   5 },
    { id: 'UCHnyfMqiRRG1u-2Ms500006', author: 'Continuous Delivery',    rate: 2,   videoCount:   5 },
    { id: 'UCsooa4yRKGN_zEE8ik500007', author: 'ByteByteGo',            rate: 2,   videoCount:   5 },
    { id: 'UCX6OQ3DkcsbYNE6H8500008', author: 'System Design Interview', rate: 2,  videoCount:   5 },
    { id: 'UCVjlpEjEY9GpksqbEe500009', author: 'Gaurav Sen',            rate: 2,   videoCount:   5 },
    { id: 'UCCTVrRVmRZFOWZtkp500010', author: 'Hussein Nasser',         rate: 2,   videoCount:   5 },
    { id: 'UCZYTClx2T1of7BRZ8500011', author: 'Socratica',              rate: 2,   videoCount:   5 },
    { id: 'UC7_gcs09iThXybpVg500012', author: 'MinutePhysics',          rate: 2,   videoCount:   5 },
    { id: 'UCiS7ZzBTMkSjopnRq500013', author: 'MinuteEarth',            rate: 2,   videoCount:   5 },
    { id: 'UC6107grRI4m0o2-em500014', author: 'It\'s Okay to be Smart', rate: 1.5, videoCount:   5 },
    { id: 'UCoxcjq-8xIDTYp3uz500015', author: 'BrainCraft',             rate: 1.5, videoCount:   5 },
    { id: 'UCYO_jab_esuFRV4b1500016', author: 'Sciencium',              rate: 2,   videoCount:   5 },
    { id: 'UCG-KntY7aVnIGXYEB500017', author: 'Domain of Science',      rate: 2,   videoCount:   5 },
    { id: 'UCR1IuLEqb6UEA_zQ8500018', author: 'Up and Atom',            rate: 2,   videoCount:   5 },
    { id: 'UConVfxXodg78Tzh5n500019', author: 'Tibees',                 rate: 2,   videoCount:   5 },
    { id: 'UCJ0-OtVpF0wOKEqT2500020', author: 'Jade Explains',          rate: 2,   videoCount:   5 },
    { id: 'UCbmNph6atAoGfqLoC500021', author: 'Julia Souza',            rate: 2,   videoCount:   5 },
    { id: 'UCHnyfMqiRRG1u-2Ms500022', author: 'Looking Glass Universe',  rate: 2,  videoCount:   5 },
    { id: 'UCivA7_KLKWo43tFcC500023', author: 'PBS Eons',               rate: 2,   videoCount:   5 },
    { id: 'UCEIwxahdLz7bap-VD500024', author: 'PBS Digital Studios',    rate: 2,   videoCount:   5 },
    { id: 'UCnRSHCbmNph6atAoG500025', author: 'RealLifeLore',           rate: 2,   videoCount:   5 },
    { id: 'UCMOqf8ab-42UUQIdV500026', author: 'Geography Now',          rate: 1.5, videoCount:   5 },
    { id: 'UCFettjMK-cHDi22FD500027', author: 'Kento Bento',            rate: 2,   videoCount:   5 },
    { id: 'UC1DTYW241WD64ah5B500028', author: 'Oversimplified',         rate: 2,   videoCount:   5 },
    { id: 'UCnbMB_3vIbKfxHfMY500029', author: 'Historia Civilis',       rate: 2,   videoCount:   5 },
    { id: 'UCHnyfMqiRRG1u-2Ms500030', author: 'Toldinstone',            rate: 2,   videoCount:   5 },
];

// 3 years of daily activity — more dense and heavier in recent months,
// sparser and lighter further back. Deterministic (no Math.random).
const _threeyearsDaily = buildDailyRange(1095, (i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    // Skip more days in the distant past
    const gapSeed = (i * 37 + i * i * 11) % 100;
    const gapThreshold = 30 + Math.floor(i / 1095 * 45);
    if (gapSeed < gapThreshold) return null;
    if (isWeekend && (i * 13) % 4 === 0) return null;
    // Watching duration grows as user gets more into the extension
    const recency = 0.25 + (1 - i / 1095) * 0.75;
    const base = Math.floor((2400 + (i * 479 + i * i * 3) % 10800) * recency);
    return { elapsed: base, watched: Math.floor(base * (0.35 + (i * 17 % 30) / 100)) };
});

window.LargeDataset = buildDataset(_largeChannels);
window.LargeDatasetWithActivity = buildDataset(_largeChannels, _threeyearsDaily);
