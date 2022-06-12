import {
    effect,
    reactive,
} from './';

const data = reactive({
    price: 1,
    amount: 1
}) as any // todo: type

let total: number

effect(() => {
    total = data.price * data.amount
})

test('vue3 reactivity', () => {
    expect(total).toBe(1)

    data.price = 5

    expect(total).toBe(5)

    data.amount = 10

    expect(total).toBe(50)
})
