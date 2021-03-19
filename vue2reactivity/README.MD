思路:
+   observe处理data, 使成为被检测对象
+   调用Watcher, 触发data的getter, 使setter与事件产生关联

```shell
ts-node exec.ts
```