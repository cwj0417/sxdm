promise的then的2条路, 执行地方是不同的
+   promise已经完成的then, then的回调直接执行
+   promise未完成, then的回调注册到promise内部, 在promise完成时调用

难点: 如何链式调用. 答: 返回一个新的promise, 继承上个promise的对应状态和属性(难点是这个).