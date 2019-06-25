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
export function type(sender: any): string {
    return Object.prototype.toString.call(sender).toLowerCase().match(/\s(\S+?)\]/)[1];
}

/**
 * each
 *
 * @export
 * @param {Object} [data={}]
 * @param {(value: any, key: string) => void} fn
 */
export function each(data: Object = {}, fn: (value: any, key: string) => void) {
    for (let key in data) {
        fn(data[key], key);
    }
};

/**
 * 获取唯一 number key
 *
 * @export
 * @returns {number}
 */
export const nextIndex = (function () {
    let baseIndex = 0x5942b;
    return () => baseIndex++;
})();
