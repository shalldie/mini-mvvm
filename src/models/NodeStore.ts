import VNode from './VNode';
import MVVM from '../core/MVVM';
import Watcher from '../lib/Watcher';

/**
 * dom 节点相关信息
 *
 * @export
 * @class NodeStore
 */
export default class NodeStore {

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
     * @memberof NodeStore
     */
    public watcher: Watcher;

    /**
     * MVVM 实例
     *
     * @type {MVVM}
     * @memberof NodeStore
     */
    public vm: MVVM;

    /**
     * attribute 缓存
     *
     * @type {Map<string, { originAttr: string, actualAttr: string, dep: string }>}
     * @memberof NodeStore
     */
    public attrMap: Map<string, { originAttr: string, actualAttr: string, dep: string }> = new Map();

    /**
     * dom 事件缓存
     *
     * @type {Map<string, { event: string, handler: Function }>}
     * @memberof NodeStore
     */
    public domEventMap: Map<string, { event: string, handler: Function }> = new Map();

    /**
     * watcher 事件缓存
     *
     * @type {Map<string, { event: string, handler: Function, temp?: any  }>}
     * @memberof NodeStore
     */
    public watcherEventMap: Map<string, { event: string, handler: Function, temp?: any }> = new Map();

}
