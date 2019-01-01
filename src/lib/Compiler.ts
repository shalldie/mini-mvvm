import VNode, { ENodeType } from '../models/VNode';
import NodeStore from '../models/NodeStore';
import Watcher from './Watcher';
import * as _ from '../utils';
import MVVM from '../core/MVVM';
import XModel from './directives/XModel';
import { NODE_STORE_KEY } from '../utils/constants';
import XIf from './directives/XIf';


export default class Compiler {

    private el: HTMLElement;

    private vnode: VNode;

    private vm: MVVM;

    private watcher: Watcher;

    constructor(el: HTMLElement, vm: MVVM, watcher: Watcher) {
        this.el = el;
        this.vnode = this.nodeToVNode(el);
        this.vnode.isRoot = true;
        // console.log(this.vnode);
        this.vm = vm;
        this.watcher = watcher;

        this.initialize();
    }

    /**
     * 根据dom节点生成vnode树
     *
     * @private
     * @param {HTMLElement} node
     * @returns {VNode}
     * @memberof Compiler
     */
    private nodeToVNode(node: HTMLElement): VNode {
        // debugger;
        const vnode = new VNode();

        vnode.nodeType = node.nodeType;

        // 如果是元素节点
        if (vnode.nodeType === ENodeType.ELEMENT_NODE) {
            // tagName
            vnode.tagName = node.tagName;
            // attributes
            for (let { name, value } of node.attributes) {
                vnode.attributes.set(name, value.trim());
            }
            // 递归子节点
            node.childNodes.forEach(child => {
                const childVNode = this.nodeToVNode(<HTMLElement>child);
                if (childVNode) {
                    childVNode.parent = vnode;
                    vnode.children.push(childVNode);
                }
            });
            return vnode;
        }
        // 如果是文本节点
        else if (vnode.nodeType === ENodeType.TEXT_NODE) {
            vnode.textContent = node.textContent;
            return vnode;
        }

        return null;
    }

    private initialize() {
        // 清空跟节点内容
        this.el.innerHTML = '';
        // 编译根节点
        this.buildElementNode(this.vnode);
    }

    //#region ElementNode


    /**
     * 构建一个dom节点，并处理自身和子节点所有的绑定信息
     *
     * @param {VNode} vnode
     * @returns
     * @memberof Compiler
     */
    public buildElementNode(vnode: VNode) {
        let node = vnode.isRoot ? this.el
            : document.createElement(vnode.tagName.toLowerCase());

        const nodeStore = new NodeStore(vnode, this.vm, this.watcher);
        node[NODE_STORE_KEY] = nodeStore;

        // 处理属性
        this.buildAttributes(node, nodeStore);

        // 处理事件
        this.buildEvents(node, nodeStore);

        // 处理双绑
        XModel.bind(node, nodeStore);

        // 处理 x-if
        node = XIf.bind(node, nodeStore);

        if (node.nodeType !== ENodeType.ELEMENT_NODE) {
            return node;
        }

        // 递归
        vnode.children.forEach(vchild => {

            // 添加 element 节点
            if (vchild.nodeType === ENodeType.ELEMENT_NODE) {
                node.appendChild(this.buildElementNode(vchild));
            }

            // 添加 text 节点
            else if (vchild.nodeType === ENodeType.TEXT_NODE) {
                node.appendChild(this.buildTextNode(vchild));
            }

        });

        return node;
    }

    /**
     * 处理节点的属性监听、绑定
     *
     * @private
     * @param {HTMLElement} node
     * @param {NodeStore} nodeStore
     * @memberof Compiler
     */
    private buildAttributes(node: HTMLElement, nodeStore: NodeStore) {
        // debugger;
        for (let [name, value] of nodeStore.vnode.attributes) {

            try {
                node.setAttribute(name, value);
            }
            catch (ex) {

            }

            const reg = /^(x-bind)?:(\S+)$/;
            const match = name.match(reg);

            if (!match) {
                continue;
            }

            // 如果符合就去掉声明
            node.removeAttribute(name);

            const attrName = match[2];

            // 设置默认值
            node.setAttribute(attrName, _.getValueFromVM(nodeStore.vm, value));

            // 监听依赖项
            const handler = (newVal: any) => {
                node.setAttribute(attrName, newVal);
            };
            this.watcher.on(value, handler);

            // 把监听保存下来
            nodeStore.watcherEventMap.set(value, {
                event: value,
                handler
            })
        }
    }

    /**
     * 处理节点上绑定的事件
     *
     * @private
     * @param {HTMLElement} node
     * @param {NodeStore} nodeStore
     * @memberof Compiler
     */
    private buildEvents(node: HTMLElement, nodeStore: NodeStore) {

        for (let [name, value] of nodeStore.vnode.attributes) {
            // 获取事件名
            const reg = /(x-on:|@)(\S+)/;

            let match = name.match(reg);

            if (!match) {
                continue;
            }

            if (nodeStore.vnode.isRoot) {
                node.removeAttribute(name);
            }

            const eventName = match[2];

            const handler = this.vm[value];

            node.addEventListener(eventName, handler);

            nodeStore.domEventMap.set(eventName, {
                event: eventName,
                handler
            });
        }
    }
    //#endregion

    //#region TextNode


    /**
     * 处理文本节点，依赖绑定
     *
     * @private
     * @param {VNode} vnode
     * @returns
     * @memberof Compiler
     */
    private buildTextNode(vnode: VNode) {
        const node = document.createTextNode(vnode.textContent);
        const nodeStore: NodeStore = new NodeStore(vnode, this.vm, this.watcher);
        node[NODE_STORE_KEY] = nodeStore;

        const content = vnode.textContent;
        const reg = /\{\{\s*?(\S+?)\s*?\}\}/g;

        let match: RegExpExecArray;

        // 更新 textContent 的方法
        const updateContent = () => {
            let result = content;

            for (let [eventKey, { temp }] of nodeStore.watcherEventMap) {
                const regKey = eventKey.replace(/\./g, '\\.');
                const reg = new RegExp(`\\{\\{\\\s*?${regKey}\\s*?\}\\}`, 'g');
                result = result.replace(reg, temp);
            }

            node.textContent = result;
        };

        // 获取所有依赖，存下来
        while (match = reg.exec(content)) {
            // depMap.set(match[1], '');
            nodeStore.watcherEventMap.set(match[1], {
                event: match[1],
                handler: updateContent,
                temp: ''
            });
        }

        // 初始化、监听依赖项
        for (let [key, item] of nodeStore.watcherEventMap) {

            // 添加初始值
            nodeStore.watcherEventMap.set(key, {
                ...item,
                temp: _.getValueFromVM(this.vm, key)
            });
            // 添加依赖监听
            this.watcher.on(key, (newVal: any) => {
                nodeStore.watcherEventMap.set(key, {
                    ...item,
                    temp: newVal
                });
                updateContent();
            });
        }

        updateContent();

        return node;
    }
    //#endregion

}
