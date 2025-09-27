Plants vs Brainrots trading 交易系统
按照grow-a-garden-trading的结构ui、接口、数据库。

区别与grow-a-garden-trading的是 物品有些区别，一共两类plants和brainrots

在data中的brainrots.json和plants.json，

每个物品需要的值是不一样的plants需要Damage、Weight、Quantity、变异（Gold、Diamond、Neon、Frozen可以多选）

brainrots需要Normal 、Quantity、变异（Gold、Diamond、Neon、Frozen可以多选）

所有的数据库不使用grow-a-garden-trading的数据库而是重新建表且前缀为pvb_

所用到的接口需要在api目录下新建一个文件夹pvb存放所有接口，不要和之前的公用
包括在lib中也新建一个pvb文件夹，用来操作数据库。请注意不要修改我其他代码