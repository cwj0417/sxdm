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

用例: `clean up`
问题: 当代码走向分支产生变化, 一些属性就不需要被track了. 如果不cleanup会运行无效的effect影响性能.
方案: 在每次执行effect前清理deps.
思路:
1.  因为无法知道每个effect有什么deps. 所以建立effectFn来保存deps.
2.  在track的时候向effectFn的deps推当前的deps.
3.  在执行effect前进行cleanup. cleanup动作就是遍历effectFn的deps, 并把当前effect从deps里删除.
4.  因为在运行effect的时候会添加deps导致死循环. 于是在trigger的时候对deps进行固定: 新建一个set并遍历执行effect.

### `nested effect`

用例: `nested effect`
问题: 当effect嵌套, 因为只有一个activeEffect, 就会产生依赖错误的问题
方案: 建立一个effectStack来维护activeEffect.