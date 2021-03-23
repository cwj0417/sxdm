export const curry = (fn: Function, ...args: any[]) =>
    (...newArgs: any[]) =>
        fn.length <= args.length + newArgs.length ? fn(...args, ...newArgs) : curry(fn, ...args, ...newArgs)
