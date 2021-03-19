const curry = (fn: Function, ...args: any[]) =>
    (...newArgs: any[]) =>
        fn.length <= args.length + newArgs.length ? fn(...args, ...newArgs) : curry(fn, ...args, ...newArgs)

const add = (a: number, b: number, c: number) => a + b + c

const curriedAdd = curry(add);

console.log(curriedAdd(1, 2, 3));
console.log(curriedAdd(1)(2, 3));
console.log(curriedAdd(1, 2)(3));
console.log(curriedAdd(1)(2)(3));

console.log(curry(add, 1, 2, 3)());
console.log(curry(add, 1, 2)(3));
console.log(curry(add, 1)(2, 3));
console.log(curry(add, 1)(2)(3));
