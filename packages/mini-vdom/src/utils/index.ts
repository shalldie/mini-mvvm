/**
 * 工具库
 */

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
 * 获取每个匹配项以及子组，返回的是一个二维数组
 *
 * @export
 * @param {string} content
 * @param {RegExp} reg
 * @returns {string[][]}
 */
export function getMatchList(content: string, reg: RegExp): string[][] {
    let m: RegExpExecArray;
    const list: string[][] = [];
    while ((m = reg.exec(content))) {
        list.push([].slice.call(m));
    }
    return list;
}
