/**
 * VNode 实现，虚拟dom节点
 */

import { IProps } from "./modules/Props";
import { IAttrs } from "./modules/Attrs";
import { IListener } from "./modules/Events";

export interface IVNodeData {

    key?: string;

    props?: IProps;

    attrs?: IAttrs;

    on?: IListener;
}


export default class VNode {

    public key: string;

    public type: string;

    public data: IVNodeData;

    public children?: VNode[];

    public text?: string;

    public elm?: Element;

    constructor(
        type: string,
        data: IVNodeData = {},
        children?: VNode[],
        text?: string,
        elm?: Element
    ) {
        this.type = type;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;

        this.key = data.key;
    }

    /**
     * 是否是 VNode
     *
     * @static
     * @param {*} node 要判断的对象
     * @returns {boolean}
     * @memberof VNode
     */
    public static isVNode(node: any): boolean {
        return node instanceof VNode;
    }

    /**
     * 是否是相同的 VNode 对象
     * 判断依据是 key 跟 tagname 是否相同，既 对于相同类型dom元素尽可能复用
     *
     * @static
     * @param {VNode} oldVnode
     * @param {VNode} vnode
     * @returns {boolean}
     * @memberof VNode
     */
    public static isSameVNode(oldVnode: VNode, vnode: VNode): boolean {
        return oldVnode.key === vnode.key
            && oldVnode.type === vnode.type;
    }
}
