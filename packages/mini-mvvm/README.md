# mini-mvvm

[![npm](https://img.shields.io/npm/v/mini-mvvm.svg)](https://www.npmjs.com/package/mini-mvvm) [![npm minzip size](https://img.shields.io/bundlephobia/minzip/mini-mvvm.svg?label=npm%20minzip%20size)](https://www.npmjs.com/package/mini-mvvm) [![Build Status](https://travis-ci.org/shalldie/mini-mvvm.svg?branch=master)](https://travis-ci.org/shalldie/mini-mvvm)

A mini mvvm lib with [virtual dom - mini-vdom](https://github.com/shalldie/mvvm/blob/master/packages/mini-vdom/README.md).

基于 [virtual dom - mini-vdom](https://github.com/shalldie/mvvm/blob/master/packages/mini-vdom/README.md) 的轻量级mvvm库 >\_<#@!

## Installation

    npm install mini-mvvm --save

包含了 `.d.ts` 文件，用起来毫无阻塞 >\_<#@!

## Ability

-   [x] VNode 基于虚拟dom： [virtual dom - mini-vdom](https://github.com/shalldie/mvvm/blob/master/packages/mini-vdom/README.md)
-   [x] 数据监听
    -   [x] `data`、`computed` 变动监听
    -   [x] 数组方法监听 `push` | `pop` | `shift` | `unshift` | `splice` | `sort` | `reverse`
-   [x] `computed` 计算属性
-   [x] `文本节点` 数据绑定，可以是一段表达式
-   [x] `attribute` 数据绑定
    -   [x] 支持绑定 data、computed，支持方法，可以是一段表达式
-   [x] 常用指令
    -   [x] `m-model` 双向绑定。 支持 `input`、`textarea`、`select`
    -   [x] `m-if` 条件渲染。条件支持 `data`、`computed`、一段表达式
    -   [x] `m-for` 循环。`(item,index) in array`、`item in array`
-   [x] 事件绑定
    -   [x] `@click` | `@mousedown` | `...` 。可以使用 `$event` 占位原生事件
-   [x] `watch` 数据监听，详见下方示例
    -   [x] 声明方式
    -   [x] api方式
-   [x] 生命周期
    -   [x] `created` 组件创建成功，可以使用 `this` 得到MVVM的实例
    -   [x] `beforeMount` 将要被插入dom
    -   [x] `mounted` 组件被添加到dom，可以使用 `this.el` 获取根节点dom
    -   [x] `beforeUpdate` 组件将要更新
    -   [x] `updated` 组件更新完毕

## Demo

[MVVM - 功能演示](https://shalldie.github.io/demos/mvvm/)

## Development && Production

    npm run dev:mini-mvvm 开发调试

    npm run build 生产构建

## Example

```ts
import MVVM from 'mini-mvvm'; // es module, typescript
// const MVVM from 'mini-mvvm'; // commonjs
// const MVVM = window['MiniMvvm']; // window

new MVVM({
    // 挂载的目标节点的选择器
    // 如果没有 template，就用这个节点作为编译模板
    el: '#app',
    template: `
    <div id="app">
        <div>{{ content }}</div>
    </div>
    `,
    // data
    data() {
        return {
            content: 'this is content.'
        };
    },
    computed: {}, // ...计算属性
    created() {   // ...hook，可以使用 this
        // 使用api方式去watch
        this.$watch('key', (val, oldVal) => { }, { immediate: true });
    },
    mounted() { }, // ...hook，可以使用 this.el
    methods: {},  // ...方法
    watch: { // ...数据监听
        // 声明方式1：
        watch1(val, oldVal) { },
        // 声明方式2：
        watch2: {
            immediate: true, // 立即执行
            handler(val, oldVal) { }
        }
    }
});
```

## Enjoy it! :D