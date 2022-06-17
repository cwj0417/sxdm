import {
    effect,
    reactive,
} from './';

test('base reactivity', () => {
    const data: any = reactive({
        price: 1,
        amount: 1
    }) // todo: type
    let total: number
    effect(() => {
        total = data.price * data.amount
    })
    expect(total).toBe(1)
    data.price = 5
    expect(total).toBe(5)
    data.amount = 10
    expect(total).toBe(50)
})

test('clean up', () => {
    const obj: any = reactive({
        ok: true,
        text: 'text'
    })
    const effectfn = jest.fn(() => {
        obj.ok ? obj.text : 'nothing';
    });
    effect(() => {
        effectfn()
    })
    obj.ok = false
    obj.text = 'test'
    expect(effectfn).toHaveBeenCalledTimes(2)
})
