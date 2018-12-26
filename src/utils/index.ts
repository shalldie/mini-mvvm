import EventEmitter from '../lib/EventEmitter';


/**
 * microTask 要做的事情
 *
 * @export
 * @param {() => void} fn callback
 */
export function nextTick(fn: () => void): void {
    Promise.resolve().then(fn);
}


/**
 * 观察某个对象所有属性
 *
 * @export
 * @param {Object} data 要观察的对象
 * @returns {void}
 */
export function observe(data: Object): void {
    if (!data || typeof data !== 'object') {
        return;
    }

    Object.keys(data).forEach(key => {
        // 监听当前的属性
        defineReactive(data, key, data[key], {
            enumerable: true,
            configurable: false
        });
        // 监听该属性对应的对象
        observe(data[key]);
    });
}

/**
 * 观察某对象的某个属性
 *
 * @export
 * @param {Object} data 被观察的对象
 * @param {string} key 需要监听的key
 * @param {*} val
 * @param {*} [{ enumerable = true, configurable = true }={}] options
 * @returns {void}
 */
export function defineReactive(
    data: Object,
    key: string,
    val: any,
    { enumerable = true, configurable = true }: any = {}
): void {

    // emitter
    const emitter = new EventEmitter();

    Object.defineProperty(data, key, {
        enumerable,    // 可枚举
        configurable, // 可以修改

        get() {
            return val;
        },

        set: newVal => {
            val = newVal;
            observe(val);  // 在赋值的时候再去监听新数据

            emitter.emit('update', val);  // 触发更新
        }
    });
}
