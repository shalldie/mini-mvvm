import { h, VNode } from "mini-vdom";
import { IMvvmOptions } from "../core/BaseMVVM";
import { ENodeType } from "../common/enums";
import { toArray } from "../common/utils";

/**
 * 用来存储模板结构
 *
 * @interface IAST
 */
interface IAST {
    tag: string;
    type: ENodeType;
    attrs?: Array<{ name: string, value: string }>;
    text?: string;
    children?: IAST[];
}

function parseElement2AST(el: Element): IAST {
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
        const children = toArray<Element>(el.childNodes).map(parseElement2AST).filter(n => n);

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

/**
 * 把字符串编译成render函数
 *
 * @export
 * @param {string} template
 * @returns {Function}
 */
export default function compile(template: string): Function {
    const wrap = document.createElement('div');
    wrap.innerHTML = template.trim();

    const node = wrap.children[0];
    const ast = parseElement2AST(node);
    const renderStr = `
with(this) {
    return ${ast2Render(ast)};
}
    `;
    console.log(renderStr);
    return new Function('h', renderStr);
}

function ast2Render(ast: IAST): string {
    // console.log(ast.type);
    if (ast.type === ENodeType.Text) {
        return textAst2Render(ast);
    }
    if (ast.type === ENodeType.Element) {
        return eleAst2Render(ast);
    }
    // 理论上不会走到这里来，在生成ast的时候就过滤了
    return null;
}

function eleAst2Render(ast: IAST): string {
    const attrs = JSON.stringify(ast.attrs.reduce((map, cur) => {
        map[cur.name] = cur.value;
        return map;
    }, {}));
    const children = ast.children.map(ast2Render).filter(n => n).join(',');

    return `h('${ast.tag}', {
        attrs: ${attrs}
    }, [${children}])`;
}

function textAst2Render(ast: IAST) {
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
