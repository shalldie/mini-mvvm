import * as _ from '../utils';
import Watcher from "../lib/Watcher";

/**
 * 对 computed 的处理
 */
export default class Computed {

    /**
     * 缓存的值
     *
     * @type {*}
     * @memberof Computed
     */
    public data: Object = {};

    public computedItems: ComputedItem[] = [];

    constructor(dict: Object, watcher: Watcher, invoker: Object) {

        _.each(dict || {}, (fn, fnName) => {
            // debugger;
            const computedItem = new ComputedItem(fn, fnName, invoker, watcher);
            Object.defineProperty(this.data, fnName, {
                enumerable: true,
                configurable: true,
                get: () => computedItem.value
            });
            this.computedItems.push(computedItem);
        });

    }
}

export class ComputedItem {

    public watcher: Watcher;

    public fn: Function;

    public fnName: string;

    public invoker: object;

    public static target: ComputedItem = null;

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

        this.updateDepsAndValue();
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
        this.dispose();
        ComputedItem.target = this;
        this.value = this.fn.call(this.invoker);
        ComputedItem.target = null;
        this.bindDepListeners();
    }

    /**
     * 监听所有依赖项
     *
     * @private
     * @memberof ComputedItem
     */
    private bindDepListeners() {

        const updateComputedHandler = () => {
            const oldVal = this.value;
            // 在依赖项更新的时候，先更新数据到 this.value
            this.updateDepsAndValue();
            // 再触发 computed 更新
            if (oldVal !== this.value) {
                console.log(`update computed:${this.fnName}:` + this.value);

                _.nextTick(() => {
                    // debugger;
                    this.watcher.updateKey(this.fnName);
                });
            }
        };

        this.deps.forEach(key => {
            this.watcher.on(key, updateComputedHandler);
            this.watcherEventMap.set(key, {
                event: key,
                handler: updateComputedHandler
            });
        });
        // updateComputedHandler();
    }

}
