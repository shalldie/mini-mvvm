import { ENodeType } from "../../common/enums";
import { toArray } from "../../common/utils";

/**
 * 抽象语法树，用来表述模板结构
 *
 * @export
 * @class AST
 */
export default class AST {

    //#region 基础字段

    /**
     * 标签 tag 类型
     *
     * @type {string}
     * @memberof AST
     */
    tag: string;

    /**
     * 标签 nodeType
     *
     * @type {ENodeType}
     * @memberof AST
     */
    type: ENodeType;

    /**
     * attributes
     *
     * @type {Array<{ name: string, value: string }>}
     * @memberof AST
     */
    attrs?: Array<{ name: string, value: string }>;

    /**
     * attributes map
     *
     * @type {Record<string, string>}
     * @memberof AST
     */
    attrsMap?: Record<string, string>;

    /**
     * textContent
     *
     * @type {string}
     * @memberof AST
     */
    text?: string;

    /**
     * 子节点
     *
     * @type {AST[]}
     * @memberof AST
     */
    children?: AST[];

    /**
     * 唯一标识 key
     *
     * @type {*}
     * @memberof AST
     */
    key?: any;

    //#endregion

    //#region m-for

    for?: string;

    forItem?: string;

    forIndex?: string;

    //#endregion

}

/**
 * 根据元素节点，转换成 ast 树
 *
 * @export
 * @param {Element} el
 * @returns {AST}
 */
export function parseElement2AST(el: Element): AST {
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
        const attrs = toArray<Attr>(el.attributes).map(n => ({ name: n.name, value: n.value.trim() }));
        const attrsMap = attrs.reduce((map, cur) => {
            map[cur.name] = cur.value;
            return map;
        }, {});
        const children = toArray<Element>(el.childNodes).map(parseElement2AST).filter(n => n);

        const ast: AST = {
            tag: el.tagName.toLowerCase(),
            type: ENodeType.Element,
            attrs,
            attrsMap,
            children
        };

        // 先处理 attributes
        parseAttrs(ast);

        // m-for
        parseFor(ast);

        return ast;
    }

    // 其他节点不考虑
    return null;
}

/**
 * 处理 ast 上的 m-for
 *
 * @param {AST} ast
 * @returns
 */
function parseFor(ast: AST) {

    const forKey = 'm-for';
    const forAttrIndex = ast.attrs.findIndex(item => item.name === forKey);
    if (!~forAttrIndex) {
        return;
    }
    const forAttr = ast.attrs[forAttrIndex];

    // 这个正则支持两种匹配
    // 1. (item,index) in list
    // 2. item in list
    const reg = /^(\(\s*(\S+?)\s*,\s*(\S+?)\s*\)|(\S+?))\s*in\s*(\S+)$/;
    const match = forAttr.value.match(reg);

    // for表达式有问题
    if (!match) {
        throw new Error(`${forAttr.name}="${forAttr.value}"`);
    }

    // 给ast添加for相关内容
    ast.for = match[5];
    ast.forItem = match[2] || match[4];
    ast.forIndex = match[3];

    // 删除原attr
    ast.attrs.splice(forAttrIndex, 1);
    delete ast.attrsMap[forKey];
}

/**
 * 处理 ast 上的 attributes，
 * :attr="value" 这种动态 attribute，会被处理成 attr:"((value))"
 * 在之后 compile 的时候去掉双引号
 *
 * @param {AST} ast
 * @returns
 */
function parseAttrs(ast: AST) {

    for (let i = 0; i < ast.attrs.length; i++) {
        const item = ast.attrs[i];
        const name = item.name;
        const val = item.value;
        // 如果是 :attr="value" 这种动态 attribute
        if (/^:/.test(name)) {
            const newName = name.slice(1);
            const newVal = `((${val}))`;
            item.name = newName;
            item.value = newVal;
            delete ast.attrsMap[name];
            ast.attrsMap[newName] = newVal;
        }
    }
}