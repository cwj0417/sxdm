import { effect, reactive } from '../../vue3reactivity/reactivity';

type vnode = {
    type: string;
    props: object | null;
    children: vnode[] | string | null;
    parent?: HTMLElement;
    node?: HTMLElement;
}

type app = {
    data: object;
    render: () => vnode;
}

const h = (type: string, props: object | null, children: vnode[] | string | null): vnode => {
    return {
        type,
        props,
        children,
    }
}

const mount = (component: vnode, target: HTMLElement): void => {
    const node = document.createElement(component.type)
    if (component.props) {
        for (let key in component.props) {
            if (key.startsWith('on')) {
                node.addEventListener(key.substring(2).toLowerCase(), component.props[key])
            } else {
                node.setAttribute(key, component.props[key])
            }
        }
    }
    if (component.children) {
        if (typeof component.children === 'string') {
            node.appendChild(document.createTextNode(component.children))
        } else {
            component.children.forEach(child => mount(child, node))
        }
    }
    component.parent = target;
    component.node = node;
    target.appendChild(node)
}

const patch = (oldComp: vnode, newComp: vnode): void => {
    if (oldComp.type === newComp.type) {
        // process props
        const node = newComp.node = oldComp.node
        const newProp = newComp.props || {}
        const oldProp = oldComp.props || {}
        for (let key in newProp) {
            if (oldProp[key] !== newProp[key]) {
                if (!key.startsWith('on')) {
                    node.setAttribute(key, newProp[key])
                }
            }
        }
        for (let key in oldProp) {
            if (!(key in newProp)) {
                node.removeAttribute(key)
            }
        }
        // process children
        const newChildren = newComp.children || []
        const oldChildren = oldComp.children || []
        if (typeof newChildren === 'string') {
            if (!(typeof oldChildren === 'string' && oldChildren === newChildren)) {
                node.textContent = newChildren
            }
        } else {
            if (typeof oldChildren === 'string') {
                node.textContent = ''
                newChildren.forEach(child => mount(child as vnode, node))
            } else {
                const commonLength = Math.min(newChildren.length, oldChildren.length)
                for (let i = 0; i < commonLength; i++) {
                    patch(oldChildren[i] as vnode, newChildren[i] as vnode)
                }
                if (newChildren.length > commonLength) {
                    newChildren.slice(commonLength).forEach(child => mount(child as vnode, node))
                } else {
                    oldChildren.slice(commonLength).forEach(child => {
                        if (typeof child === 'string') {
                            node.removeChild(document.createTextNode(child))
                        } else {
                            node.removeChild(child.node)
                        }
                    })
                }
            }
        }

    } else {
        oldComp.parent.removeChild(oldComp.node)
        mount(newComp, oldComp.parent)
    }
}

const mountApp = (app: app, container: HTMLElement): void => {
    let isMounted = false
    let lastVnode = null
    effect(() => {
        if (!isMounted) {
            const vnode: vnode = app.render()
            lastVnode = vnode
            mount(vnode, container)
            isMounted = true
        } else {
            const vnode: vnode = app.render()
            patch(lastVnode, vnode)
            lastVnode = vnode
        }
    })
}

const App: app = {
    data: reactive({
        count: 0,
    }),
    render() {
        return h('div', null,
            [
                h('span', {
                    class: this.data.count % 2 === 0 ? 'red' : 'green',
                    style: 'width: 40px; display: inline-block;',
                }, this.data.count.toString()),
                h('button', { onclick: () => this.data.count++ }, '+'),
                h('button', { onclick: () => this.data.count-- }, '-'),
            ])
    }
}

mountApp(App, document.getElementById('app'))
