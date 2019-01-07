import VNode from './VNode';
import MVVM from '../core/MVVM';
import Watcher from '../lib/Watcher';
import Context from './Context';
import * as _ from '../utils';

/**
 * dom 节点相关信息
 *
 * @export
 * @class NodeStore
 */
export default class NodeStore {

    public uuid: number = _.getUUID();

    public vnode: VNode;

    constructor(vnode: VNode, vm: MVVM, watcher: Watcher) {
        this.vnode = vnode;
        this.vm = vm;
        this.watcher = watcher;
        this.context = new Context(vm);
    }

    /**
     * 获取数据的上下文
     *
     * @type {Context}
     * @memberof NodeStore
     */
    public context: Context;

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
