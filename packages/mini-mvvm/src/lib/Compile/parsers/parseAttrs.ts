import AST from '../AST';

/**
 * 处理 ast 上的 attributes，
 * :attr="value" 这种动态 attribute，会被处理成 attr:"((value))"
 * 在之后 compile 的时候去掉双引号
 *
 * @export
 * @param {AST} ast
 * @returns
 */
export default function parseAttrs(ast: AST): void {
    // 要添加的属性，在 for in 之后再添加
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in#%E6%8F%8F%E8%BF%B0
    const dynamicAttrs: Record<string, string> = {};

    for (const name in ast.attrs) {
        const val = ast.attrs[name];

        // 处理 key
        if (/^:?key$/.test(name)) {
            ast.key = name[0] === ':' ? val : `'${val}'`;
            delete ast.attrs[name];
            continue;
        }

        // 如果是 :attr="value" 这种动态 attribute
        if (/^:/.test(name)) {
            const newName = name.slice(1);
            const newVal = `((${val}))`;
            delete ast.attrs[name];
            dynamicAttrs[newName] = newVal;
        }
    }

    Object.assign(ast.attrs, dynamicAttrs);
}
