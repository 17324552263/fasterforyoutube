
const FIG = '\u2007'; // figure space — same width as a digit

describe('formatDuration', () => {
    it('formats zero as 0s',           () => assert.equal(formatDuration(0),    '0s'));
    it('formats sub-minute seconds',   () => assert.equal(formatDuration(45),   '45s'));
    it('floors fractional seconds',    () => assert.equal(formatDuration(59.9), '59s'));
    it('formats exact minutes',        () => assert.equal(formatDuration(120),  '2m'));
    it('formats minutes and seconds',  () => assert.equal(formatDuration(90),   '1m 30s'));
    it('omits zero seconds',           () => assert.equal(formatDuration(60),   '1m'));
    it('formats exact hours',          () => assert.equal(formatDuration(3600), '1h'));
    it('formats hours and minutes',    () => assert.equal(formatDuration(5400), '1h 30m'));
    it('omits zero minutes in hours',  () => assert.equal(formatDuration(7200), '2h'));
    it('no figure-space padding',      () => assert.equal(formatDuration(3660), '1h 1m'));
});

describe('unitThreshold', () => {
    it('returns 0 for sub-minute',          () => assert.equal(unitThreshold(0),      0));
    it('returns 0 at 59s',                  () => assert.equal(unitThreshold(59),     0));
    it('returns 60 at exactly 60s',         () => assert.equal(unitThreshold(60),     60));
    it('returns 60 for minute range',       () => assert.equal(unitThreshold(3599),   60));
    it('returns 3600 at exactly 1h',        () => assert.equal(unitThreshold(3600),   3600));
    it('returns 3600 for hour range',       () => assert.equal(unitThreshold(86399),  3600));
    it('returns 86400 at exactly 1d',       () => assert.equal(unitThreshold(86400),  86400));
    it('returns 86400 for day range',       () => assert.equal(unitThreshold(604799), 86400));
    it('returns 604800 at exactly 1w',      () => assert.equal(unitThreshold(604800), 604800));
    it('returns 604800 for multi-week',     () => assert.equal(unitThreshold(1209600), 604800));
});

describe('formatWatchedTime', () => {
    it('formats sub-minute seconds',              () => assert.equal(formatWatchedTime(45),    '45s'));
    it('formats exact minutes',                   () => assert.equal(formatWatchedTime(120),   '2m'));
    it('pads single-digit seconds with fig space',() => assert.equal(formatWatchedTime(65),    `1m ${FIG}5s`));
    it('no padding for double-digit seconds',     () => assert.equal(formatWatchedTime(90),    '1m 30s'));
    it('omits zero seconds',                      () => assert.equal(formatWatchedTime(60),    '1m'));
    it('formats exact hours',                     () => assert.equal(formatWatchedTime(3600),  '1h'));
    it('pads single-digit minutes with fig space',() => assert.equal(formatWatchedTime(3660),  `1h ${FIG}1m`));
    it('no padding for double-digit minutes',     () => assert.equal(formatWatchedTime(5400),  '1h 30m'));
    it('omits zero minutes in hour range',        () => assert.equal(formatWatchedTime(7200),  '2h'));
    it('formats exact days',                      () => assert.equal(formatWatchedTime(86400), '1d'));
    it('pads single-digit hours with fig space',  () => assert.equal(formatWatchedTime(90000), `1d ${FIG}1h`));
    it('omits zero hours and minutes in day range',() => assert.equal(formatWatchedTime(172800),'2d'));
    it('formats exact weeks',                     () => assert.equal(formatWatchedTime(604800),'1w'));
    it('pads single-digit days with fig space',   () => assert.equal(formatWatchedTime(691200),`1w ${FIG}1d`));
    it('omits zero sub-units in week range',      () => assert.equal(formatWatchedTime(1209600),'2w'));
});

describe('formatWatchedTimeHTML', () => {
    it('formats sub-minute seconds as plain text', () =>
        assert.equal(formatWatchedTimeHTML(45), '45s'));

    it('includes hidden span for zero seconds in minute range', () => {
        const html = formatWatchedTimeHTML(120); // 2m 0s
        assert.truthy(html.includes('visibility:hidden'), 'zero seconds should be hidden');
        assert.truthy(html.startsWith('2m'));
    });

    it('no hidden span when seconds are non-zero', () => {
        const html = formatWatchedTimeHTML(90); // 1m 30s
        assert.falsy(html.includes('visibility:hidden'), 'non-zero seconds should be visible');
    });

    it('includes hidden span for zero minutes in hour range', () => {
        const html = formatWatchedTimeHTML(3600); // 1h 0m
        assert.truthy(html.includes('visibility:hidden'), 'zero minutes should be hidden');
        assert.truthy(html.startsWith('1h'));
    });

    it('no hidden span when minutes are non-zero in hour range', () => {
        const html = formatWatchedTimeHTML(5400); // 1h 30m
        assert.falsy(html.includes('visibility:hidden'));
    });

    it('hides zero hours and zero minutes in day range', () => {
        const html = formatWatchedTimeHTML(86400); // 1d 0h 0m
        assert.equal((html.match(/visibility:hidden/g) || []).length, 2);
    });

    it('hides zero days, hours, minutes in week range', () => {
        const html = formatWatchedTimeHTML(604800); // 1w 0d 0h 0m
        assert.equal((html.match(/visibility:hidden/g) || []).length, 3);
    });
});
