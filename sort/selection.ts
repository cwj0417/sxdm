function selection<T = number> (arr: T[], compare:(a: T, b: T) => boolean = (a, b) => a > b) {
    const length = arr.length;
    let minIndex = 0;
    for (let i = 0; i < length - 1; i++) {
        minIndex = i;
        for (let j = i + 1; j < length - 1; j++) {
            if(compare(arr[j], arr[j + 1])) {
                minIndex = j;
            }
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    return arr;
}

export default selection;
