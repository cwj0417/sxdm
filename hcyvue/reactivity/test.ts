import {
    effect,
    reactive,
} from './'

test('base reactivity', () => {
    const data = reactive({
        price: 1,
        amount: 1
    })
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
    const obj = reactive({
        ok: true,
        text: 'text'
    })
    const effectfn = jest.fn(() => {
        obj.ok ? obj.text : 'nothing'
    })
    effect(() => {
        effectfn()
    })
    obj.ok = false
    obj.text = 'test'
    expect(effectfn).toHaveBeenCalledTimes(2)
})

test('nested effect', () => {
    const obj = reactive({
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

test('avoiding infinite effect', () => {
    const obj = reactive({
        count: 1,
    })
    const selfIncre = jest.fn(() => {
        obj.count++
    })
    effect(selfIncre)
    expect(selfIncre).toHaveBeenCalledTimes(1)
})

test('scheduler', () => {
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
        run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
        () => {
            dummy = obj.foo
        },
        { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
})