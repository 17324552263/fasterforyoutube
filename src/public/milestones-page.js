
const CATEGORY_LABELS = {
    time:        'Time Saved',
    videos:      'Videos',
    channels:    'Channels',
    streak:      'Streaks',
    active_days: 'Active Days',
};

const renderAllMilestones = (record) => {
    const earned    = record?.earned ?? {};
    const container = document.getElementById('content');
    const categories = [...new Set(MILESTONES.map(m => m.category))];

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

            if (isEarned) {
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
    renderAllMilestones(evaluateMilestones(storage));
});
