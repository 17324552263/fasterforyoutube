
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
        header.appendChild(createHeader('Channel Name', ['channel-author', 'clickable'], 'author'));
        header.appendChild(createHeader('Playback Speed', ['channel-rates', 'clickable'], 'rate'));
        header.appendChild(createHeader('Hours Saved', ['channel-saved', 'clickable'], 'time'));
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

        const PlaybackSpeedDefaults = [1, 1.5, 2, 2.5, 3];

        const channelAuthor = document.createElement('span');
        channelAuthor.className = 'channel-author';
        channelAuthor.onclick = () => window.open(`https://www.youtube.com/channel/${id}`, '_blank');
        channelAuthor.textContent = author;

        const channelRates = document.createElement('ul');
        channelRates.className = 'channel-rates';
        channelRates.innerHTML = PlaybackSpeedDefaults.map(r =>
            `<li${rate === r ? ' class="rate-selected"' : ''}>${r.toFixed(1)}</li>`).join('');

        const timeSaved = document.createElement('span');
        timeSaved.className = 'time-saved';
        timeSaved.textContent = savedTime;

        details.appendChild(channelAuthor);
        details.appendChild(channelRates);
        details.appendChild(timeSaved);
        return details;
    };

    for (let channel of channels) {
        const totalWatchedHours = (watchedSeconds(channel.videos) / 3600).toFixed(2);
        container.appendChild(createChannelRow(channel.id, channel.author, channel.rate, totalWatchedHours));
    }
};

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

    document.getElementById('hourCount').textContent = (watched / 3600).toFixed(2);
    document.getElementById('videoCount').textContent = videos.length;
    document.getElementById('averageSpeed').textContent = ((elapsed + watched) / elapsed).toFixed(2)
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
            'videos': storage[c].videos.map(vId => storage[vId])}})
};

chrome.storage.local.get((storage) => {
    const channels = buildChannelsWithVideos(storage);    
    toggleChannelsVisibility(!!channels.length);
    createChannelSummary(channels);
    createChannelsTable(channels);
});