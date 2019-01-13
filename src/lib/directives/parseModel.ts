import NodeStore from "../../models/NodeStore";
import * as _ from '../../utils';
import { MODEL_KEY } from '../../utils/constants';

// 支持的标签，以及对应的事件
const supportMap: Map<string, { event: string, value: string }> = new Map([
    ['input', {
        event: 'input',
        value: 'value'
    }],
    ['textarea', {
        event: 'input',
        value: 'value'
    }],
    ['select', {
        event: 'change',
        value: 'value'
    }]
]);
// input 中的变种
const inputMap: Map<string, { event: string, value: string }> = new Map([
    ['checkbox', {
        event: 'change',
        value: 'checked'
    }]
]);

/**
 * 处理双向绑定
 *
 * @export
 * @param {HTMLElement} node
 * @param {NodeStore} nodeStore
 * @returns
 */
export default function parseModel(node: HTMLElement, nodeStore: NodeStore) {
    const tagName = node.tagName.toLowerCase();
    // 节点不支持双绑
    if (!supportMap.has(tagName)) {
        return;
    }

    const attributes = Array.from(nodeStore.vnode.attributes);

    let item = attributes.find(attr => attr[0] === MODEL_KEY);

    // 没有声明双绑
    if (!item) {
        return;
    }

    node.removeAttribute(MODEL_KEY);

    // 支持的事件、节点的值属性
    let supportItem = supportMap.get(tagName);
    if (tagName === 'input' && inputMap.has((<HTMLInputElement>node).type)) {
        supportItem = inputMap.get((<HTMLInputElement>node).type);
    }

    const eleNode = (<HTMLInputElement>node);  // 节点
    const key = item[1];  // 依赖

    // const event = supportMap.get(node.tagName.toLowerCase()); // 事件名
    const event = supportItem.event;

    // event 事件，存放在 domEventMap 中
    const inputHandler = () => {
        const val = eleNode[supportItem.value];
        _.setValueOfVM(nodeStore.vm, key, val);
    };

    eleNode.addEventListener(event, inputHandler);

    nodeStore.domEventMap.set(event, {
        event,
        handler: inputHandler
    });

    // watcher 监听

    const watcherHandler = (newVal: any) => {
        if (newVal !== eleNode[supportItem.value]) {
            eleNode[supportItem.value] = newVal;
        }
    };

    nodeStore.watcher.on(key, watcherHandler);

    nodeStore.watcherEventMap.set(key, {
        event: key,
        handler: watcherHandler
    });

    // 初始化
    // 有些类型的标签，比如select，需要先生成option才能赋值
    _.nextTick(() => watcherHandler(nodeStore.context.get(key)));

}
