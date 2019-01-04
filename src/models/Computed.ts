import MVVM from "../core/MVVM";
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

    constructor(dict: Object, watcher: Watcher, vm: MVVM) {

        _.each(dict, (fn, fnName) => {
            const depKeys = _.serializeDependences(fn);

            const updateComputedHandler = () => {
                const oldVal = this.data[fnName];
                // 在依赖项更新的时候，先更新数据到 this.data
                const newVal = this.data[fnName] = fn.call(vm);
                // 再触发 computed 更新
                if (oldVal !== newVal) {
                    console.log(`update computed:${fnName}:` + newVal);
                    watcher.emit(fnName, newVal);
                }
            };

            // 在某一项依赖更新的时候，同时触发当前 computed 更新
            watcher.on(depKeys, updateComputedHandler);
            updateComputedHandler();
        });

    }
}
