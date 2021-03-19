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
    console.log('new total is now:', v)
    total = v;
    return v;
}, (v) => {
    // console.log('new total is now:', v)
})

console.log(total)
data.price = 5
console.log(data.price)
console.log(total)

console.log('------')
data.amount = 10
data.price = 1000
console.log(total)