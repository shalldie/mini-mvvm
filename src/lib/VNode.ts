import MVVM from '../core/MVVM';
import Watcher from './Watcher';


export default class VNode {

    constructor(watcher: Watcher) {
        this.watcher = watcher;
        this.vm = watcher.vm;
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
     * 原始html，在重置节点的时候会用到
     *
     * @type {string}
     * @memberof Cache
     */
    public innerHTML: string = '';

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
