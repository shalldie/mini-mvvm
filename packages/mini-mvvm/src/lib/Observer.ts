import { getType } from '../common/utils';
import Dep from './Dep';

/**
 * 需要重写的方法，用于观察数组
 */
const hookArrayMethods: string[] = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

/**
 * 把 source 上的所有key，代理到 target 上
 *
 * @export
 * @param {Record<string, any>} source 要代理到数据源
 * @param {Record<string, any>} target 代理的目标对象
 */
export function proxy(source: Record<string, any>, target: Record<string, any>): void;

/**
 * 对 Object.defineProperty 的简单封装
 *
 * @export
 * @param {Record<string, any>} data 要观察的数据
 * @param {string} key 要观察的key
 * @param {PropertyDescriptor} descriptor
 */
export function proxy(data: Record<string, any>, key: string, descriptor: PropertyDescriptor): void;

export function proxy(
    data: Record<string, any>,
    targetOrkey: Record<string, any> | string,
    descriptor?: PropertyDescriptor
): void {
    if (getType(targetOrkey) === 'object') {
        for (const key in data) {
            proxy(targetOrkey as Record<string, any>, key, {
                get: () => data[key],
                set: newVal => (data[key] = newVal)
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
    private data: Record<string, any>;

    constructor(data: Record<string, any> | any[]) {
        const dataType = getType(data);
        if (!~['object', 'array'].indexOf(dataType)) {
            return;
        }
        this.data = dataType === 'array' ? { a: data } : data;
        this.observe();
    }

    private observe(): void {
        Object.keys(this.data).forEach(key => {
            // 监听这个属性的变更
            this.defineReactive(key);

            // 递归
            getType(this.data[key]) === 'object' && new Observer(this.data[key]);
        });
    }

    private defineReactive(key: string): void {
        const dep = new Dep();
        dep.key = key;
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

        // 虽然这个没啥用，但是先放上去 😂
        proxy(this.data, '__ob__', { enumerable: false, value: this });

        // 如果是数组，还需要监听变异方法
        this.appendArrayHooks(key);
    }

    private appendArrayHooks(key: string): void {
        const item = this.data[key];
        if (getType(item) !== 'array') {
            return;
        }

        // 给数组的一些方法添加hook
        for (const method of hookArrayMethods) {
            proxy(item, method, {
                enumerable: false,
                get: () => {
                    // eslint-disable-next-line
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

        // 给数组中的每一项添加hook
        for (const child of item) {
            new Observer(child);
        }
    }
}
