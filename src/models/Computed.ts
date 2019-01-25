import * as _ from '../utils';
import Watcher from "../lib/Watcher";

/**
 * 对 computed 的处理
 */
export default class Computed {

    /**
     * 第一次执行
     *
     * @private
     * @type {boolean}
     * @memberof Computed
     */
    private isFirst: boolean = true;

    private watcher: Watcher;

    /**
     * 缓存的值
     *
     * @type {*}
     * @memberof Computed
     */
    public data: Object = {};

    /**
     * 当前实例
     *
     * @static
     * @type {Computed}
     * @memberof Computed
     */
    public static target: Computed = null;


    /**
     * 所有的依赖项
     *
     * @type {Set<string>}
     * @memberof Computed
     */
    public deps: Set<string> = new Set<string>();

    /**
     * watcher 事件缓存
     *
     * @type {Map<string, { event: string, handler: Function, temp?: any }>}
     * @memberof NodeStore
     */
    public watcherEventMap: Map<string, { event: string, handler: Function, temp?: any }> = new Map();

    constructor(dict: Object, watcher: Watcher, invoker: Object) {

        _.each(dict || {}, (fn, fnName) => {
            const depKeys = _.serializeDependences(fn);

            const updateComputedHandler = () => {
                const oldVal = this.data[fnName];
                // 在依赖项更新的时候，先更新数据到 this.data
                const newVal = this.data[fnName] = fn.call(invoker);
                // 再触发 computed 更新
                if (oldVal !== newVal) {
                    console.log(`update computed:${fnName}:` + newVal);

                    if (this.isFirst) {
                        this.isFirst = false;
                        watcher.emit(fnName, newVal, oldVal);
                    }
                    else {
                        _.nextTick(() => {
                            // debugger;
                            watcher.updateKey(fnName);
                        });
                    }
                }
            };

            // 在某一项依赖更新的时候，同时触发当前 computed 更新
            depKeys.forEach(key => {
                watcher.on(key, updateComputedHandler);
                this.watcherEventMap.set(key, {
                    event: key,
                    handler: updateComputedHandler
                });
            });
            updateComputedHandler();
        });

    }

    public dispose() {
        this.deps.clear();
        for (let { event, handler } of this.watcherEventMap.values()) {
            this.watcher.off(event, handler);
        }
        this.watcherEventMap.clear();
    }




}

export class ComputedItem {

    private isFirst: boolean = true;

    public watcher: Watcher;

    public fn: Function;

    public fnName: string;

    public invoker: object;

    public static target: ComputedItem;

    public deps: Set<string> = new Set();

    public value: any;

    /**
     * watcher 事件缓存
     *
     * @type {Map<string, { event: string, handler: Function, temp?: any }>}
     * @memberof NodeStore
     */
    public watcherEventMap: Map<string, { event: string, handler: Function, temp?: any }> = new Map();

    constructor(fn: Function, fnName: string, invoker: object, watcher: Watcher) {
        this.fn = fn;
        this.fnName = fnName;
        this.invoker = invoker;
        this.watcher = watcher;
    }

    public dispose() {
        this.deps.clear();
        for (let { event, handler } of this.watcherEventMap.values()) {
            this.watcher.off(event, handler);
        }
        this.watcherEventMap.clear();
    }

    /**
     * 更新某一项的值和依赖
     *
     * @private
     * @memberof ComputedItem
     */
    private updateDepsAndValue() {
        this.deps.clear();
        ComputedItem.target = this;
        this.value = this.fn.call(this.invoker);
        ComputedItem.target = null;
    }

    private bindDepListeners() {
        this.dispose();

        const updateComputedHandler = () => {
            const oldVal = this.value;
            // 在依赖项更新的时候，先更新数据到 this.value
            this.updateDepsAndValue();
            // 再触发 computed 更新
            if (oldVal !== this.value) {
                console.log(`update computed:${this.fnName}:` + this.value);

                if (this.isFirst) {
                    this.isFirst = false;
                    this.watcher.emit(this.fnName, this.value, oldVal);
                }
                else {
                    _.nextTick(() => {
                        // debugger;
                        this.watcher.updateKey(this.fnName);
                    });
                }
            }
        };

        this.deps.forEach(key => {

        });
    }

}
