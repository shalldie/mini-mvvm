import NodeStore from "../../models/NodeStore";
import * as _ from '../../utils';
import { NODE_STORE_KEY, IF_KEY } from '../../utils/constants';

/**
 * x-if 的实现，使用一个 Comment 作为占位代替原有的节点
 * 在条件成立的时候再 replace 回来
 *
 * @export
 * @param {HTMLElement} node
 * @param {NodeStore} nodeStore
 * @param {Object} contextData
 * @returns {HTMLElement}
 */
export default function parseIf(node: HTMLElement, nodeStore: NodeStore, contextData: Object): HTMLElement {

    // 没有这个指令
    if (!nodeStore.vnode.attributes.has(IF_KEY)) {
        return node;
    }

    // 依赖的key
    const key = nodeStore.vnode.attributes.get(IF_KEY);

    // 去掉attribute上的显示
    node.removeAttribute(IF_KEY);

    // 绑定事件

    const comment = document.createComment(`${IF_KEY}${nodeStore.uuid}`);
    comment[NODE_STORE_KEY] = nodeStore;

    const tupleElements: [HTMLElement, Comment] = [
        node,
        comment
    ];

    // 初始化值
    let baseVisible = !!nodeStore.context.get(key);

    const handler = (visible: any) => {
        if (baseVisible === !!visible) {
            return;
        }
        baseVisible = !!visible;

        // 由不可见变为可见
        if (visible) {
            // 先dispose，重新生成
            _.disposeElement(tupleElements[0]);
            tupleElements[0] = nodeStore.vm.$compiler.buildElementNode(nodeStore.vnode, contextData);

            // 再切换
            tupleElements[1].parentNode.replaceChild(
                tupleElements[0],
                tupleElements[1]
            );
            return;
        }

        tupleElements[0].parentNode.replaceChild(
            tupleElements[1],
            tupleElements[0]
        );

    };

    // 只有全局的数据才需要监听
    if (!nodeStore.context.isExtdata(key)) {
        nodeStore.watcher.on(key, handler);
        nodeStore.watcherEventMap.set(key, {
            event: key,
            handler
        });
    }

    // 如果不渲染
    if (!baseVisible) {
        return <HTMLElement><any>tupleElements[1];
    }

    return node;
}
