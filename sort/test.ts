import bubble from './bubble';
import selection from './selection';
import insertion from './insertion';
import quick from './quick';

const randomArr = Array.from({length: 100}).map(() => Math.round(Math.random() * 100));
const from = [...randomArr];
const sorted = randomArr.sort((a, b) => a - b);

test('buble', () => {
    expect(bubble(from)).toEqual(sorted);
})

test('selection', () => {
    expect(selection(from)).toEqual(sorted);
})

test('insertion', () => {
    expect(insertion(from)).toEqual(sorted);
})

test('quick', () => {
    expect(quick(from)).toEqual(sorted);
})
