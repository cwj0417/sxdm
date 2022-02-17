> react最简流程

### 来源: didact, mini-react

### 启动方式
```shell
node start.js
```

### 代码入口

+   index.html
+   src/index.ts

### fiber

把vdom树拆成单个节点, 单次只更新一个.
更新单个节点的动作为perform unit of work
更新完节点后遍历fiber树, 把真实dom贴到父级dom上. 这个过程叫commitWork

### perform unit of work流程

+   根据type, 创建出dom节点
+   为子节点创建fiber, 整理自己和子节点的指针(reconcile children)
+   指向下个待perform的fiber

### commitwork  

把dom贴到root上, 并递归更新siblings和children


### todo

+   测试用例待写