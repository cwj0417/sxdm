function bubble<T = number> (arr: T[], compare:(a: T, b: T) => boolean = (a, b) => a > b) {
    const length = arr.length;
    for (let i = 0; i < length - 1; i++) {
        for (let j = 0; j < length - 1 - i; j++) {
            if(compare(arr[j], arr[j + 1])) {
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
            }
        }
    }
    return arr;
}

export default bubble;
