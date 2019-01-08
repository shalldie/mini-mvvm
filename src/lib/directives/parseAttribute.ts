import NodeStore from "../../models/NodeStore";
import { serializeEvent } from "./parseEvent";
import * as _ from '../../utils';

/**
 * 处理节点的属性监听、绑定
 *
 * @export
 * @param {HTMLElement} node
 * @param {NodeStore} nodeStore
 */
export default function parseAttribute(node: HTMLElement, nodeStore: NodeStore) {
    // debugger;
    for (let [name, value] of nodeStore.vnode.attributes) {

        try {
            node.setAttribute(name, value);
        }
        catch (ex) {
            // 这里待完善
        }

        const reg = /^(x-bind)?:(\S+)$/;
        const match = name.match(reg);

        if (!match) {
            continue;
        }

        // 如果符合就去掉声明
        node.removeAttribute(name);

        const attrName = match[2];

        if (!~value.indexOf('(')) {
            // 设置默认值
            node.setAttribute(attrName, nodeStore.context.get(value));

            // 监听依赖项
            const handler = (newVal: any) => {
                node.setAttribute(attrName, newVal);
            };
            nodeStore.watcher.on(value, handler);

            // 把监听保存下来
            nodeStore.watcherEventMap.set(value, {
                event: value,
                handler
            });
        }
        else {
            const { deps, handler: getValue } = serializeEvent(value, nodeStore);

            const handler = () => {
                node.setAttribute(attrName, getValue());
            };

            deps.forEach(dep => {
                if (nodeStore.context.isExtdata(dep)) {
                    return;
                }
                nodeStore.watcher.on(dep, handler);

                // 把监听保存下来
                nodeStore.watcherEventMap.set(dep, {
                    event: dep,
                    handler
                });

            });
            handler();
        }
    }
}
