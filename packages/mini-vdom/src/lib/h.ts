/**
 * 用于生成 vnode 的工厂函数
 */

import VNode, { IVNodeData } from "./VNode";
import { getType, getMatchList } from '../utils';


/**
 * 生成 VNode
 *
 * @export
 * @param {string} type 标签(选择器)类型 'div#id.class[attr=val]' - 普通标签 '' - TextNode '!' - 注释节点
 * @param {string} [text] TextContent
 * @returns {VNode}
 */
export default function h(type: string, text?: string): VNode;

/**
 * 生成 VNode
 *
 * @export
 * @param {string} type 标签(选择器)类型 'div#id.class[attr=val]' - 普通标签 '' - TextNode '!' - 注释节点
 * @param {VNode[]} [children] 子 VNode 数组
 * @returns {VNode}
 */
export default function h(type: string, children?: VNode[]): VNode;

/**
 * 生成 VNode
 *
 * @export
 * @param {string} type 标签(选择器)类型 'div#id.class[attr=val]' - 普通标签 '' - TextNode '!' - 注释节点
 * @param {IVNodeData} [data] vnode 需要包含的数据
 * @param {string} [text] TextContent
 * @returns {VNode}
 */
export default function h(type: string, data?: IVNodeData, text?: string): VNode;

/**
 * 生成 VNode
 *
 * @export
 * @param {string} type 标签(选择器)类型 'div#id.class[attr=val]' - 普通标签 '' - TextNode '!' - 注释节点
 * @param {IVNodeData} [data] vnode 需要包含的数据
 * @param {VNode[]} [children] 子 VNode 数组
 * @returns {VNode}
 */
export default function h(type: string, data?: IVNodeData, children?: VNode[]): VNode;

export default function h(type: string, b?: any, c?: any): VNode {
    let data: IVNodeData;
    let text: string;
    let children: VNode[];

    // 处理各个参数类型，用于重载
    const bType = getType(b);
    const cType = getType(c);

    if (bType === 'object') {
        data = b;
        if (cType === 'array') {
            children = c;
        }
        else if (cType === 'string') {
            text = c;
        }
    }
    else if (bType === 'array') {
        children = b;
    }
    else if (bType === 'string') {
        text = b;
    }

    // 针对 h('div','content') 的简写形式
    if (type && text != null) {
        children = [h('', text)];
        text = undefined;
    }

    // 对于 div#id.class[attr='xxx'] 的形式
    if (type.length) {

        data = data || {};

        // 1. 处理 id
        let m = type.match(/#([^#\.\[\]]+)/);
        if (m) {
            data.props = data.props || {};
            data.props.id = m[1];
        }

        // 2. 处理 class
        const classList = getMatchList(type, /\.([^#\.\[\]]+)/g).map(n => n[1]);
        if (classList.length) {
            data.attrs = data.attrs || {};
            if (data.attrs['class']) {
                classList.push(
                    ...(data.attrs['class'] as string)
                        .split(' ')
                        .filter(n => n && n.length)
                );
            }
            data.attrs.class = classList.join(' ');
        }


        // 3. 处理 attrs
        const attrsList = getMatchList(type, /\[(\S+?)=(\S+?)\]/g);

        if (attrsList.length) {
            data.attrs = data.attrs || {};
            attrsList.forEach(match => {
                data.attrs[match[1]] = match[2];
            });
        }

        type = type.replace(/(#|\.|\[)\S*/g, '').toLowerCase();

    }

    return new VNode(type, data, children, text);
}
