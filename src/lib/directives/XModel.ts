import NodeStore from "../../models/NodeStore";
import * as _ from '../../utils';
import { MODEL_KEY } from '../../utils/constants';

// 支持的标签，以及对应的事件
const supportMap: Map<string, string> = new Map([
    ['input', 'input'],
    ['textarea', 'input'],
    ['select', 'change']
]);

export default class XModel {

    public static bind(node: HTMLElement, nodeStore: NodeStore) {

        // 节点不支持双绑
        if (!supportMap.has(node.tagName.toLowerCase())) {
            return;
        }

        const attributes = Array.from(nodeStore.vnode.attributes);

        let item = attributes.find(attr => attr[0] === MODEL_KEY);

        // 没有声明双绑
        if (!item) {
            return;
        }

        node.removeAttribute(MODEL_KEY);

        const inputNode = (<HTMLInputElement>node);  // 节点
        const key = item[1];  // 依赖
        const event = supportMap.get(node.tagName.toLowerCase()); // 事件名

        // event 事件，存放在 domEventMap 中

        const inputHandler = () => {
            const val = inputNode.value;
            _.setValueOfVM(nodeStore.vm, key, val);
        };

        inputNode.addEventListener(event, inputHandler);

        nodeStore.domEventMap.set(event, {
            event,
            handler: inputHandler
        });

        // watcher 监听

        const watcherHandler = (newVal: any) => {
            if (newVal !== inputNode.value) {
                // 有些类型的标签，比如select，需要先生成option才能赋值
                _.nextTick(() => inputNode.value = newVal);
            }
        };

        nodeStore.watcher.on(key, (newVal: any) => {
            if (newVal != inputNode.value) {
                inputNode.value = newVal;
            }
        });

        nodeStore.watcherEventMap.set(key, {
            event: key,
            handler: watcherHandler
        });

        // 初始化
        watcherHandler(_.getValueFromVM(nodeStore.vm, key));

    }
}
