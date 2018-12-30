import NodeStore from "../../models/NodeStore";
import * as _ from '../../utils';

const MODEL_KEY = 'x-model';

/**
 * 支持的 x-model 的所有 tagName
 */
const SupportTagNames = ['input', 'textarea', 'select'];

export default class XModel {

    public static bind(node: HTMLElement, nodeStore: NodeStore) {

        // 节点不支持双绑
        if (!~SupportTagNames.indexOf(node.tagName.toLowerCase())) {
            return;
        }

        const attributes = Array.from(nodeStore.vnode.attributes);

        let item = attributes.find(attr => attr[0] === MODEL_KEY);

        // 没有声明双绑
        if (!item) {
            return;
        }

        const inputNode = (<HTMLInputElement>node);
        const key = item[1];

        // input 事件，存放在 demEventMap 中

        const inputHandler = () => {
            const val = inputNode.value;
            _.setValueOfVM(nodeStore.vm, key, val);
        };

        inputNode.addEventListener('input', inputHandler);

        nodeStore.domEventMap.set('input', {
            event: 'input',
            handler: inputHandler
        });

        // watcher 监听

        const watcherHandler = (newVal: any) => {
            if (newVal != inputNode.value) {
                inputNode.value = newVal;
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
