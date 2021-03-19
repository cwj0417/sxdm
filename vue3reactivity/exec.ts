import {
    effect,
    reactive,
} from './reactivity';

const data = reactive({
    price: 1,
    amount: 1
}) as any // todo: type

let total: number

effect(() => {
    total = data.price * data.amount
})

console.log(total)

data.price = 5

console.log(total)

data.amount = 10

console.log(total)
