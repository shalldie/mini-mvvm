import NodeStore from "../../models/NodeStore";
import { FOR_KEY, FOR_KEY_UUID, NODE_STORE_KEY } from '../../utils/constants';
import Compiler from "../Compiler";
import * as _ from '../../utils';

/**
 * x-for 绑定
 *
 * @export
 * @param {HTMLElement} node
 * @param {NodeStore} nodeStore
 * @param {Compiler} compiler
 * @param {Object} contextData
 * @returns {HTMLElement}
 */
export default function parseFor(node: HTMLElement, nodeStore: NodeStore, compiler: Compiler, contextData: Object): HTMLElement {

    // 没有这个指令
    if (!nodeStore.vnode.attributes.has(FOR_KEY)) {
        return node;
    }

    // x-for 的表达式
    const expression = nodeStore.vnode.attributes.get(FOR_KEY);

    let match: RegExpMatchArray;

    // x-for="item in list"
    const regNormal = /^\s*?([\w]*)\s*in\s*(\S*)\s*$/;
    // x-for="(item,index) in list"
    const regWithIndex = /^\s*?\(\s*(\S+)\s*,\s*(\S+)\s*\)\s*in\s*(\S*)\s*$/;

    let itemKey: string = '';
    let indexKey: string = '';
    let dep: string = ''; // 依赖项

    // item in list
    if (match = expression.match(regNormal)) {
        // 依赖
        dep = match[2];
        itemKey = match[1];
    }
    // (item,index) in list
    else if (match = expression.match(regWithIndex)) {
        // debugger;
        dep = match[3];
        itemKey = match[1];
        indexKey = match[2];
    }
    else {
        throw new Error(`${FOR_KEY} 的表达式有误`);
    }

    // 初始化
    const fragment = document.createDocumentFragment();
    const comment = document.createComment(`${FOR_KEY}${nodeStore.uuid}`);
    comment[NODE_STORE_KEY] = nodeStore;
    fragment.append(comment);

    let list: any[] = nodeStore.context.get(dep);

    for (let i = 0, len = list.length; i < len; i++) {
        // extData
        let extData = {};
        extData[itemKey] = list[i];
        if (indexKey) {
            extData[indexKey] = i;
        }
        // 同时继承父节点context、当前context
        extData = Object.assign({}, contextData, extData);
        // vnode
        const cloneVNode = nodeStore.vnode.clone();
        cloneVNode.attributes.delete(FOR_KEY);
        // debugger;

        const el = compiler.buildElementNode(cloneVNode, extData);
        el[FOR_KEY_UUID] = nodeStore.uuid;
        fragment.append(el);
    }

    const handler = () => {
        // 先删除除了 comment 以外之前for的节点
        let nextNode: HTMLElement;
        while (nextNode = <HTMLElement>comment.nextElementSibling) {
            if (nextNode[FOR_KEY_UUID] !== nodeStore.uuid) {
                break;
            }
            _.disposeElement(nextNode);
            nextNode.parentNode.removeChild(nextNode);
        }
        // 再替换comment
        _.disposeElement(<HTMLElement><any>comment);
        comment.parentNode.replaceChild(
            compiler.buildElementNode(nodeStore.vnode),
            comment
        );
    };

    // 只有全局的数据才需要监听
    if (!nodeStore.context.isExtdata(dep)) {
        nodeStore.watcher.on(dep, handler);
        nodeStore.watcherEventMap.set(dep, {
            event: dep,
            handler
        });
    }

    return <HTMLElement><any>fragment;
}
