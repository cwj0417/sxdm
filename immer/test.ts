import produce from './produce';

const base = {
    a: 1,
    b: {
        c: 2,
        d: 3,
    }
}

const immutable = produce(base, (draft: any) => {
    draft.b.c = 6;
})

test('immer', () => {
    expect(base).not.toBe(immutable);
    expect(base.b.c).toBe(2);
    expect(immutable.b.c).toBe(6);
})
