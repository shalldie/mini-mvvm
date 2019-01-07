import VNode, { ENodeType } from '../models/VNode';
import NodeStore from '../models/NodeStore';
import Watcher from './Watcher';
import * as _ from '../utils';
import MVVM from '../core/MVVM';
import { NODE_STORE_KEY } from '../utils/constants';
import parseAttribute from './directives/parseAttribute';
import parseEvent from './directives/parseEvent';
import parseModel from './directives/parseModel';
import parseIf from './directives/parseIf';
import parseFor from './directives/parseFor';


export default class Compiler {

    private el: HTMLElement;

    private vnode: VNode;

    private vm: MVVM;

    private watcher: Watcher;

    constructor(el: HTMLElement, vm: MVVM, watcher: Watcher) {
        this.el = el;
        this.vnode = _.nodeToVNode(el);
        this.vnode.isRoot = true;
        this.vm = vm;
        this.watcher = watcher;

        this.initialize();
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
     * @param {Object} [contextData]
     * @returns {HTMLElement}
     * @memberof Compiler
     */
    public buildElementNode(vnode: VNode, contextData: Object = {}): HTMLElement {
        let node = vnode.isRoot ? this.el
            : document.createElement(vnode.tagName.toLowerCase());

        const nodeStore = new NodeStore(vnode, this.vm, this.watcher);
        nodeStore.context.extend(contextData);
        node[NODE_STORE_KEY] = nodeStore;

        // 处理属性
        parseAttribute(node, nodeStore);

        // 处理事件
        parseEvent(node, nodeStore);

        // 处理双绑
        parseModel(node, nodeStore);

        // 处理 x-if
        node = parseIf(node, nodeStore, contextData);

        // 处理 x-for
        node = parseFor(node, nodeStore, this, contextData);

        // 文本节点直接返回
        if (node.nodeType === ENodeType.Text) {
            return node;
        }

        // element 节点，递归
        else if (node.nodeType === ENodeType.Element) {
            // 递归
            vnode.children.forEach(vchild => {

                // 添加 element 节点
                if (vchild.nodeType === ENodeType.Element) {
                    node.appendChild(this.buildElementNode(vchild, contextData));
                }

                // 添加 text 节点
                else if (vchild.nodeType === ENodeType.Text) {
                    node.appendChild(this.buildTextNode(vchild, contextData));
                }

            });
        }

        // fragment 节点，直接添加
        // fragment 节点内element，会调用 buildElementNode 生成，已经处理过相关事件
        else if (node.nodeType === ENodeType.DocumentFragment) {
            return node;
        }

        // 还有其他的么？先放着，以后再加 >_<#@!
        return node;
    }
    //#endregion

    //#region TextNode


    /**
     * 处理文本节点，依赖绑定
     *
     * @private
     * @param {VNode} vnode
     * @param {Object} contextData
     * @returns
     * @memberof Compiler
     */
    private buildTextNode(vnode: VNode, contextData: Object) {

        const node = document.createTextNode(vnode.textContent);
        const nodeStore: NodeStore = new NodeStore(vnode, this.vm, this.watcher);
        nodeStore.context.extend(contextData);
        node[NODE_STORE_KEY] = nodeStore;

        const valueMap: Map<string, any> = new Map();
        const content = vnode.textContent;
        const reg = /\{\{\s*?(\S+?)\s*?\}\}/g;

        let match: RegExpExecArray;

        // 更新 textContent 的方法
        const updateContent = () => {
            let result = content;

            for (let [key, value] of valueMap) {
                const regKey = key.replace(/\./g, '\\.');
                const reg = new RegExp(`\\{\\{\\\s*?${regKey}\\s*?\}\\}`, 'g');
                result = result.replace(reg, value);
            }

            node.textContent = result;
        };


        // 获取所有依赖，存下来，初始化
        while (match = reg.exec(content)) {
            valueMap.set(match[1], nodeStore.context.get(match[1]));
        }

        // 监听依赖项
        for (let key of valueMap.keys()) {

            // 如果是局部上下文的内容，不监听
            if (nodeStore.context.isExtdata(key)) {
                continue;
            }

            const handler = (newVal: any) => {
                valueMap.set(key, newVal);
                updateContent();
            };

            // 添加依赖监听
            nodeStore.watcherEventMap.set(key, {
                event: key,
                handler
            });

            nodeStore.watcher.on(key, handler);
        }

        updateContent();

        return node;
    }
    //#endregion
}
