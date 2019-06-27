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
