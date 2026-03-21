
const _suites = [];
let _active = null;

const describe = (name, fn) => {
    _active = { name, tests: [], _beforeAll: null, _afterAll: null, _pending: [] };
    _suites.push(_active);
    fn(); // collects beforeAll / afterAll / it registrations
    if (_active._beforeAll) _active._beforeAll();
    for (const { name: tName, fn: tFn } of _active._pending) {
        try {
            tFn();
            _active.tests.push({ name: tName, pass: true });
        } catch (e) {
            _active.tests.push({ name: tName, pass: false, error: e.message });
        }
    }
    if (_active._afterAll) _active._afterAll();
};

const beforeAll = (fn) => { _active._beforeAll = fn; };
const afterAll  = (fn) => { _active._afterAll  = fn; };

const it = (name, fn) => { _active._pending.push({ name, fn }); };

const assert = {
    equal:     (a, b)    => { if (a !== b)  throw new Error(`Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); },
    notEqual:  (a, b)    => { if (a === b)  throw new Error(`Expected values to differ, both: ${JSON.stringify(a)}`); },
    deepEqual: (a, b)    => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); },
    truthy:    (a, msg)  => { if (!a)       throw new Error(msg ?? `Expected truthy, got ${a}`); },
    falsy:     (a, msg)  => { if (a)        throw new Error(msg ?? `Expected falsy, got ${a}`); },
};

document.addEventListener('DOMContentLoaded', () => renderResults());

const renderResults = () => {
    const container = document.getElementById('results');
    let pass = 0, fail = 0;

    for (const suite of _suites) {
        const suiteEl = document.createElement('div');
        suiteEl.className = 'suite';

        const title = document.createElement('h3');
        title.textContent = suite.name;
        suiteEl.appendChild(title);

        for (const test of suite.tests) {
            const el = document.createElement('div');
            el.className = `test ${test.pass ? 'pass' : 'fail'}`;
            el.textContent = `${test.pass ? '✓' : '✗'} ${test.name}${test.error ? ` — ${test.error}` : ''}`;
            suiteEl.appendChild(el);
            test.pass ? pass++ : fail++;
        }

        container.appendChild(suiteEl);
    }

    const summary = document.getElementById('summary');
    summary.textContent = `${pass} passed, ${fail} failed`;
    summary.className = fail ? 'fail' : 'pass';
};
