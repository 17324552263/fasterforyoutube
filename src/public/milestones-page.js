
const CATEGORY_LABELS = {
    time:        'Time Saved',
    videos:      'Videos',
    channels:    'Channels',
    streak:      'Streaks',
    active_days:   'Active Days',
    channel_depth: 'Channel Depth',
};

const renderAllMilestones = (record, storage) => {
    const earned    = record?.earned ?? {};
    const container = document.getElementById('content');
    const categories = [...new Set(MILESTONES.map(m => m.category))];

    // Each channel counted only at its single highest depth tier
    const depthTiers = MILESTONES
        .filter(m => m.category === 'channel_depth')
        .sort((a, b) => b.threshold - a.threshold);
    const depthTierCounts = {};
    Object.keys(storage).filter(k => k.startsWith('UC')).forEach(k => {
        const highest = depthTiers.find(m => (storage[k].videos?.length ?? 0) >= m.threshold);
        if (highest) depthTierCounts[highest.id] = (depthTierCounts[highest.id] ?? 0) + 1;
    });

    for (const cat of categories) {
        const title = document.createElement('div');
        title.className = 'section-title';
        title.textContent = CATEGORY_LABELS[cat];
        container.appendChild(title);

        for (const m of MILESTONES.filter(m => m.category === cat)) {
            const isEarned = !!earned[m.id];

            const row = document.createElement('div');
            row.className = `milestone-row ${isEarned ? 'earned' : 'locked'}`;
            if (isEarned) row.style.borderLeftColor = CATEGORY_COLORS[cat];

            const icon = document.createElement('div');
            icon.className = 'milestone-row-icon';
            icon.innerHTML = m.svg;

            const body = document.createElement('div');
            body.className = 'milestone-row-body';

            const label = document.createElement('div');
            label.className = 'milestone-row-label';
            label.textContent = m.label;

            const desc = document.createElement('div');
            desc.className = 'milestone-row-desc';
            desc.textContent = m.description;

            body.appendChild(label);
            body.appendChild(desc);
            row.appendChild(icon);
            row.appendChild(body);

            if (cat === 'channel_depth') {
                const count = depthTierCounts[m.id] ?? 0;
                if (count > 0 || isEarned) {
                    const stat = document.createElement('div');
                    stat.className = 'milestone-row-date';
                    stat.textContent = `${count} channel${count !== 1 ? 's' : ''}`;
                    row.appendChild(stat);
                }
            } else if (isEarned) {
                const date = document.createElement('div');
                date.className = 'milestone-row-date';
                date.textContent = new Date(earned[m.id]).toLocaleDateString();
                row.appendChild(date);
            }

            container.appendChild(row);
        }
    }
};

chrome.storage.local.get((storage) => {
    renderAllMilestones(evaluateMilestones(storage), storage);
});
