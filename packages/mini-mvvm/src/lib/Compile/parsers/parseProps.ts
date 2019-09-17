import AST from '../AST';

/**
 * 可以用 prop 来表示的 attribue
 */
const PROP_KEYS = [
    'value', 'checked', 'disabled'
];

/**
 * 处理 props
 *
 * @export
 * @param {AST} ast
 */
export default function parseProps(ast: AST): void {
    ast.props = ast.props || {};

    for (const key in ast.attrs) {
        if (!~PROP_KEYS.indexOf(key)) {
            continue;
        }

        // 格式已经在 parseAttrs 里面处理过，这里转移一下就好
        ast.props[key] = ast.attrs[key];
        delete ast.attrs[key];
    }

}
