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
    const innerSpy = jest.fn(() => {
        obj.bar
    })
    const innerEffect = effect(innerSpy)
    const outerSpy = jest.fn(() => {
        obj.foo
        innerEffect()
    })
    effect(outerSpy)
    expect(outerSpy).toHaveBeenCalledTimes(1)
    expect(innerSpy).toHaveBeenCalledTimes(2)
    obj.foo++
    expect(outerSpy).toHaveBeenCalledTimes(2)
    expect(innerSpy).toHaveBeenCalledTimes(3)
    obj.bar++
    expect(outerSpy).toHaveBeenCalledTimes(2)
    expect(innerSpy).toHaveBeenCalledTimes(4)
})