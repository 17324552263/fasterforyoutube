
const createChannelsTable = (channels, sortByPropertyName = 'author') => {
    const createChannelHeaders = (channels) => {
        const createHeader = (title, classNames, sortProperty) => {
            const headerColumn = document.createElement('span');
            headerColumn.classList.add(...classNames);
            headerColumn.textContent = title;
            headerColumn.onclick = () => createChannelsTable(channels, sortProperty);
            return headerColumn;
        };

        const header = document.createElement('div');
        header.className = 'channel-detail';
        header.appendChild(createHeader('Channel', ['channel-author', 'clickable'], 'author'));
        header.appendChild(createHeader('Speed', ['channel-rates', 'clickable'], 'rate'));
        header.appendChild(createHeader('Time Saved', ['channel-saved', 'clickable'], 'time'));
        return header;
    };

    const container = document.getElementById('channels');
    container.innerHTML = '';
    container.appendChild(createChannelHeaders(channels));

    const watchedSeconds = videos => videos.reduce((p, c) => p + c.watched, 0);
    const sortChannelsInPlace = (channels, sortByPropertyName) => {
        const byAuthor = (a, b) => a.author.localeCompare(b.author);
        const byRate = (a, b) => b.rate - a.rate;
        const byTime = (a, b) => watchedSeconds(b.videos) - watchedSeconds(a.videos);
        const sortBy = { 'author': byAuthor, 'rate': byRate, 'time': byTime };
        channels.sort(sortBy[sortByPropertyName]);
    };

    sortChannelsInPlace(channels, sortByPropertyName);
    const createChannelRow = (id, author, rate, savedTime) => {
        const details = document.createElement('div');
        details.className = 'channel-detail';
        details.dataset.channelId = id;

        const PlaybackSpeedDefaults = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

        const channelAuthor = document.createElement('span');
        channelAuthor.className = 'channel-author';
        channelAuthor.onclick = () => window.open(`https://www.youtube.com/channel/${id}`, '_blank');
        channelAuthor.textContent = author;

        const channelRates = document.createElement('ul');
        channelRates.className = 'channel-rates';
        channelRates.replaceChildren(...PlaybackSpeedDefaults.map(r => {
            const li = document.createElement('li');
            if (rate === r) li.className = 'rate-selected';
            li.textContent = r.toFixed(1);
            return li;
        }));

        const timeSaved = document.createElement('span');
        timeSaved.className = 'time-saved';
        timeSaved.textContent = savedTime;

        details.appendChild(channelAuthor);
        details.appendChild(channelRates);
        details.appendChild(timeSaved);
        return details;
    };

    for (let channel of channels) {
        container.appendChild(createChannelRow(channel.id, channel.author, channel.rate, formatDuration(watchedSeconds(channel.videos))));
    }
};

let _totalWatchedSeconds = 0;
let _heartbeatCount = 0;

const refreshChannelTimes = () => {
    chrome.storage.local.get((storage) => {
        document.querySelectorAll('[data-channel-id]').forEach(row => {
            const channel = storage[row.dataset.channelId];
            if (!channel) return;
            const watched = channel.videos.reduce((p, vId) => p + (storage[vId]?.watched ?? 0), 0);
            const el = row.querySelector('.time-saved');
            if (!el) return;
            const next = formatDuration(watched);
            if (el.textContent !== next) {
                el.textContent = next;
                el.classList.remove('flash');
                void el.offsetWidth; // force reflow to restart animation
                el.classList.add('flash');
            }
        });
    });
};

chrome.storage.onChanged.addListener((changes) => {
    const delta = Object.entries(changes)
        .filter(([k]) => !k.startsWith('UC'))
        .reduce((sum, [, c]) => sum + ((c.newValue?.watched ?? 0) - (c.oldValue?.watched ?? 0)), 0);
    if (delta > 0) {
        const from = _totalWatchedSeconds;
        _totalWatchedSeconds += delta;
        animateCount(document.getElementById('hourCount'), from, _totalWatchedSeconds);
        if (++_heartbeatCount % 8 === 0) refreshChannelTimes();
    }
});

const createChannelSummary = (channels) => {
    const videos = channels.reduce((p, c) => {
        p.push(...c.videos);
        return p;
    }, []);
    const [elapsed, watched] = videos.reduce((p, c) => {
        p[0] += c.elapsed;
        p[1] += c.watched;
        return p;
    }, [0, 0]);

    _totalWatchedSeconds = watched;
    animateCount(document.getElementById('hourCount'), 0, _totalWatchedSeconds, 1500, 'easeOut');
    document.getElementById('videoCount').textContent = videos.length;
    document.getElementById('averageSpeed').textContent = elapsed > 0 ? ((elapsed + watched) / elapsed).toFixed(2) : '1.00';
    document.getElementById('channelCount').textContent = channels.length;
}

const toggleChannelsVisibility = (hasChannels) => {
    document.getElementById('nochannels').style.display = hasChannels ? 'none' : 'flex';
    document.getElementById('channel-results').style.display = hasChannels ? 'flex' : 'none';
};

const buildChannelsWithVideos = (storage) => {
    const isChannel = id => id.startsWith('UC');
    return Object.keys(storage)
        .filter(isChannel)
        .map(c => { return {
            ...storage[c],
            'id': c,
            'videos': storage[c].videos.map(vId => storage[vId] ?? { 'elapsed': 0, 'watched': 0 })}})
};

chrome.storage.local.get((storage) => {
    const channels = buildChannelsWithVideos(storage);    
    toggleChannelsVisibility(!!channels.length);
    createChannelSummary(channels);
    createChannelsTable(channels);
});