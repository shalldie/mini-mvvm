import NodeStore from "../../models/NodeStore";
import { FOR_KEY } from '../../utils/constants';
import Context from "../../models/Context";
import Compiler from "../Compiler";

/**
 * x-for 绑定
 *
 * x-for 的实现比较偷懒，先用一个 comment 占位。
 * 然后在这个comment后面再追加元素
 *
 * @export
 * @class XFor
 */
export default class XFor {

    public static bind(node: HTMLElement, nodeStore: NodeStore, compiler: Compiler): HTMLElement {

        // 没有这个指令
        if (!nodeStore.vnode.attributes.has(FOR_KEY)) {
            return node;
        }

        // x-for 的表达式
        const expression = nodeStore.vnode.attributes.get(FOR_KEY);

        let match: RegExpMatchArray;

        // x-for="item in list"
        const regNormal = /^\s*?(\S*)\s*in\s*(\S*)\s*$/;
        // x-for="(item,index) in list"
        const regWithIndex = /^\s*?\(\s*(\S+)\s*,\s*(\S+)\s*\)\s*in\s*(\S*)\s*$/;

        let itemKey: string = '';
        let indexKey: string = '';
        let dep: string = ''; // 依赖项

        if (match = expression.match(regNormal)) {
            // 依赖
            dep = match[2];
            itemKey = match[1];
        }
        else if (match = expression.match(regWithIndex)) {
            dep = match[3];
            itemKey = match[1];
            indexKey = match[2];
        }
        else {
            throw new Error(`${FOR_KEY} 的表达式有误`);
        }


        const fragment = document.createDocumentFragment();
        const comment = document.createComment(`${FOR_KEY}${nodeStore.uuid}`)
        fragment.append(comment);

        let list: any[] = nodeStore.context.get(dep);

        for (let i = 0, len = list.length; i < len; i++) {
            // extData
            const extData = {};
            extData[itemKey] = list[i];
            if (indexKey) {
                extData[indexKey] = i;
            }
            // vnode
            const cloneVNode = nodeStore.vnode.clone();
            cloneVNode.attributes.delete(FOR_KEY);
            // debugger;
            fragment.append(compiler.buildElementNode(cloneVNode, extData))
        }

        return <HTMLElement><any>fragment;
    }

}
