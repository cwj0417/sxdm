import {
    Watcher,
    observe,
} from './reactivity';

const data = {
    price: 10,
    amount: 2
}
let total = 20

observe(data)

// new Watcher(() => {
//     return data.price * data.amount
// }, (v) => {
//     total = v
//     console.log('new total is now:', v)
// })

new Watcher(() => {
    let v = data.price * data.amount
    // console.log('new total is now:', v)
    total = v;
    return v;
}, (v) => {
    // console.log('new total is now:', v)
})

test('vue2 reactivity', () => {
    expect(total).toBe(20)

    data.price = 5

    expect(data.price).toBe(5)
    expect(total).toBe(10)

    data.amount = 10
    data.price = 1000

    expect(total).toBe(10000)
})
