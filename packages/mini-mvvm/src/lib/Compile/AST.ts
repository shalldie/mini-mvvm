import { ENodeType } from "../../common/enums";
import { toArray } from "../../common/utils";
import parseAttrs from "./parsers/parseAttrs";
import parseFor from "./parsers/parseFor";
import parseEvents from "./parsers/parseEvents";
import parseModel from "./parsers/parseModel";
import parseProps from "./parsers/parseProps";
import parseIf from "./parsers/parseIf";

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
     * attributes map
     *
     * @type {Record<string, string>}
     * @memberof AST
     */
    attrs?: Record<string, string>;

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

    //#region events 事件

    events?: Record<string, string[]>;

    //#endregion

    //#region props

    props?: Record<string, string>;

    //#endregion

    //#region if

    if?: string;

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
        const attrsMap = toArray<Attr>(el.attributes).reduce((map, cur) => {
            map[cur.name] = cur.value;
            return map;
        }, {});
        const children = toArray<Element>(el.childNodes).map(parseElement2AST).filter(n => n);

        const ast: AST = {
            tag: el.tagName.toLowerCase(),
            type: ENodeType.Element,
            attrs: attrsMap,
            children
        };

        // 先处理 attributes
        parseAttrs(ast);

        // 处理 props
        parseProps(ast);

        // 处理 events
        parseEvents(ast);

        // 处理 model
        parseModel(ast);

        // m-for
        parseFor(ast);

        // m-if
        parseIf(ast);

        return ast;
    }

    // 其他节点不考虑
    return null;
}