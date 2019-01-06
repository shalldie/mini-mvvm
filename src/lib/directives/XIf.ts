import NodeStore from "../../models/NodeStore";
import * as _ from '../../utils';
import { NODE_STORE_KEY, IF_KEY } from '../../utils/constants';
import VNode, { ENodeType } from "../../models/VNode";
import Computed from "../../models/Computed";


/**
 * x-if 的实现，使用一个 Comment 作为占位代替原有的节点
 * 在条件成立的时候再 replace 回来
 *
 * @export
 * @class XIf
 */
export default class XIf {

    public static bind(node: HTMLElement, nodeStore: NodeStore, contextData: Object): HTMLElement {

        // 没有这个指令
        if (!nodeStore.vnode.attributes.has(IF_KEY)) {
            return node;
        }
        // window['store'] = nodeStore;

        // // x-for 的表达式，需要从里面分析出依赖
        // const expression = nodeStore.vnode.attributes.get(IF_KEY);
        // const deps = expression.match(/[\w\.]*/g).filter(n => n.length);
        // console.log(deps);
        // const dict = {};
        // const fnKey = IF_KEY + _.getUUID();
        // const fnBody = [
        //     'with(this) {',
        //     `return ${expression};`,
        //     '}'
        // ].join('');
        // const fn = new Function(fnBody);
        // dict[fnKey] = fn;
        // const invoker = {};
        // deps.forEach(dep => {
        //     Object.defineProperty(invoker, dep, {
        //         enumerable: false,
        //         configurable: false,
        //         get() {
        //             const result = nodeStore.context.get(dep);
        //             console.log(result);
        //             return result;
        //         }
        //     });
        // });

        // nodeStore.computed.push(new Computed(dict, nodeStore.watcher, invoker));



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

        const handler = (visible: any) => {

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

        // console.log('on:' + key);

        // 只有全局的数据才需要监听
        if (!nodeStore.context.isExtdata(key)) {
            nodeStore.watcher.on(key, handler);
            nodeStore.watcherEventMap.set(key, {
                event: key,
                handler
            });
        }

        // 初始化
        const visible = !!nodeStore.context.get(key);

        // 如果不渲染
        if (!visible) {
            return <HTMLElement><any>tupleElements[1];
        }

        return node;
    }
}
