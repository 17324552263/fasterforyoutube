
const MILESTONES = [
    // Time saved (threshold in seconds)
    { id: 'time_15m',   category: 'time',     label: 'Coffee Break',    threshold: 15 * 60,               description: '15 minutes saved',  icon: '⏱' },
    { id: 'time_1h',    category: 'time',     label: 'Lunch Hour',      threshold: 60 * 60,               description: '1 hour saved',       icon: '⏱' },
    { id: 'time_8h',    category: 'time',     label: 'Workday',         threshold: 8 * 60 * 60,           description: '8 hours saved',      icon: '⏱' },
    { id: 'time_1d',    category: 'time',     label: 'Day Saver',       threshold: 24 * 60 * 60,          description: '1 day saved',        icon: '⏱' },
    { id: 'time_7d',    category: 'time',     label: 'Week Saver',      threshold: 7 * 24 * 60 * 60,      description: '7 days saved',       icon: '⏱' },
    { id: 'time_30d',   category: 'time',     label: 'Month Saver',     threshold: 30 * 24 * 60 * 60,     description: '30 days saved',      icon: '⏱' },

    // Videos watched faster (threshold is video count)
    { id: 'vid_10',     category: 'videos',   label: 'Getting Started', threshold: 10,                    description: '10 videos',          icon: '🎬' },
    { id: 'vid_25',     category: 'videos',   label: 'Habit Forming',   threshold: 25,                    description: '25 videos',          icon: '🎬' },
    { id: 'vid_100',    category: 'videos',   label: 'Century',         threshold: 100,                   description: '100 videos',         icon: '🎬' },
    { id: 'vid_250',    category: 'videos',   label: 'Dedicated',       threshold: 250,                   description: '250 videos',         icon: '🎬' },
    { id: 'vid_500',    category: 'videos',   label: 'Obsessed',        threshold: 500,                   description: '500 videos',         icon: '🎬' },
    { id: 'vid_1000',   category: 'videos',   label: 'Marathoner',      threshold: 1000,                  description: '1,000 videos',       icon: '🎬' },

    // Channels saved (threshold is channel count)
    { id: 'ch_5',       category: 'channels', label: 'Curator',         threshold: 5,                     description: '5 channels saved',   icon: '📺' },
    { id: 'ch_10',      category: 'channels', label: 'Collector',       threshold: 10,                    description: '10 channels saved',  icon: '📺' },
    { id: 'ch_25',      category: 'channels', label: 'Archivist',       threshold: 25,                    description: '25 channels saved',  icon: '📺' },
    { id: 'ch_50',      category: 'channels', label: 'Encyclopedist',   threshold: 50,                    description: '50 channels saved',  icon: '📺' },

    // Streaks — based on longestStreak, so they survive a broken streak
    { id: 'streak_3',   category: 'streak',   label: 'On a Roll',       threshold: 3,                     description: '3-day streak',       icon: '🔥' },
    { id: 'streak_7',   category: 'streak',   label: 'Week Streak',     threshold: 7,                     description: '7-day streak',       icon: '🔥' },
    { id: 'streak_14',  category: 'streak',   label: 'Fortnight',       threshold: 14,                    description: '14-day streak',      icon: '🔥' },
    { id: 'streak_30',  category: 'streak',   label: 'Monthly',         threshold: 30,                    description: '30-day streak',      icon: '🔥' },
];

const _dateKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const _computeStreak = (daily) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // If today has no activity yet, count back from yesterday so the streak
    // isn't broken mid-day just because the user hasn't watched yet today.
    const startOffset = (daily[_dateKey(today)]?.watched ?? 0) > 0 ? 0 : 1;
    let streak = 0;
    for (let i = startOffset; ; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        if ((daily[_dateKey(d)]?.watched ?? 0) === 0) break;
        streak++;
    }
    return streak;
};

const _computeStats = (storage) => {
    const channels = Object.keys(storage).filter(k => k.startsWith('UC'));
    const videoIds  = channels.flatMap(c => storage[c].videos ?? []);
    return {
        totalWatched:  videoIds.reduce((sum, id) => sum + (storage[id]?.watched  ?? 0), 0),
        totalVideos:   videoIds.length,
        totalChannels: channels.length,
        streak:        _computeStreak(storage['_daily'] ?? {}),
    };
};

const _valueForMilestone = (stats, longestStreak, m) => {
    if (m.category === 'time')     return stats.totalWatched;
    if (m.category === 'videos')   return stats.totalVideos;
    if (m.category === 'channels') return stats.totalChannels;
    if (m.category === 'streak')   return longestStreak;
};

// Checks all thresholds against current storage state, writes any newly
// earned badges and the updated longestStreak back to storage, and always
// returns the current milestone record so callers can render without a
// second storage read.
const evaluateMilestones = (storage) => {
    const existing      = storage['_milestones'] ?? { earned: {}, unseen: [], longestStreak: 0 };
    const stats         = _computeStats(storage);
    const longestStreak = Math.max(stats.streak, existing.longestStreak ?? 0);

    const newlyEarned = MILESTONES.filter(m =>
        !existing.earned[m.id] &&
        _valueForMilestone(stats, longestStreak, m) >= m.threshold
    );

    const streakChanged = longestStreak !== (existing.longestStreak ?? 0);
    if (newlyEarned.length === 0 && !streakChanged) return existing;

    const now    = Date.now();
    const earned = { ...existing.earned };
    const unseen = [...existing.unseen];
    for (const m of newlyEarned) {
        earned[m.id] = now;
        unseen.push(m.id);
    }

    const updated = { earned, unseen, longestStreak };
    chrome.storage.local.set({ '_milestones': updated });
    return updated;
};
