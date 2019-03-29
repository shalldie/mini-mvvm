import MVVM from '../core/MVVM';
import { NODE_STORE_KEY } from './constants';
import NodeStore from '../models/NodeStore';
import VNode, { ENodeType } from '../models/VNode';

/**
 * microTask 要做的事情
 *
 * @export
 * @param {() => void} fn callback
 */
export function nextTick(fn: () => void): void {
    Promise.resolve().then(fn);
}

/**
 * 获取数据类型
 *
 * @export
 * @param {*} sender 要判断的数据
 * @returns {string}
 */
export function getType(sender: any): string {
    return Object.prototype.toString.call(sender).toLowerCase().match(/\s(\S+?)\]/)[1];
}

/**
 * each
 *
 * @export
 * @param {Object} [data={}]
 * @param {(value: any, key: string) => void} fn
 */
export function each(data: Object = {}, fn: (value: any, key: string) => void) {
    for (let key in data) {
        fn(data[key], key);
    }
};

/**
 * 根据 key 从 data 中获取值
 *
 * @example
 * ({ a: { b: { c: 'tom'}}},'a.b.c') => 'tom'
 *
 * @export
 * @param {Object} data
 * @param {string} key
 * @returns
 */
export function getValueFromKey(data: Object, key: string) {
    let keys = key.split('.');
    let result = data[keys.shift()];

    while (keys.length) {
        result = result[keys.shift()];
    }

    return result;
}

/**
 * 根据key，从vm上获取数据
 *
 * @export
 * @param {MVVM} vm
 * @param {string} key
 * @returns
 */
export function getValueFromVM(vm: MVVM, key: string): any {
    return getValueFromKey(vm, key);
}

/**
 * 根据key设置vm的值
 *
 * @export
 * @param {MVVM} vm
 * @param {string} key
 * @param {*} value
 */
export function setValueOfVM(vm: MVVM, key: string, value: any) {
    let keys = key.split('.');
    let target = vm;

    while (keys.length > 1) {
        target = target[keys.shift()];
    }

    target[keys.shift()] = value;
}

export function serializeDependences(fn: Function): string[] {
    const content = fn.toString();
    const reg = /this\.([a-zA-Z\d\.]+)/g;

    const deps: string[] = [];

    let match: RegExpExecArray;
    while (match = reg.exec(content)) {
        deps.push(match[1]);
    }

    return [...new Set(deps)];
}

/**
 * 卸载 dom 节点上所有的事件监听
 *
 * @export
 * @param {HTMLElement} node
 * @returns
 */
export function disposeElement(node: HTMLElement) {
    const nodeStore: NodeStore = node[NODE_STORE_KEY];

    // debugger;
    if (!nodeStore) {
        return;
    }

    // 卸载 dom 事件
    for (let { event, handler } of nodeStore.domEventMap.values()) {
        node.removeEventListener(event, handler as any);
    }

    nodeStore.domEventMap.clear();

    // 卸载依赖监听事件
    for (let { event, handler } of nodeStore.watcherEventMap.values()) {
        nodeStore.watcher.off(event, handler);
    }

    nodeStore.watcherEventMap.clear();

    // 如果是 Element 节点，递归
    if (nodeStore.vnode.nodeType === ENodeType.Element) {
        node.childNodes.forEach(child => disposeElement(child as HTMLElement));
    }

}

/**
 * 根据dom节点生成vnode树
 *
 * @export
 * @param {HTMLElement} node
 * @returns {VNode}
 */
export function nodeToVNode(node: HTMLElement): VNode {
    // debugger;
    const vnode = new VNode();

    vnode.nodeType = node.nodeType;

    // 如果是元素节点
    if (vnode.nodeType === ENodeType.Element) {
        // tagName
        vnode.tagName = node.tagName;
        // attributes
        for (let { name, value } of node.attributes) {
            vnode.attributes.set(name, value.trim());
        }
        // 递归子节点
        node.childNodes.forEach(child => {
            const childVNode = nodeToVNode(child as HTMLElement);
            if (childVNode) {
                childVNode.parent = vnode;
                vnode.children.push(childVNode);
            }
        });
        return vnode;
    }
    // 如果是文本节点
    else if (vnode.nodeType === ENodeType.Text) {
        vnode.textContent = node.textContent;
        return vnode;
    }

    return null;
}

let uuid = 1;
export function getUUID() {
    return uuid++;
}
