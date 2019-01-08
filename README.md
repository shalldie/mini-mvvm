# mvvm

A lib to achieve mvvm.

自己写的一个 `mvvm` 库，主要是想造一遍轮子，不要用于生产环境 >\_<#@!

## 特性

-   [x] VNode
-   [x] 数据监听
    -   [x] `object.key` 变动监听
    -   [x] 数组方法监听 `push` | `pop` | `shift` | `unshift` | `splice` | `sort` | `reverse`
-   [x] `computed` 计算属性
-   [x] `文本节点` 数据绑定
-   [x] `attribute` 数据绑定
    -   [x] 支持绑定 data、computed，支持方法（参数不支持字面量）
-   [x] 常用指令
    -   [x] `x-model` 双向绑定。 支持 `input`、`textarea`、`select`
    -   [x] `x-if` 条件渲染。条件支持 `data`、`computed`
    -   [x] `x-for` 循环。 `(item,index) in array`、`item in array`
-   [x] 事件绑定
    -   [x] `@click` | `@mousedown` | `...`
-   [x] 生命周期
    -   [x] `created` 只有这一个，也够用了。全都初始化完毕后。
