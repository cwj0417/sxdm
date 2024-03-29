type effectType = () => any

type effectFnType = {
    (): void
    deps?: Set<effectType>[]
    scheduler?: (effect: effectFnType) => void
}

type effectOptionType = {
    scheduler?: (effect: effectFnType) => void
}

const targetMap = new WeakMap<any, Map<string, Set<effectFnType>>>()

let activeEffect: effectFnType

let effectStack: effectFnType[] = []

const reactive: <T extends object>(obj: T) => T = (obj) => {
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
        activeEffect.deps.push(deps)
    }
}

const trigger = (target: object, key: string) => {
    let depsMap = targetMap.get(target)
    if (!!depsMap) {
        let deps = depsMap.get(key)
        if (!!deps) {
            const effectsToRun = new Set<effectFnType>()
            deps.forEach(effect => {
                if (effect !== activeEffect) {
                    effectsToRun.add(effect)
                }
            })
            effectsToRun.forEach(effect => {
                if (effect.scheduler) {
                    effect.scheduler(effect)
                } else {
                    effect()
                }
            })
        }
    }
}

const cleanup = (effect: effectFnType) => {
    effect.deps.forEach(dep => dep.delete(effect))
}

const effect = (fn: effectType, options: effectOptionType = {}) => {
    const effectFn: effectFnType = () => {
        activeEffect = effectFn
        effectStack.push(effectFn)
        cleanup(effectFn)
        fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.deps = []
    if (options.scheduler) effectFn.scheduler = options.scheduler
    effectFn()
    return effectFn;
}

export {
    effect,
    reactive,
}
