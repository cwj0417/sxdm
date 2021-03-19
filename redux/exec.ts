import {
    createStore,
    bindActionCreators,
    combineReducers,
    applyMiddleware,
} from './redux';

const initState = {
    count: {
        value: 0,
    },
    status: {
        value: true,
    },
}

const count = (state, action) => {
    switch (action.type) {
        case 'increase':
            return {
                value: state.value + (action.payload || 1)
            }
        case 'decrease':
            return {
                value: state.value - (action.payload || 1)
            }
        default:
            return state
    }
}

const status = (state, action) => {
    switch (action.type) {
        case 'switch':
            return {
                value: !state.value,
            }
        default:
            return state
    }
}

const reducer = combineReducers({ count, status })

// middleware
const thunk = store => next => action => {
    let result = typeof action === 'function' ? action(store.dispatch, store.getState) : next(action)
    return result
}

const logger = store => next => action => {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
}

// action creator
const inc = num => ({
    type: 'increase',
    payload: num,
})

const delayInc: any = num => dispatch => {
    setTimeout(() => {
        console.log('start dispatch')
        dispatch({ type: 'increase', payload: num })
    }, 500)
}

// exec

const store = createStore(reducer, initState, applyMiddleware(logger, thunk))

const actions = bindActionCreators({ inc, delayInc }, store.dispatch) as any

actions.inc(2);

actions.delayInc(5);