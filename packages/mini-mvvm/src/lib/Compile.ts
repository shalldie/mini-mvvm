import { h, VNode } from "mini-vdom";
import { IMvvmOptions } from "../core/BaseMVVM";
import { ENodeType } from "../common/enums";
import { toArray } from "../common/utils";

/**
 * 用来表述模板结构
 *
 * @class AST
 */
class AST {

    tag: string;
    type: ENodeType;
    attrs?: Array<{ name: string, value: string }>;
    text?: string;
    children?: AST[];

    public static parseElement2AST(el: Element): AST {
        // 文本节点
        if (el.nodeType === ENodeType.Text) {
            return {
                tag: '',
                type: ENodeType.Text,
                text: el.textContent
            };
        }

        // element节点
        if (el.nodeType === ENodeType.Element) {
            const attrs = toArray<Attr>(el.attributes).map(n => ({ name: n.name, value: n.value }));
            const children = toArray<Element>(el.childNodes).map(AST.parseElement2AST).filter(n => n);

            return {
                tag: el.tagName.toLowerCase(),
                type: ENodeType.Element,
                attrs,
                children
            };
        }

        // 其他节点不考虑
        return null;
    }
}

/**
 * Compile ，用来编译模板
 *
 * @export
 * @class Compile
 */
export default class Compile {

    public static render(template: string) {
        return new Compile().render(template);
    }

    public render(template: string) {
        const wrap = document.createElement('div');
        wrap.innerHTML = template.trim();

        const node = wrap.children[0];
        const ast = AST.parseElement2AST(node);
        const renderStr = `
with(this) {
    return ${this.ast2Render(ast)};
}
        `;
        // console.log(renderStr);
        return new Function('h', renderStr);
    }

    private ast2Render(ast: AST): string {
        // console.log(ast.type);
        if (ast.type === ENodeType.Text) {
            return this.textAst2Render(ast);
        }
        if (ast.type === ENodeType.Element) {
            return this.eleAst2Render(ast);
        }
        // 理论上不会走到这里来，在生成ast的时候就过滤了
        return null;
    }

    private eleAst2Render(ast: AST): string {
        const attrs = JSON.stringify(ast.attrs.reduce((map, cur) => {
            map[cur.name] = cur.value;
            return map;
        }, {}));
        const children = ast.children.map(n => this.ast2Render(n)).filter(n => n).join(',');

        return `h('${ast.tag}', {
            attrs: ${attrs}
        }, [${children}])`;
    }

    private textAst2Render(ast: AST) {
        // console.log(ast);
        const content = `'` + ast.text
            .replace(      // 先把文本中的 换行/多个连续空格 替换掉
                /[\r\n\s]+/g,
                ' '
            )
            .replace(      // 再处理依赖 {{ field }}
                /\{\{(.*?)\}\}/g,
                `' + ($1) + '`
            ) + `'`;

        return `h('', ${content})`;
    }

}
