/**
 * attributes 模块
 * 用于处理 id、class、style、dataset、自定义属性等
 */

import VNode from "../VNode";
import { IModuleHook } from "../hooks";

/**
 * attribute 包装
 */

export interface IAttrs {
    [key: string]: string | number | boolean;
}

export function updateAttrs(oldVnode: VNode, vnode: VNode): void {
    let oldAttrs = oldVnode.data.attrs;
    let attrs = vnode.data.attrs;
    let elm = vnode.elm;

    // 两个vnode都不存在 attrs
    if (!oldAttrs && !attrs) return;
    // 两个 attrs 是相同的
    if (oldAttrs === attrs) return;

    oldAttrs = oldAttrs || {};
    attrs = attrs || {};

    // 更新 attrs
    for (let key in attrs) {
        let cur = attrs[key];
        let old = oldAttrs[key];
        // 相同就跳过
        if (cur === old) continue;
        // 不同就更新
        if (cur === true) {
            elm.setAttribute(key, '');
        }
        else if (cur === false) {
            elm.removeAttribute(key);
        }
        else {
            elm.setAttribute(key, cur + '');
        }
    }

    // 对于 oldAttrs 中有，而 attrs 没有的项，去掉
    for (let key in oldAttrs) {
        if (!(key in attrs)) {
            elm.removeAttribute(key);
        }
    }
}

export const attrsModule: IModuleHook = {
    create: updateAttrs,
    update: updateAttrs
};

export default attrsModule;
