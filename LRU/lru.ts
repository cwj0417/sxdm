export class LRUCache<T = any, K extends number | string = number> {
    private cache: {
        [key: string]: T
    } = {}
    private keys: K[] = []

    constructor(private capacity: number) {}

    get (key: K) {
        if (this.keys.includes(key)) {
            this.keys.splice(this.keys.indexOf(key), 1)
            this.keys.push(key)
            return this.cache[key]
        }
        return false
    }
    put (key: K, value: T) {
        if (this.keys.includes(key)) {
            this.cache[key] = value;
        } else {
            if (this.keys.length >= this.capacity) {
                delete this.cache[this.keys.shift()]
            }
            this.cache[key] = value
            this.keys.push(key)
        }
    }
}
