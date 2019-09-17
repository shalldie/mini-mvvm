import AST from '../AST';

/**
 * 处理 m-model
 *
 * @export
 * @param {AST} ast
 * @returns
 */
export default function parseModel(ast: AST): void {

    const modelKey = 'm-model';
    const modelValue = ast.attrs[modelKey];

    if (!modelValue) {
        return;
    }

    // 添加input事件
    ast.events['input'] = ast.events['input'] || [];
    ast.events['input'].push(`${modelValue}=$event.target.value`);

    // 添加到 props
    ast.props['value'] = `((${modelValue}))`;

    // 从 attr 里面删除 m-model
    delete ast.attrs[modelKey];
}
