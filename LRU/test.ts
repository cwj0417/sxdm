import { LRUCache } from './lru';

test('lru', () => {
    const cache = new LRUCache<number, number>(3);
    cache.put(1, 2);
    cache.put(1, 2);
    cache.put(1, 2);
    
    expect(cache.get(1)).toBe(2);
    cache.put(4, 2);
    expect(cache.get(2)).toBe(false);
})
