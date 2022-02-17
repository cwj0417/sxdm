const FLAG_PLACEMENT = 2
const FLAG_UPDATE = 4
const FLAG_DELETE = 8

type fiber = {
    type: reactType;
    props: {
        [prop: string]: any;
    } | null;
    node?: HTMLElement | Text;
    child?: fiber;
    sibling?: fiber;
    parent?: fiber;
    alternate?: fiber;
    hooks?: {
        state: any;
        queue: Function[];
    }[];
    flag?: typeof FLAG_PLACEMENT | typeof FLAG_UPDATE | typeof FLAG_DELETE;
}

type vnode = {
    type: reactType;
    props: object | null;
}

type fc = (props: object) => vnode

type reactType = fc | string | HTMLElement

const h = (type: reactType, props?: object | null): vnode => {
    return {
        type,
        props,
    }
}
const updateNodeProps = (node: HTMLElement, oldProps: object, newProps: object) => {
    if (!node?.setAttribute) return

    for (let key in newProps) {
        if (key === 'children') {
            if (newProps[key].length && !newProps[key][0].type) {
                node.textContent = newProps[key][0]
            }
            continue
        }
        if (oldProps[key] !== newProps[key]) {
            if (!key.startsWith('on')) {
                (node as HTMLElement).setAttribute(key, newProps[key])
            } else {
                if (oldProps[key]) {
                    node.removeEventListener(key.substring(2).toLowerCase(), oldProps[key])
                }
                node.addEventListener(key.substring(2).toLowerCase(), newProps[key])
            }
        }
    }
    for (let key in oldProps) {
        if (key === 'children') continue
        if (!(key in newProps)) {
            (node as HTMLElement).removeAttribute(key)
        }
    }
}
function updateHostComponent(fiber: fiber) {
    if (!fiber.node) {
        fiber.node = document.createElement(fiber.type as string)
        updateNodeProps(fiber.node as HTMLElement, {}, fiber.props)
    }
    reconcileChildren(fiber, wipFiber.props.children)
}

function updateHostText(fiber: fiber) {
    // fiber.node = document.createTextNode(fiber.props.nodeValue)
}

function updateFunctionComponent(fiber: fiber) {
    currentHookFiber = fiber
    hookIndex = 0
    fiber.hooks = []
    reconcileChildren(fiber, [(fiber.type as Function)(wipFiber.props)])
}

function updateFragment(fiber: fiber) {
    reconcileChildren(fiber, fiber.props.children)
}

function reconcileChildren(parent: fiber, children: vnode[]) {
    let lastFiber = null
    let oldFiber = parent?.alternate?.child
    for (let i = 0; i < children.length || oldFiber; i++) {
        const fiber: fiber = {
            type: children[i].type,
            props: children[i].props,
            parent,
            alternate: oldFiber,
            flag: FLAG_PLACEMENT,
        }
        const same = oldFiber && oldFiber.type === fiber.type
        // same type: update
        if (same) {
            fiber.flag = FLAG_UPDATE
            fiber.node = oldFiber.node
        }
        // text node
        if (!children[i].type) {
            fiber.props = {
                nodeValue: children[i],
                children: [],
            }
        }
        // deletions
        if (oldFiber && !same) {
            fiber.flag = FLAG_DELETE
            deletions.push(fiber)
        }
        // link fibers
        if (i === 0) {
            parent.child = fiber
        } else {
            lastFiber.sibling = fiber
        }
        // refers oldFiber to next
        if (oldFiber) oldFiber = oldFiber.sibling
        // update lastFiber for next loop
        lastFiber = fiber
    }
}

function performUnitOfWork() {
    if (typeof wipFiber.type === 'string') {
        updateHostComponent(wipFiber)
    } else if (typeof wipFiber.type === 'function') {
        updateFunctionComponent(wipFiber)
    } else if (!wipFiber.type) {
        updateHostText(wipFiber)
    } else { // fragment or root
        updateFragment(wipFiber)
    }

    if (wipFiber.child) {
        wipFiber = wipFiber.child
        return
    }
    let nextFiber = wipFiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            wipFiber = nextFiber.sibling
            return
        }
        nextFiber = nextFiber.parent
    }
    wipFiber = null

}

let wipFiber: fiber | null = null
let wipRoot: fiber | null = null
let currentRoot: fiber | null = null
let deletions: fiber[] = []

function commitRoot() {
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
}

function getParentNode(fiber: fiber) {
    let parentFiber = fiber.parent
    while (parentFiber) {
        if (parentFiber.node) {
            return parentFiber.node
        }
        parentFiber = parentFiber.parent
    }
    return null
}

function commitWork(fiber: fiber) {
    if (!fiber) return
    const parentNode = getParentNode(fiber)
    const { flag } = fiber
    flag & FLAG_PLACEMENT && fiber.node && parentNode.appendChild(fiber.node)
    flag & FLAG_UPDATE && updateNodeProps(fiber.node as HTMLElement, fiber.alternate.props, fiber.props)
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function workLoop(deadline) {
    while (wipFiber && deadline.timeRemaining() > 1) {
        performUnitOfWork()
    }
    if (!wipFiber && wipRoot) {
        commitRoot()
    }
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

const mountApp = (app: reactType, container: HTMLElement): void => {
    const fiber: fiber = {
        type: container, // fragment
        node: container,
        props: {
            children: [h(app)]
        },
        alternate: currentRoot,
        flag: FLAG_PLACEMENT,
    }
    deletions = []
    wipFiber = fiber
    wipRoot = fiber
}

// hooks

let hookIndex = 0
let currentHookFiber: fiber | null = null

const useState = <T>(initialState: T) => {

    const lastHook = currentHookFiber?.alternate?.hooks?.[hookIndex]

    const hook: {
        state: T,
        queue: any[],
    } = {
        state: lastHook ? lastHook.queue.reduce((prev, action) => action(prev), lastHook.state) : initialState,
        queue: [],
    }

    const setState = (action: (prev: T) => T) => {
        hook.queue.push(action)
        wipFiber = {
            type: currentRoot.type,
            node: currentRoot.node,
            props: currentRoot.props,
            alternate: currentRoot,
        }
        deletions = []
        wipRoot = wipFiber
    }
    currentHookFiber.hooks.push(hook)
    hookIndex += 1
    return [hook.state, setState] as [T, (action: (prev: T) => T) => void];
}

function App() {
    const [count, setCount] = useState<number>(0)
    return h('div', {
        children: [
            h(activeSpan, {
                active: count % 2 === 0,
                style: 'width: 40px; display: inline-block;',
                children: [count]
            }),
            h('button', { onclick: () => setCount((i: number) => ++i), children: ['+'] }),
            h('button', { onclick: () => setCount((i: number) => --i), children: ['-'] }),
        ]
    })
}

function activeSpan(props) {
    return h('span', {
        class: props.active ? 'red' : 'green',
        style: props.style,
        children: props.children,
    })
}

mountApp(App, document.getElementById('app'))
