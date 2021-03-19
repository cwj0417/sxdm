const compose = (...fns: Function[]) => fns.reduce((last, current) => (arg: any) => last(current(arg)));

// last current 调换就可以实现从左到右的compose

// 但是从右到左的compose更直观, compose(a, b, c) 就是 a(b(c(param))) 而不是c(b(a(param)))

const add2 = (x: number) => x + 2;
const mult2 = (x: number) => x * 2;
const min2 = (x: number) => x - 2;

const amm = compose(add2, mult2, min2);
const mam = compose(mult2, add2, min2);

console.log(amm(5), mam(5));
