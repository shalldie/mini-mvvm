
/**
 * 节点类型
 *
 * @export
 * @enum {number}
 */
export enum ENodeType {

    /**
     * 元素节点
     */
    Element = 1,

    /**
     * 文本节点
     */
    Text = 3,

    /**
     * 注释节点
     */
    Comment = 8,

    /**
     * fragment 容器
     */
    DocumentFragment = 11
}

/**
 * 用于表示模板结构的节点类，与vue中的vnode不同
 *
 * @export
 * @class VNode
 */
export default class VNode {


    /**
     * 是否根节点
     *
     * @type {boolean}
     * @memberof VNode
     */
    public isRoot: boolean = false;

    /**
     * 父节点
     *
     * @type {VNode}
     * @memberof VNode
     */
    public parent: VNode;

    /**
     * 子节点
     *
     * @type {VNode[]}
     * @memberof VNode
     */
    public children: VNode[] = [];

    /**
     * nodeType
     *
     * @type {number}
     * @memberof VNode
     */
    public nodeType: ENodeType = ENodeType.Element;

    /**
     * 节点名称
     *
     * @type {string}
     * @memberof VNode
     */
    public tagName: string;

    /**
     * 原始 attributes
     *
     * @type {Map<string, string>}
     * @memberof VNode
     */
    public attributes: Map<string, string> = new Map();

    /**
     * 如果是文本节点，有这个属性
     *
     * @type {string}
     * @memberof VNode
     */
    public textContent: string = '';


    /**
     * clone 一个新的vnode
     *
     * @returns {VNode}
     * @memberof VNode
     */
    public clone(): VNode {
        const vnode = new VNode();
        Object.assign(vnode, this);

        vnode.children = vnode.children.map(n => n.clone());

        vnode.attributes = new Map();
        for (let [key, value] of this.attributes) {
            vnode.attributes.set(key, value);
        }

        return vnode;
    }

}
