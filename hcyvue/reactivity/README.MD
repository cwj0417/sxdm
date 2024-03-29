> vue.js设计与实现 响应式系统

### 最初代码从"vue3reactivity"复制

最初的reactivity版本是响应式的最简单实现, 对应测试用例的`base reactivity`.
书中是以提出一个问题, 解决一个问题的形式进行的.
于是这里的开发模式是:
1.  每个featrure新增一个测试用例.
2.  编写代码.
3.  在本readme里简单说明这个问题的思路.
4.  git commit 格式:  `feat(hcy-reactivity): 特性名字(尽量与用例名字一致)`. 以便复习.

### cleaup

问题: 当代码走向分支产生变化, 一些属性就不需要被track了. 如果不cleanup会运行无效的effect影响性能.
方案: 在每次执行effect前清理deps.
思路:
1.  因为无法知道每个effect有什么deps. 所以建立effectFn来保存deps.
2.  在track的时候向effectFn的deps推当前的deps.
3.  在执行effect前进行cleanup. cleanup动作就是遍历effectFn的deps, 并把当前effect从deps里删除.
4.  因为在运行effect的时候会添加deps导致死循环. 于是在trigger的时候对deps进行固定: 新建一个set并遍历执行effect.

### `nested effect`

问题: 当effect嵌套, 因为只有一个activeEffect, 就会产生依赖错误的问题
方案: 建立一个effectStack来维护activeEffect.
**注意点:** 
    写用例的时候犯了个错, 浪费了1天时间. 嵌套effect里的内容必须是个稳定的值. 不可以直接执行另一个`effect()`.
    因为deps的数据结构是一个set, 直接执行`effect()`会产生一个新的`effectFn`, 使deps变得混乱.
    具体行为是: 每次运行父effect, 子effect就会被多增加一个deps, 之后执行子effect的时候会执行若干次.
    正确做法是使用`effect()`返回的effectFn来进行嵌套.
    因为vue内部组件嵌套是vue内部的实现, 所以使用的时候没感觉, 自己写用例就噶了.

### `avoiding infinite effect`

问题: 在effect内对响应式对象进行变化, 又触发了响应式, 导致无限循环. (虽然这个代码是有问题的, 但框架要去避免报错)
目标: 想方法阻止effect执行内触发新的effect.
思路: 
    所有effect其实都被包裹成了effectFn.
    effectFn会在开始执行的时候设置`activeEffect`变量.
    所以在trigger后执行deps的effect的时候, 如果activeEffect不为空, 则不执行.
    考虑到嵌套effect的时候外层是可能有activeEffect的, 所以改为把deps过滤掉与activeEffect相同的deps.

### `scheduler`

功能: 使effect的执行可控, 为effect新增第二个参数options, 可以传入scheduler. 如果scheduler存在, 在本应该执行effect的时候改为调用scheduler, 让调用者安排执行时机.
这个功能是调度更新的基础.
