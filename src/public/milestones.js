
const CATEGORY_COLORS = {
    time:     '#f0a060',
    videos:   '#60a8f0',
    channels: '#60c880',
    streak:   '#f06060',
};

// SVG icon strings — each 24×24 viewBox, cohesive design per category
const _svg = {

    // ── Time saved — amber clock circles, progressively more detailed ─────────

    time_15m: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#d97c38" stroke-width="2"/>
      <line x1="12" y1="12" x2="12" y2="5.5" stroke="#ffc878" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="12" x2="18" y2="12" stroke="#ffc878" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="1.3" fill="#d97c38"/>
    </svg>`,

    time_1h: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="rgba(217,124,56,0.1)" stroke="#d97c38" stroke-width="2"/>
      <line x1="12" y1="3.5" x2="12" y2="5.5" stroke="#d97c38" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="20.5" y1="12" x2="18.5" y2="12" stroke="#d97c38" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="12" y1="20.5" x2="12" y2="18.5" stroke="#d97c38" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="3.5" y1="12" x2="5.5" y2="12" stroke="#d97c38" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="12" y1="12" x2="12" y2="5.5" stroke="#ffc878" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="12" y1="12" x2="15.5" y2="12" stroke="#ffc878" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="1.3" fill="#d97c38"/>
    </svg>`,

    time_8h: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="rgba(217,124,56,0.15)" stroke="#d97c38" stroke-width="2"/>
      <line x1="12" y1="3.5" x2="12" y2="5.5" stroke="#d97c38" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="20.5" y1="12" x2="18.5" y2="12" stroke="#d97c38" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="12" y1="20.5" x2="12" y2="18.5" stroke="#d97c38" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="3.5" y1="12" x2="5.5" y2="12" stroke="#d97c38" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="18.4" y1="5.6" x2="17.0" y2="7.0" stroke="#d97c38" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="18.4" y1="18.4" x2="17.0" y2="17.0" stroke="#d97c38" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="5.6" y1="18.4" x2="7.0" y2="17.0" stroke="#d97c38" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="5.6" y1="5.6" x2="7.0" y2="7.0" stroke="#d97c38" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="12" y1="12" x2="12" y2="5.5" stroke="#ffc878" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="12" y1="12" x2="7.7" y2="14.5" stroke="#ffc878" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="1.3" fill="#d97c38"/>
    </svg>`,

    time_1d: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="rgba(217,124,56,0.2)" stroke="#d97c38" stroke-width="2.2"/>
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="#d97c38" stroke-width="0.8" opacity="0.4"/>
      <line x1="12" y1="3.5" x2="12" y2="5.5" stroke="#d97c38" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="20.5" y1="12" x2="18.5" y2="12" stroke="#d97c38" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="12" y1="20.5" x2="12" y2="18.5" stroke="#d97c38" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="3.5" y1="12" x2="5.5" y2="12" stroke="#d97c38" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="18.4" y1="5.6" x2="17.0" y2="7.0" stroke="#d97c38" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="18.4" y1="18.4" x2="17.0" y2="17.0" stroke="#d97c38" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="5.6" y1="18.4" x2="7.0" y2="17.0" stroke="#d97c38" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="5.6" y1="5.6" x2="7.0" y2="7.0" stroke="#d97c38" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="12" y1="12" x2="12" y2="5.5" stroke="#ffc878" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="12" y1="12" x2="16" y2="12" stroke="#ffc878" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="1.5" fill="#d97c38"/>
    </svg>`,

    time_7d: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="rgba(217,124,56,0.25)" stroke="#d97c38" stroke-width="2.5"/>
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="#d97c38" stroke-width="0.8" opacity="0.5"/>
      <line x1="12" y1="3.5" x2="12" y2="5.5" stroke="#d97c38" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="20.5" y1="12" x2="18.5" y2="12" stroke="#d97c38" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="12" y1="20.5" x2="12" y2="18.5" stroke="#d97c38" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="3.5" y1="12" x2="5.5" y2="12" stroke="#d97c38" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="16.5" cy="4.2" r="0.7" fill="#d97c38"/>
      <circle cx="19.8" cy="7.5" r="0.7" fill="#d97c38"/>
      <circle cx="19.8" cy="16.5" r="0.7" fill="#d97c38"/>
      <circle cx="16.5" cy="19.8" r="0.7" fill="#d97c38"/>
      <circle cx="7.5" cy="19.8" r="0.7" fill="#d97c38"/>
      <circle cx="4.2" cy="16.5" r="0.7" fill="#d97c38"/>
      <circle cx="4.2" cy="7.5" r="0.7" fill="#d97c38"/>
      <circle cx="7.5" cy="4.2" r="0.7" fill="#d97c38"/>
      <line x1="12" y1="12" x2="12" y2="5.5" stroke="#ffc878" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="12" y1="12" x2="16.5" y2="12" stroke="#ffc878" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="1.5" fill="#ffc060"/>
    </svg>`,

    time_30d: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="#c87030" stroke="#ffc060" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="rgba(255,220,120,0.35)" stroke-width="1"/>
      <ellipse cx="9.5" cy="8.5" rx="2" ry="1.2" fill="rgba(255,240,180,0.2)" transform="rotate(-30 9.5 8.5)"/>
      <line x1="12" y1="12" x2="12" y2="6" stroke="#fff5d0" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="12" y1="12" x2="17" y2="12" stroke="#fff5d0" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="1.5" fill="#fff5d0"/>
    </svg>`,

    // ── Videos — blue circles with play triangle, progressively filled ────────

    vid_10: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#4a9ce0" stroke-width="2"/>
      <path d="M10.5 8.5l6.5 3.5-6.5 3.5z" fill="#4a9ce0"/>
    </svg>`,

    vid_25: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="rgba(74,156,224,0.18)" stroke="#4a9ce0" stroke-width="2"/>
      <path d="M10.5 8.5l6.5 3.5-6.5 3.5z" fill="#70c0f8"/>
    </svg>`,

    vid_100: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="rgba(74,156,224,0.38)" stroke="#4a9ce0" stroke-width="2.2"/>
      <path d="M10.5 8.5l6.5 3.5-6.5 3.5z" fill="#90d0ff"/>
    </svg>`,

    vid_250: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="#2878d0" stroke="#60b8f8" stroke-width="2"/>
      <path d="M10.5 8.5l6.5 3.5-6.5 3.5z" fill="#b8e4ff"/>
    </svg>`,

    vid_500: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="none" stroke="#4a9ce0" stroke-width="1" opacity="0.5"/>
      <circle cx="12" cy="12" r="9" fill="#1a68c0" stroke="#70c0f8" stroke-width="2"/>
      <path d="M10.5 8.5l6.5 3.5-6.5 3.5z" fill="#cce8ff"/>
    </svg>`,

    vid_1000: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="#4a9ce0" stroke-width="0.8" opacity="0.5"/>
      <circle cx="12" cy="12" r="9" fill="#1058b0" stroke="#80c8ff" stroke-width="2.2"/>
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="rgba(160,216,255,0.3)" stroke-width="1"/>
      <path d="M10.5 8.5l6.5 3.5-6.5 3.5z" fill="#e0f4ff"/>
    </svg>`,

    // ── Channels — green horizontal bars, one added per tier ─────────────────

    ch_5: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10.5" width="16" height="3" rx="1.5" fill="#45b865"/>
    </svg>`,

    ch_10: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8.5" width="16" height="3" rx="1.5" fill="#60c880"/>
      <rect x="4" y="13" width="16" height="3" rx="1.5" fill="#30a050"/>
    </svg>`,

    ch_25: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="5.5" width="16" height="3" rx="1.5" fill="#60c880"/>
      <rect x="4" y="10.5" width="16" height="3" rx="1.5" fill="#45b865"/>
      <rect x="4" y="15.5" width="16" height="3" rx="1.5" fill="#30a050"/>
    </svg>`,

    ch_50: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="3.5" width="16" height="3" rx="1.5" fill="#80e098"/>
      <rect x="4" y="8" width="16" height="3" rx="1.5" fill="#60c880"/>
      <rect x="4" y="12.5" width="16" height="3" rx="1.5" fill="#45b865"/>
      <rect x="4" y="17" width="16" height="3" rx="1.5" fill="#208040"/>
    </svg>`,

    // ── Streaks — red flames, growing in size and intensity ───────────────────

    streak_3: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C9.5 21 7.5 19 7.5 16.5c0-2.5 1.5-4 2.5-5.5 0 1.5.5 2 1 2.5 0-3 1-5 1-7.5 1.5 2 3.5 4 3.5 6.5 0 .8-.2 1.5-.5 2 .3-.5.8-.8.8-2 1 1.5 1.2 2.5 1.2 3.5C17 19 14.5 21 12 21z" fill="#e85050"/>
      <path d="M12 19.5C10.5 19.5 10 18 10 16.5c0-1.5 1-2.5 1.5-3 0 1 .5 1.5 1 1.5 0-1.5.5-3 .5-4 .8 1.5 1 2.5 1 4.5 0 .8-.2 1.3-.5 1.8.2-.5.5-.8.5-1.8.5 1 .5 1.8.5 2C14 18 13.5 19.5 12 19.5z" fill="#ff9060"/>
    </svg>`,

    streak_7: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C9 22 6.5 19.5 6.5 16.5c0-3 2-5.5 3-7 0 2 .8 3 2 4 0-4.5 1.5-7.5 1.5-10 2 2.5 4 5.5 4 9 0 1-.2 2-.6 2.8.4-.8 1-1.5 1-3 1 2 1.6 3.5 1.6 5C19 19.5 15.5 22 12 22z" fill="#e85050"/>
      <path d="M12 20.5C10 20.5 9 18.5 9 17c0-2 1.5-3.5 2-4.5 0 1.5 1 2.5 1.5 2.8 0-2 .5-4 1-5 .5 1.5 1.5 3.5 1.5 6 0 1-.2 2-.5 2.5.3-.7.5-1.2.5-2.5.8 1 1 2 1 3C15 18.5 14 20.5 12 20.5z" fill="#ff9060"/>
    </svg>`,

    streak_14: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22.5C8 22.5 5 19.5 5 16c0-3.5 2-7 4-9 0 2.5 1 4 2 5.5 0-5.5 2-9 2-12.5 2.5 3 5.5 6.5 5.5 10.5 0 1.2-.3 2.5-.8 3.5.5-1 1.3-2 1.3-4 1.5 2.5 2 4 2 5.5C21 19.5 16 22.5 12 22.5z" fill="#e85050"/>
      <path d="M12 21C10 21 8.5 19.5 8.5 17.5c0-2.5 2-4.5 2.5-5.5 0 2 1 3 2 3.5 0-2.5.5-5 1-6.5.8 2 2 4.5 2 7.5 0 1.2-.3 2.2-.8 3 .5-1 .8-1.5.8-3 1 1.5 1.5 2.5 1.5 3.5C17.5 19.5 15 21 12 21z" fill="#ff7840"/>
      <path d="M12 18.5C11 18 10.5 16.5 11 15 11.5 13.5 12 13 12 12.5 12 13 12.5 13.5 13 15 13.5 16.5 13 18 12 18.5z" fill="#ffb870" opacity="0.9"/>
    </svg>`,

    streak_30: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 19C4.5 19 3.5 17.5 3.5 16c0-2 1.5-3.5 2.5-5 0 1.5.5 2.5.5 4 .3-.5.8-1 .8-2.5 1 1.5 1.2 2.5 1.2 4C8.5 18 7.5 19 6 19z" fill="#c02020" opacity="0.7"/>
      <path d="M18 19C16.5 19 15.5 18 15.5 16.5c0-1.5 1.2-2.5 1.2-4 .5 1.5.5 2 .8 2.5 0-1.5.5-2.5.5-4 1 1.5 2.5 3 2.5 5C20.5 17.5 19.5 19 18 19z" fill="#c02020" opacity="0.7"/>
      <path d="M12 23C8 23 5.5 20 5.5 16.5c0-4 2.5-8 4.5-10 0 3 1 5 2.5 6.5 0-6 2-9.5 2-14 3 3.5 6 7.5 6 12.5 0 1.5-.4 3-.9 4.2.6-1.2 1.4-2.2 1.4-4.7 1.8 2.8 2 5 2 6C23 20 17.5 23 12 23z" fill="#e85050"/>
      <path d="M12 21.5C10 21.5 8.5 20 8.5 18c0-3 2.5-5.5 3-7 0 2.5 1.5 4 2 4.5 0-3 .5-6 1.5-8 .8 2 2.5 5 2.5 8.5 0 1.5-.3 2.5-.8 3.5.4-1 .8-1.5.8-3.5 1 1.8 1 3 1 4C17.5 20 15 21.5 12 21.5z" fill="#ff7840"/>
      <path d="M12 19.5C11 19 10.5 17.5 11 16 11.5 14.5 12 13.5 12 13 12 13.5 12.5 14.5 13 16 13.5 17.5 13 19 12 19.5z" fill="#ffc080"/>
    </svg>`,
};

const MILESTONES = [
    // Time saved (threshold in seconds)
    { id: 'time_15m',   category: 'time',     label: 'Coffee Break',    threshold: 15 * 60,               description: '15 minutes saved'   },
    { id: 'time_1h',    category: 'time',     label: 'Lunch Hour',      threshold: 60 * 60,               description: '1 hour saved'        },
    { id: 'time_8h',    category: 'time',     label: 'Workday',         threshold: 8 * 60 * 60,           description: '8 hours saved'       },
    { id: 'time_1d',    category: 'time',     label: 'Day Saver',       threshold: 24 * 60 * 60,          description: '1 day saved'         },
    { id: 'time_7d',    category: 'time',     label: 'Week Saver',      threshold: 7 * 24 * 60 * 60,      description: '7 days saved'        },
    { id: 'time_30d',   category: 'time',     label: 'Month Saver',     threshold: 30 * 24 * 60 * 60,     description: '30 days saved'       },

    // Videos watched faster (threshold is video count)
    { id: 'vid_10',     category: 'videos',   label: 'Getting Started', threshold: 10,                    description: '10 videos'           },
    { id: 'vid_25',     category: 'videos',   label: 'Habit Forming',   threshold: 25,                    description: '25 videos'           },
    { id: 'vid_100',    category: 'videos',   label: 'Century',         threshold: 100,                   description: '100 videos'          },
    { id: 'vid_250',    category: 'videos',   label: 'Dedicated',       threshold: 250,                   description: '250 videos'          },
    { id: 'vid_500',    category: 'videos',   label: 'Obsessed',        threshold: 500,                   description: '500 videos'          },
    { id: 'vid_1000',   category: 'videos',   label: 'Marathoner',      threshold: 1000,                  description: '1,000 videos'        },

    // Channels saved (threshold is channel count)
    { id: 'ch_5',       category: 'channels', label: 'Curator',         threshold: 5,                     description: '5 channels saved'    },
    { id: 'ch_10',      category: 'channels', label: 'Collector',       threshold: 10,                    description: '10 channels saved'   },
    { id: 'ch_25',      category: 'channels', label: 'Archivist',       threshold: 25,                    description: '25 channels saved'   },
    { id: 'ch_50',      category: 'channels', label: 'Encyclopedist',   threshold: 50,                    description: '50 channels saved'   },

    // Streaks — based on longestStreak, so they survive a broken streak
    { id: 'streak_3',   category: 'streak',   label: 'On a Roll',       threshold: 3,                     description: '3-day streak'        },
    { id: 'streak_7',   category: 'streak',   label: 'Week Streak',     threshold: 7,                     description: '7-day streak'        },
    { id: 'streak_14',  category: 'streak',   label: 'Fortnight',       threshold: 14,                    description: '14-day streak'       },
    { id: 'streak_30',  category: 'streak',   label: 'Monthly',         threshold: 30,                    description: '30-day streak'       },
].map(m => ({ ...m, svg: _svg[m.id] }));

const _dateKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const _computeStreak = (daily) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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

const _estimateEarnedDate = (storage, milestone) => {
    const daily      = storage['_daily'] ?? {};
    const sortedKeys = Object.keys(daily).sort();
    if (!sortedKeys.length) return Date.now();

    if (milestone.category === 'time') {
        let cumulative = 0;
        for (const key of sortedKeys) {
            cumulative += daily[key]?.watched ?? 0;
            if (cumulative >= milestone.threshold) {
                return new Date(key + 'T12:00:00').getTime();
            }
        }
    }

    return new Date(sortedKeys[0] + 'T12:00:00').getTime();
};

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

    const earned = { ...existing.earned };
    const unseen = [...existing.unseen];
    for (const m of newlyEarned) {
        earned[m.id] = _estimateEarnedDate(storage, m);
        unseen.push(m.id);
    }

    const updated = { earned, unseen, longestStreak };
    chrome.storage.local.set({ '_milestones': updated });
    return updated;
};
