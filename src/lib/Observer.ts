import EventEmitter from "./EventEmitter";
import * as _ from '../utils';

/**
 * 观察者类
 *
 * @export
 * @class Observer
 */
export default class Observer {

    private keys: string[];

    private data: Object;

    public emitter: EventEmitter = new EventEmitter();

    /**
     * Creates an instance of Observer.
     * @param {Object} data 需要观察的对象
     * @param {string[]} [keys=[]] 从root对象到该对象的key的list
     * @memberof Observe
     */
    constructor(data: Object, keys: string[] = []) {

        this.data = data;
        this.keys = keys;

        if (_.observable(data)) {

            // 把当前实例挂在在 __ob__ 上
            Object.defineProperty(data, '__ob__', {
                enumerable: false,
                configurable: true,
                get: () => this
            });

            this.observe();
        }

    }

    private observe(): void {
        const data = this.data;

        Object.keys(data).forEach(key => {
            this.defineReactive(key);
            new Observer(data[key], [...this.keys, key]);
        });
    }

    private defineReactive(key: string): void {

        let val = this.data[key];

        Object.defineProperty(this.data, key, {
            enumerable: true,
            configurable: true,

            get() {
                return val;
            },

            set: newVal => {
                if (val === newVal) {
                    return;
                }

                console.log(`update:${val}=>${newVal}`);
                console.log(`update path: ${[...this.keys, key].join('.')}`)
                val = newVal;

                // set 的时候需要主动再次添加 observer
                new Observer(val, [...this.keys, key]);
            }
        });
    }



}
