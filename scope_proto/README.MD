##  作用域, this相关

+   bind: 接受`需要固定的this`, 返回一个函数. 使用apply/call把this固定住, 其他参数透传就行了.
+   aplly: 利用`谁调用谁就是this`的原理, 让方法自己 成为 需要成为this的对象 的一个属性, 然后调用. 调用完销毁这个属性就可以.

##  原型相关

原型相关的东西例子有互相用到, 所以写在同一个文件里.

+   new操作符. 三步走: 新建个对象, 把构造器的prototype设为他的prototype, 调用构造器
+   Object.create. 创建一个对象, 把他的prototype设为传入的参数.
+   instanceof. 看看prototype是不是构造器的prototype, 如果不是 就往上找, 直到null就认为不是instance.

具体实现, 可以有很多种写法, 所以要理解几个相关的知识点:

1.  原型: __proto__ 属性是个accessor属性, 实际是Object.getPropertyOf和Object.setPropertyOf.
2.  隐式操作: 平时的字面量对象, `.`操作取值, 赋值. 实际都有隐式操作. 取值会往__proto__找, 赋值如果当前变量没就创建. 字面量创建的对象有默认__proto__, 并不是空对象.
3.  构造函数: 所有函数都会被挂上prototype属性. 这个属性会在被new的时候作为实例的__proto__. 内容是: {constructor: 自己, __proto__: Object.prototype}, 在继承的时候__proto__是父对象的constructor, 构造函数的__proto__也是父对象的构造函数.
4.  一些基本对象(Object, Array, Function等)的关系可以自己用__proto__和===和instanceof去画关系.
