import MVVM from "../core/MVVM";

/**
 * 计算属性
 *
 * @export
 * @class ComputedItem
 */
export default class ComputedItem {

    constructor(vm: MVVM) {
        this.vm = vm;
    }

    public vm: MVVM;

    /**
     * 计算属性名
     *
     * @type {string}
     * @memberof ComputedItem
     */
    public name: string = '';

    /**
     * 依赖的keys
     *
     * @type {string[]}
     * @memberof ComputedItem
     */
    public deps: string[] = [];

}
