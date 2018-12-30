import MVVM from '../core/MVVM';
import Watcher from '../lib/Watcher';

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
    ELEMENT_NODE = 1,

    /**
     * 文本节点
     */
    TEXT_NODE = 3
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
    public nodeType: ENodeType = ENodeType.ELEMENT_NODE;

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
}

/**
 * dom 节点相关信息
 *
 * @export
 * @class NodeStore
 */
export class NodeStore {

    public vnode: VNode;

    constructor(vnode: VNode, vm: MVVM, watcher: Watcher) {
        this.vnode = vnode;
        this.vm = vm;
        this.watcher = watcher;
    }

    /**
     * Watcher 用来 数据更新收集、派发事件通知
     *
     * @type {Watcher}
     * @memberof Cache
     */
    public watcher: Watcher;

    /**
     * MVVM 实例
     *
     * @type {MVVM}
     * @memberof Cache
     */
    public vm: MVVM;



    /**
     * attribute 缓存
     *
     * @type {Map<string, { originAttr: string, actualAttr: string, dep: string }>}
     * @memberof Cache
     */
    public attrMap: Map<string, { originAttr: string, actualAttr: string, dep: string }> = new Map();

    /**
     * dom 事件缓存
     *
     * @type {Map<string, { event: string, handler: Function }>}
     * @memberof Cache
     */
    public domEventMap: Map<string, { event: string, handler: Function }> = new Map();


    /**
     * watcher 事件缓存
     *
     * @type {Map<string, { event: string, handler: Function, temp?: any  }>}
     * @memberof Cache
     */
    public watcherEventMap: Map<string, { event: string, handler: Function, temp?: any }> = new Map();


}
