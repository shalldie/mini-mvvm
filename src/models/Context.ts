import MVVM from "../core/MVVM";
import * as _ from '../utils';


/**
 * 上下文对象，获取数据用。
 * 包含了 for循环上下文、computed、data
 *
 * @export
 * @class Context
 */
export default class Context {

    private vm: MVVM;

    /**
     * 当前作用域私有的
     */
    private map: Map<string, any> = new Map();

    constructor(vm: MVVM) {
        this.vm = vm;
    }

    /**
     * 添加数据到当前上下文
     *
     * @param {string} key
     * @param {*} value
     * @memberof Context
     */
    public set(key: string, value: any) {
        this.map.set(key, value);
    }

    /**
     * 从当前上下文获取数据
     *
     * @param {string} key
     * @returns
     * @memberof Context
     */
    public get(key: string) {
        const rootKey = key.split('.')[0];
        if (this.map.has(rootKey)) {
            const item = {
                [rootKey]: this.map.get(rootKey)
            };
            return _.getValueFromKey(item, key);
        }
        return _.getValueFromVM(this.vm, key);
    }

    /**
     * 添加一个对象到上下文
     *
     * @param {Object} data
     * @memberof Context
     */
    public extend(data: Object) {
        Object.keys(data).forEach(key => {
            this.set(key, data[key]);
        });
    }
}
