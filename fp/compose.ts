export const compose = (...fns: Function[]) => fns.reduce((last, current) => (arg: any) => last(current(arg)));

// last current 调换就可以实现从左到右的compose

// 但是从右到左的compose更直观, compose(a, b, c) 就是 a(b(c(param))) 而不是c(b(a(param)))
