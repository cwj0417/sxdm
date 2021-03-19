> 用proxy实现 "touch数据时记录" 来替代遍历.

思路:
+   函数暴露proxy, 让用户操作proxy对象, 操作的时候在当前节点记录操作
+   最后把proxy整理成对象,  返回

```shell
ts-node exec.ts
```