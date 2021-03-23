import { compose } from './compose';
import { curry } from './curry';

const add2 = (x: number) => x + 2;
const mult2 = (x: number) => x * 2;
const min2 = (x: number) => x - 2;

const amm = compose(add2, mult2, min2);
const mam = compose(mult2, add2, min2);

test('compose', () => {
    expect(amm(5)).toBe(8);
    expect(mam(5)).toBe(10);
})

const add = (a: number, b: number, c: number) => a + b + c

const curriedAdd = curry(add);

test('curry', () => {
    expect(curriedAdd(1, 2, 3)).toBe(6);
    expect(curriedAdd(1)(2, 3)).toBe(6);
    expect(curriedAdd(1, 2)(3)).toBe(6);
    expect(curriedAdd(1)(2)(3)).toBe(6);

    expect(curry(add, 1, 2, 3)()).toBe(6);
    expect(curry(add, 1, 2)(3)).toBe(6);
    expect(curry(add, 1)(2, 3)).toBe(6);
    expect(curry(add, 1)(2)(3)).toBe(6);
})
