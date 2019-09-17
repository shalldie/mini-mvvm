import MVVM from '../core/MVVM';

/**
 * 工具库
 */

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
 * each
 *
 * @export
 * @param {Object} [data={}]
 * @param {(value: any, key: string) => void} fn
 */
export function each(data: Record<string, any> = {}, fn: (value: any, key: string) => void): void {
    for (const key in data) {
        fn(data[key], key);
    }
}

/**
 * 获取唯一 number key
 *
 * @export
 * @returns {number}
 */
// eslint-disable-next-line
export const nextIndex = (function () {
    let baseIndex = 0x5942b;
    return (): number => baseIndex++;
})();

/**
 * 转化成数组
 *
 * @export
 * @template T
 * @param {*} arrayLike
 * @returns {T[]}
 */
export function toArray<T>(arrayLike: any): T[] {
    return [].slice.call(arrayLike);
}

/**
 * 根据路径从 vm 中获取值
 *
 * @export
 * @param {MVVM} vm
 * @param {string} path
 * @returns
 */
export function getValByPath(vm: MVVM, path: string): any {
    const pathArr = path.split('.');
    let val: any = vm;
    for (const key of pathArr) {
        val = val[key];
    }
    return val;
}
