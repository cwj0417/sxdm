let currentWatcher = null

class Watcher {
    deps: Set<Dep> = new Set()
    cb: Function = null
    exp: Function = null
    constructor(exp: Function, cb: (result: any) => void) {
        this.cb = cb
        this.exp = exp
        currentWatcher = this
        this.exp()
        currentWatcher = null
    }
    addDep(dep: Dep) {
        this.deps.add(dep)
        dep.addSub(this)
    }
    run() {
        this.cb && this.cb(this.exp())
    }
}

class Dep {
    subs: Set<Watcher> = new Set()
    depend() {
        currentWatcher.addDep(this)
    }
    addSub(watcher: Watcher) {
        this.subs.add(watcher)
    }
    notify() {
        this.subs.forEach(i => i.run())
    }
}

const observe: (obj: object) => void = (obj) => {
    for (let key in obj) {
        defineReactive(obj, key, obj[key])
    }
}

const defineReactive: (obj: object, key: string, val: any) => void = (obj, key, val) => {
    let dep = new Dep()
    Object.defineProperty(obj, key, {
        set(newVal) {
            val = newVal
            dep.notify()
        },
        get() {
            if (currentWatcher) {
                dep.depend()
            }
            return val
        }
    })
}

export {
    Watcher,
    observe,
}
