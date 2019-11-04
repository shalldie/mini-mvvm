import AST from '../AST';

/**
 * 处理 ast 上的 m-for
 *
 * @export
 * @param {AST} ast
 * @returns
 */
export default function parseFor(ast: AST): void {

    const forKey = 'm-for';
    const forValue = ast.attrs[forKey];

    if (!forValue) {
        return;
    }

    // 这个正则支持两种匹配
    // 1. (item,index) in list
    // 2. item in list
    const reg = /^(\(\s*(\S+?)\s*,\s*(\S+?)\s*\)|(\S+?))\s+in\s+(.+)$/;
    const match = forValue.match(reg);

    // for表达式有问题
    if (!match) {
        throw new Error(`${forKey}表达式出错：${forKey}="${forValue}"`);
    }

    // 给ast添加for相关内容
    ast.for = match[5];
    ast.forItem = match[2] || match[4];
    ast.forIndex = match[3];

    // 删除原attr
    // ast.attrs.splice(forAttrIndex, 1);
    delete ast.attrs[forKey];
}
