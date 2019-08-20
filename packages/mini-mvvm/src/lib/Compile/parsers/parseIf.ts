import AST from '../AST';

export default function parseIf(ast: AST): void {
    const ifKey = 'm-if';
    const ifValue = ast.attrs[ifKey];

    if (!ifValue) {
        return;
    }

    ast.if = ifValue;
    delete ast.attrs[ifKey];
}
