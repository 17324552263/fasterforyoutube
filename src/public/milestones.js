
const MILESTONES = [
    // Time saved (threshold in seconds)
    { id: 'time_15m',   category: 'time',     label: 'Coffee Break',    threshold: 15 * 60,               description: '15 minutes saved'  },
    { id: 'time_1h',    category: 'time',     label: 'Lunch Hour',      threshold: 60 * 60,               description: '1 hour saved'       },
    { id: 'time_8h',    category: 'time',     label: 'Workday',         threshold: 8 * 60 * 60,           description: '8 hours saved'      },
    { id: 'time_1d',    category: 'time',     label: 'Day Saver',       threshold: 24 * 60 * 60,          description: '1 day saved'        },
    { id: 'time_7d',    category: 'time',     label: 'Week Saver',      threshold: 7 * 24 * 60 * 60,      description: '7 days saved'       },
    { id: 'time_30d',   category: 'time',     label: 'Month Saver',     threshold: 30 * 24 * 60 * 60,     description: '30 days saved'      },

    // Videos watched faster (threshold is video count)
    { id: 'vid_10',     category: 'videos',   label: 'Getting Started', threshold: 10,                    description: '10 videos'          },
    { id: 'vid_25',     category: 'videos',   label: 'Habit Forming',   threshold: 25,                    description: '25 videos'          },
    { id: 'vid_100',    category: 'videos',   label: 'Century',         threshold: 100,                   description: '100 videos'         },
    { id: 'vid_250',    category: 'videos',   label: 'Dedicated',       threshold: 250,                   description: '250 videos'         },
    { id: 'vid_500',    category: 'videos',   label: 'Obsessed',        threshold: 500,                   description: '500 videos'         },
    { id: 'vid_1000',   category: 'videos',   label: 'Marathoner',      threshold: 1000,                  description: '1,000 videos'       },

    // Channels saved (threshold is channel count)
    { id: 'ch_5',       category: 'channels', label: 'Curator',         threshold: 5,                     description: '5 channels saved'   },
    { id: 'ch_10',      category: 'channels', label: 'Collector',       threshold: 10,                    description: '10 channels saved'  },
    { id: 'ch_25',      category: 'channels', label: 'Archivist',       threshold: 25,                    description: '25 channels saved'  },
    { id: 'ch_50',      category: 'channels', label: 'Encyclopedist',   threshold: 50,                    description: '50 channels saved'  },

    // Streaks — consecutive days with any activity (threshold is day count)
    { id: 'streak_3',   category: 'streak',   label: 'On a Roll',       threshold: 3,                     description: '3-day streak'       },
    { id: 'streak_7',   category: 'streak',   label: 'Week Streak',     threshold: 7,                     description: '7-day streak'       },
    { id: 'streak_14',  category: 'streak',   label: 'Fortnight',       threshold: 14,                    description: '14-day streak'      },
    { id: 'streak_30',  category: 'streak',   label: 'Monthly',         threshold: 30,                    description: '30-day streak'      },
];

const _dateKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const _computeStreak = (daily) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // If today has no activity yet, count backwards from yesterday
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
    const videoIds = channels.flatMap(c => storage[c].videos ?? []);
    const totalWatched  = videoIds.reduce((sum, id) => sum + (storage[id]?.watched  ?? 0), 0);
    const totalVideos   = videoIds.length;
    const totalChannels = channels.length;
    const streak        = _computeStreak(storage['_daily'] ?? {});
    return { totalWatched, totalVideos, totalChannels, streak };
};

const _statForCategory = (stats, category) => {
    if (category === 'time')     return stats.totalWatched;
    if (category === 'videos')   return stats.totalVideos;
    if (category === 'channels') return stats.totalChannels;
    if (category === 'streak')   return stats.streak;
};

// Reads storage, finds any newly crossed thresholds, writes them back, and
// returns the updated { earned, unseen } record — or null if nothing changed.
const evaluateMilestones = (storage) => {
    const existing = storage['_milestones'] ?? { earned: {}, unseen: [] };
    const stats     = _computeStats(storage);

    const newlyEarned = MILESTONES.filter(m =>
        !existing.earned[m.id] && _statForCategory(stats, m.category) >= m.threshold
    );

    if (newlyEarned.length === 0) return null;

    const now    = Date.now();
    const earned = { ...existing.earned };
    const unseen = [...existing.unseen];
    for (const m of newlyEarned) {
        earned[m.id] = now;
        unseen.push(m.id);
    }

    const updated = { earned, unseen };
    chrome.storage.local.set({ '_milestones': updated });
    return updated;
};
