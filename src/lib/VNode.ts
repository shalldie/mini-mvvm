import MVVM from '../core/MVVM';
import Watcher from './Watcher';

export default class VNode {
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
}

/**
 * dom 节点相关信息
 *
 * @export
 * @class NodeStore
 */
export class NodeStore {

    public vnode: VNode;

    constructor(vm: MVVM, watcher: Watcher) {

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
     * @type {Map<string, { event: string, handler: Function }>}
     * @memberof Cache
     */
    public watcherEventMap: Map<string, { event: string, handler: Function }> = new Map();


}
