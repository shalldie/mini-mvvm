import NodeStore from "../../models/NodeStore";
import * as _ from '../../utils';
import { NODE_STORE } from '../../utils/constants';


const IF_KEY: string = 'x-if';


export default class XIf {

    public static bind(node: HTMLElement, nodeStore: NodeStore): boolean {

        // 没有这个指令
        if (!nodeStore.vnode.attributes.has(IF_KEY)) {
            return true;
        }

        // debugger;

        const key = nodeStore.vnode.attributes.get(IF_KEY);

        const handler = () => {
            // debugger;
            const parentNode = node.parentNode;
            if (!parentNode) return;

            const parentNodeStore: NodeStore = node.parentNode[NODE_STORE];
            if (!parentNodeStore) return;


            // 重置一下父节点
            const el = parentNodeStore.vm.$compiler.buildElementNode(nodeStore.vnode);

            if (!el) return;

            _.disposeElement(<HTMLElement>parentNode);
            parentNode.parentNode.replaceChild(el, parentNode);
        };
        nodeStore.watcher.on(key, handler);
        nodeStore.watcherEventMap.set(key, {
            event: key,
            handler
        });

        // 当前是否显示
        return !!_.getValueFromVM(nodeStore.vm, key);
    }
}
