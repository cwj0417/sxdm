function quick<T = number> (arr: T[], left: number = 0, right: number = arr.length - 1, compare:(a: T, b: T) => boolean = (a, b) => a > b) {
    const partition = (from: number, to: number) => {
        let flag = from + 1;
        for (let i = flag; i <= to; i++) {
            if (compare(arr[from], arr[i])) {
                [arr[i], arr[flag]] = [arr[flag], arr[i]];
                flag += 1;
            }
        }
        [arr[from], arr[flag - 1]] = [arr[flag - 1], arr[from]];
        return flag - 1;
    }
    if (compare(right as any, left as any)) { // 这里ts 待思考
        const separator = partition(left, right);
        quick(arr, left, separator - 1);
        quick(arr, separator + 1, right);
    }
    return arr;
}

export default quick;
