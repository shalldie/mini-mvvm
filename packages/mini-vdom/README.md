# mini-vdom

[![npm](https://img.shields.io/npm/v/mini-vdom.svg)](https://www.npmjs.com/package/mini-vdom) [![file size](https://img.shields.io/github/size/shalldie/mini-mvvm/dist/mini-vdom.js.svg)](https://www.npmjs.com/package/mini-vdom) [![Build Status](https://travis-ci.org/shalldie/mini-mvvm.svg?branch=master)](https://travis-ci.org/shalldie/mini-mvvm)

A mini virtual dom lib. 一个轻量级的虚拟 dom 库。

## Installation

    npm install mini-vdom --save

## Description

1. 超级轻量 `9kb`
2. 作为一个 vdom lib，你只用更改数据，`mini-vdom` 会帮你处理好 dom 🤓🤓
3. 丰富的代码提示，已经包含了 `.d.ts` 文件

这是在学习 [snabbdom](https://github.com/snabbdom/snabbdom) 源码之后，借鉴其思路写的一个 vdom 库。

适合用在一些快速开发的项目中，或者作为二次开发的依赖，只包含了最常用的 vdom 功能，体积 `9kb` 超轻量。 如果需要构造大型复杂项目，你可能需要一个成熟的 mvvm 框架。

## Examples

使用 `npm run dev` 去查看 `src/dev.ts` 的例子.

或者查看 [在线例子 - Todo List](https://shalldie.github.io/demos/mini-vdom/)

## Usage

```ts
import { h, patch } from 'mini-vdom'; // es module, typescript
// const { h, patch } = require('MiniVdom'); // commonjs
// const { h, patch } = window['MiniVdom']; // window

// 生成一个 vnode 节点
const node = h('span', 'hello world');

// 把vnode挂载在一个dom上
patch(document.getElementById('app'), vnode);

// 用一个新的vnode去更新旧的vnode
const newNode = h(
    'div.new-div',
    {
        attrs: {
            'data-name': 'tom'
        },
        on: {
            click() {
                alert('new div');
            }
        }
    },
    'click me to show alert! '
);

patch(vnode, newVnode);
```

```ts
// h 是 VNode 的工厂方法，提供以下四种方式去创建一个 VNode
// 记不住？没关系，已经提供了 .d.ts 文件提示

function h(type: string, text?: string): VNode;
function h(type: string, children?: VNode[]): VNode;
function h(type: string, data?: IVNodeData, text?: string): VNode;
function h(type: string, data?: IVNodeData, children?: VNode[]): VNode;
```

# Enjoy it ! >\_<#@!
