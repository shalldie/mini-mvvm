import EventEmitter from "./EventEmitter";
import * as _ from '../utils';

/**
 * 观察者类
 *
 * @export
 * @class Observer
 */
export default class Observer {

    // private data: Object;
    private ob: Observer;

    public emitter: EventEmitter = new EventEmitter();

    /**
     * Creates an instance of Observe.
     * @param {Object} data 需要观察的对象
     * @memberof Observe
     */
    constructor(data: Object) {
        // 监听data的所有属性
        let ob: Observer = data['__ob__'];

        if (ob && ob instanceof Observer) {
            this.ob = ob;
        }
        else {
            _.observe(data);
            // 把自身放到data上
            _.defineReactive(data, '__ob__', this, {
                enumerable: false
            });
        }

    }



}
