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

test('nested effect', () => {
    const obj: any = reactive({
        foo: 1,
        bar: 1,
    })
    const effectOutter = jest.fn(() => {
        obj.foo
        console.log(1)
    })
    const effectInner = jest.fn(() => {
        obj.bar
        console.log(2)
    })
    effect(() => {
        effectOutter()
        effect(() => {
            effectInner()
        })
    })
    obj.foo++
    expect(effectOutter).toHaveBeenCalledTimes(2)
    expect(effectInner).toHaveBeenCalledTimes(2)
    obj.bar++
    expect(effectOutter).toHaveBeenCalledTimes(2)
    expect(effectInner).toHaveBeenCalledTimes(3)
})