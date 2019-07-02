import { getType } from '../common/utils';
import Dep from './Dep';

/**
 * 需要重写的方法，用于观察数组
 */
const hookArrayMethods: string[] = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];

/**
 * 把 source 上的所有key，代理到 target 上
 *
 * @export
 * @param {Object} source 要代理到数据源
 * @param {Object} target 代理的目标对象
 */
export function proxy(source: Object, target: Object): void;

/**
 * 对 Object.defineProperty 的简单封装
 *
 * @export
 * @param {Object} data 要观察的数据
 * @param {string} key 要观察的key
 * @param {PropertyDescriptor} descriptor
 */
export function proxy(data: Object, key: string, descriptor: PropertyDescriptor): void;

export function proxy(data: Object, targetOrkey: Object | string, descriptor?: PropertyDescriptor) {

    if (getType(targetOrkey) === 'object') {
        for (let key in data) {
            proxy(targetOrkey as Object, key, {
                get: () => data[key],
                set: newVal => data[key] = newVal
            });
        }
        return;
    }

    Object.defineProperty(data, targetOrkey as string, {
        enumerable: true,
        configurable: true,
        ...descriptor
    });
}

export default class Observer {

    private data: Object;

    constructor(data: Object) {
        this.data = data;
        this.observe();
    }

    private observe() {
        Object.keys(this.data).forEach(key => {
            // 监听这个属性的变更
            this.defineReactive(key);

            // 递归
            getType(this.data[key]) === 'object' && new Observer(this.data[key]);

        });
    }

    private defineReactive(key: string): void {

        const dep = new Dep();
        let val = this.data[key];

        // 监听赋值操作
        proxy(this.data, key, {
            get: () => {
                dep.depend();
                return val;
            },

            set: newVal => {
                if (val === newVal) {
                    return;
                }

                val = newVal;

                // 如果是数组，还需要监听变异方法
                this.appendArrayHooks(key);

                // set 的时候需要主动再次添加 observer
                getType(val) === 'object' && new Observer(val);

                dep.notify();
            }
        });

        // 虽然不知道这个没啥用，但是先放上去 😂
        proxy(this.data, '__ob__', { enumerable: false, value: this });

        // 如果是数组，还需要监听变异方法
        this.appendArrayHooks(key);
    }

    private appendArrayHooks(key: string) {
        const item = this.data[key];
        if (getType(item) !== 'array') {
            return;
        }

        for (let method of hookArrayMethods) {
            proxy(item, method, {
                enumerable: false,
                get: () => {
                    return (...args: any[]) => {
                        // 得到结果，缓存下来在最后返回
                        const list = this.data[key].slice();
                        const result = list[method](...args);

                        // 把新数组赋值给当前key，触发 watcher 的 update，以及再次 hook
                        this.data[key] = list;

                        return result;
                    };
                }
            });
        }
    }

}
