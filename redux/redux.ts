// types
type Action<T = string> = {
    type: T,
    [props: string]: any,
}

type ActionCreator = {
    (...args: any[]): Action
}

type Reducer<S = any> = (state: S, action: Action) => S

type Dispatch = {
    (action: Action): void
}

type Store<S = any> = {
    getState: () => S,
    dispatch: Dispatch
}

type MiddlewareApi<S = any> = {
    getState: () => S,
    dispatch: Dispatch
}

type Middleware = {
    (api: MiddlewareApi): (next: Dispatch) => any
}

// core
const createStore = <S = any>(reducer: Reducer<S>, initState: S, enhancer: any): Store => {
    if (enhancer) {
        return enhancer(createStore)(reducer, initState)
    }
    let state = initState
    const getState = () => state
    const dispatch = (action: Action) => state = reducer(state, action)
    return {
        getState,
        dispatch,
    }
}

// helpers
const bindActionCreators = (actionCreators: { [props: string]: ActionCreator }, dispatch: Dispatch) => Object.keys(actionCreators).reduce((result, key) => {
    result[key] = (...args: any) => dispatch(actionCreators[key](...args))
    return result
}, {})

const combineReducers = (reducers: { [props: string]: Reducer }) => (state = {}, action: Action) => Object.keys(reducers).reduce((reducer, key) => {
    reducer[key] = reducers[key](state[key], action)
    return reducer
}, {})

const compose = (...funcs: any[]) => funcs.reduce((a, b) => (...args: any) => a(b(...args)))

const applyMiddleware = (...middlewares: Middleware[]) => (createStore: any) => (...args: any[]) => {
    let store = createStore(...args)
    let dispatch: Dispatch = () => console.log('empty function')
    let middlewareApi: MiddlewareApi = {
        getState: store.getState,
        dispatch: (...args) => dispatch(...args),
    }
    let chain = middlewares.map(middleware => middleware(middlewareApi))
    dispatch = compose(...chain)(store.dispatch)
    return {
        ...store,
        dispatch,
    }
}

export {
    createStore,
    bindActionCreators,
    combineReducers,
    applyMiddleware,
}
