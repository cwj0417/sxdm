function insertion<T = number> (arr: T[], compare:(a: T, b: T) => boolean = (a, b) => a > b) {
    const length = arr.length;
    let current: T, compareIndex: number;
    for(let i = 1; i < length; i++) {
        current = arr[i];
        compareIndex = i - 1;
        while (!compare(current,arr[compareIndex])) {
            arr[compareIndex + 1] = arr[compareIndex];
            compareIndex -= 1;
        }
        arr[compareIndex + 1] = current;
    }
    arr.length = length;
    return arr;
}

export default insertion;
