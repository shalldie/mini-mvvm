import MVVM from "../core/MVVM";
import * as _ from '../utils';
import Watcher from "../lib/Watcher";

/**
 * 对 computed 的处理
 */
export default class Computed {

    private watcher: Watcher;

    /**
     * 缓存的值
     *
     * @type {*}
     * @memberof Computed
     */
    public data: Object = {};

    /**
     * watcher 事件缓存
     *
     * @type {Map<string, { event: string, handler: Function, temp?: any  }>}
     * @memberof NodeStore
     */
    public watcherEventMap: Map<string, { event: string, handler: Function, temp?: any }> = new Map();

    constructor(dict: Object, watcher: Watcher, invoker: Object) {

        _.each(dict, (fn, fnName) => {
            const depKeys = _.serializeDependences(fn);

            const updateComputedHandler = () => {
                const oldVal = this.data[fnName];
                // 在依赖项更新的时候，先更新数据到 this.data
                const newVal = this.data[fnName] = fn.call(invoker);
                // 再触发 computed 更新
                if (oldVal !== newVal) {
                    console.log(`update computed:${fnName}:` + newVal);
                    watcher.emit(fnName, newVal);
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

    dispose() {
        for (let { event, handler } of this.watcherEventMap.values()) {
            this.watcher.off(event, handler);
        }
        this.watcherEventMap.clear();
    }
}
