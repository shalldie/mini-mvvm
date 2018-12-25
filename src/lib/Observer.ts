import EventEmitter from "./EventEmitter";

/**
 * 观察者类
 *
 * @export
 * @class Observer
 */
export default class Observer {

    // private data: Object;

    /**
     * Creates an instance of Observe.
     * @param {Object} data 需要观察的对象
     * @memberof Observe
     */
    constructor(data: Object) {
        // this.data = data;
        this.observeData(data);
    }

    /**
     * 观察某个对象所有属性
     *
     * @private
     * @param {Object} data 被观察的对象
     * @returns {void}
     * @memberof Observe
     */
    private observeData(data: Object): void {
        if (!data || typeof data !== 'object') {
            return;
        }

        Object.keys(data).forEach(key => {
            this.observeKey(data, key);
            this.observeData(data[key]);
        });
    }

    /**
     * 观察某对象的某个属性
     *
     * @private
     * @param {Object} data 被观察的对象
     * @param {string} key 需要监听的key
     * @returns {void}
     * @memberof Observe
     */
    private observeKey(data: Object, key: string): void {
        // 当前值
        let val = data[key];

        Object.defineProperty(data, key, {
            enumerable: true,    // 可枚举
            configurable: false, // 不能修改了

            get() {
                return val;
            },

            set(newVal) {
                val = newVal;
            }
        });
    }



}
