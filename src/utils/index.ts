import MVVM from '../core/MVVM';

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

/**
 * 根据key，从vm上获取数据
 *
 * @export
 * @param {MVVM} vm
 * @param {string} key
 * @returns
 */
export function getValueFromVM(vm: MVVM, key: string): any {
    return getValueFromKey(vm.$data, key);
}

/**
 * 根据key设置vm的值
 *
 * @export
 * @param {MVVM} vm
 * @param {string} key
 * @param {*} value
 */
export function setValueOfVM(vm: MVVM, key: string, value: any) {
    let keys = key.split('.');
    let target = vm;

    while (keys.length > 1) {
        target = target[keys.shift()];
    }

    target[keys.shift()] = value;
}

export function serializeDependences(fn: Function): string[] {
    const content = fn.toString();
    const reg = /this\.([a-zA-Z\d\.]+)/g;

    const deps: string[] = [];

    let match: RegExpExecArray;
    while (match = reg.exec(content)) {
        deps.push(match[1]);
    }

    return deps;
}
