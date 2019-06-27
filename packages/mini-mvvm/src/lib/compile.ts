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

function parseElementToAST(el: Element): IAST {
    // 文本节点
    if (el.nodeType === ENodeType.Text) {
        return {
            tag: '', type: ENodeType.Text
        };
    }

    // element节点
    if (el.nodeType === ENodeType.Element) {
        const attrs = toArray<Attr>(el.attributes).map(n => ({ name: n.name, value: n.value }));
        const children = toArray<Element>(el.children).map(parseElementToAST).filter(n => n);

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

export default function compile(options: IMvvmOptions) {
    let { el, template, render } = options;

    // template 跟 render 必须有一个

    if (render) {
        return;
    }

    if (!template) {
        template = document.querySelector(el).outerHTML.trim();
        options.render = new Function('h', compileTplToRender(template)) as any;
    }
}


function compileTplToRender(template: string) {
    const wrap = document.createElement('div');
    wrap.innerHTML = template.trim();

    const node = wrap.children[0];
    const ast = parseElementToAST(node);
    return astToRender(ast);
}

function astToRender(ast: IAST) {
    if (ast.type === ENodeType.Text) {
        return textAstToRender(ast);
    }
    if (ast.type === ENodeType.Element) {
        return eleAstToRender(ast);
    }
    // 理论上不会走到这里来，在生成ast的时候就过滤了
    return null;
}

function eleAstToRender(ast: IAST) {
    const attrs = JSON.stringify(ast.attrs.reduce((map, cur) => {
        map[cur.name] = cur.value;
        return map;
    }, {}));
    const children = ast.children.map(astToRender).filter(n => n).join(',');

    return `h('div', {
        attrs: ${attrs}
    }, [${children}])`;
}

function textAstToRender(ast: IAST) {
    const content = `'` + ast.text.replace(
        /\{\{(.*?)\}\}/g,
        `' + ($1) + '`
    ) + `'`;

    return `h('', ${content})`;
}
