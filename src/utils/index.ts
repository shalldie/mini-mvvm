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
 * 获取数据类型
 *
 * @export
 * @param {*} sender 要判断的数据
 * @returns {string}
 */
export function getType(sender: any): string {
    return Object.prototype.toString.call(sender).toLowerCase().match(/\s(\S+?)\]/)[1];
}

/**
 * 数据是否可观察
 *
 * @export
 * @param {*} data
 * @returns {boolean}
 */
export function observable(data: any): boolean {
    return !!~[
        'object'
    ].indexOf(getType(data));
}

/**
 * 根据 key 从 data 中获取值
 *
 * @example
 * ({ a: { b: { c: 'tom'}}},'a.b.c') => 'tom'
 *
 * @export
 * @param {Object} data
 * @param {string} key
 * @returns
 */
export function getValueFromKey(data: Object, key: string) {
    let keys = key.split('.');
    let result = data[keys.shift()];

    while (keys.length) {
        result = result[keys.shift()];
    }

    return result;
}
