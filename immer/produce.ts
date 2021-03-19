const keyForState: symbol = Symbol('key-for-state');
type state = {
    base: any,
    copy: any,
}

const createProxy = (value: any) => {
    const state: state = {
        base: value,
        copy: null,
    }
    const handler = {
        set(state: state, prop: string, v: any) {
            state.copy = state.copy ?? { ...state.base };
            state.copy[prop] = v;
            return true;
        },
        get(state: state, prop: string | symbol) {
            if (prop === keyForState) return state;
            state.copy = state.copy ?? { ...state.base };
            return (state.copy[prop] = createProxy(state.copy[prop]));
        }
    }
    const proxy = new Proxy(state, handler);

    return proxy;
}

const isDraft = (source: any) => !!source && !!source[keyForState]

const readresult = (draft: any) => {
    const state = draft[keyForState];
    for (let key in state.copy) {
        if (isDraft(state.copy[key])) {
            const result = readresult(state.copy[key]);
            state.copy[key] = result;
        }
    }
    return state.copy;
}

const produce: <T = any>(baseState: T, recipe: (draft: T) => void) => T = (baseState, recipe) => {

    const proxy = createProxy(baseState);
    recipe(proxy);
    return readresult(proxy);
}

export default produce;
