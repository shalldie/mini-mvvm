import { IMvvmOptions } from "../core/BaseMVVM";
import { ENodeType } from "../common/enums";
import { h, VNode } from "mini-vdom";

export default function compile(options: IMvvmOptions) {
    let { el, template, render } = options;

    // template 跟 render 必须有一个

    if (render) {
        return;
    }

    if (!template) {
        template = document.querySelector(el).outerHTML.trim();
    }
}


function compileTplToRender(template: string) {
    const wrap = document.createElement('div');
    wrap.innerHTML = template.trim();

    const node = wrap.children[0];
}

function parseNode(el: Element) {

    // const sel = el.tagName.toLowerCase();
    // let sel = '';
    let vnode: VNode;

    if (el.nodeType === ENodeType.Element) {
        // sel = el.tagName.toLowerCase();
        vnode = h(el.tagName.toLowerCase());
        const children: Element[] = [].slice.call(el.children);
        vnode.children = children.map(n => parseNode(n)).filter(n => !!n);
    }
    else if (el.nodeType === ENodeType.Text) {
        vnode = h('', el.textContent);
    }

    return vnode;

}
