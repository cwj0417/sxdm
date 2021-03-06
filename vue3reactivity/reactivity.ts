type effectType = () => any

const targetMap = new WeakMap<any, Map<string, Set<effectType>>>()

let activeEffect: effectType

const reactive = (obj: object) => {
    return new Proxy(obj, {
        get(target, key: string, receiver) {
            track(target, key)
            return Reflect.get(target, key, receiver)
        },
        set(target, key: string, val, receiver) {
            const result = Reflect.set(target, key, val, receiver)
            trigger(target, key) // 必须先运行Reflect赋值再trigger
            return result
        }
    })
}

const track = (target: object, key: string) => {
    if (activeEffect) {
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()))
        }
        let deps = depsMap.get(key)
        if (!deps) {
            depsMap.set(key, (deps = new Set))
        }
        deps.add(activeEffect)
    }
}

const trigger = (target: object, key: string) => {
    let depsMap = targetMap.get(target)
    if (!!depsMap) {
        let deps = depsMap.get(key)
        if (!!deps) {
            deps.forEach(e => e())
        }
    }
}

const effect = (fn: effectType) => {
    activeEffect = fn
    fn()
    activeEffect = null
}

export {
    effect,
    reactive,
}
