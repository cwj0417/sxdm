> 用proxy实现 "touch数据时记录" 来替代遍历.

和vue2的区别:
+   proxy代替defineproperty实现懒启动
+   监察关系存到一个大变量里, 来替代存在data里
