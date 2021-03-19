// 模拟new操作符

const newInstance = function (ctor, ...args) {
    const instance = Object.create(null);
    Object.setPrototypeOf(instance, ctor.prototype);
    instance.constructor(...args);
    return instance;
}

// 测试

function Person (firstName, lastName) {
    this.fullName = firstName + lastName;
}

console.log(new Person('chen', 'wj'))
console.log(newInstance(Person, 'chen', 'wj'))

// 模拟Object.create

const createObject = __proto__ => ({__proto__: __proto__})
// {__proto__: __proto__} 和 {__proto__} 的区别在于 Object.create(null) 和 Object.create(Object.prototype)

// 测试

console.log(createObject(null), Object.create(null));
console.log(createObject(Object.prototype), Object.create(Object.prototype), {});

// instanceof

const isInstance = function (obj, ctor) {
    const proto = Object.getPrototypeOf(obj);
    if (proto === null) return false;
    if (proto === ctor.prototype) return true;
    return isInstance(proto, ctor);
}

// 测试

const cwj = new Person('chen', 'wj');
console.log(cwj instanceof Person);
console.log(isInstance(cwj, Person));
console.log(isInstance(Function, Object));
console.log(isInstance(Object, Function));
