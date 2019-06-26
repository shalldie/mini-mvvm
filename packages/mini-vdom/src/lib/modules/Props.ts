/**
 * props 包装
 * 用于处理节点自身属性，跟attrs有些重合，主要处理难以用 attr 来表示的属性
 *
 * @example
 * input.checked .disabled
 */

import VNode from "../VNode";
import { IModuleHook } from "../hooks";

export interface IProps {
    [key: string]: any;
}

export function updateProp(oldVnode: VNode, vnode: VNode): void {
    let oldProps = oldVnode.data.props;
    let props = vnode.data.props;
    let elm = vnode.elm;

    // 两个vnode都不存在props
    if (!oldProps && !props) return;
    // 两个props是相同的
    if (oldProps === props) return;

    oldProps = oldProps || {};
    props = props || {};

    // 如果old有，cur没有
    for (let key in oldProps) {
        if (!props[key]) {
            delete elm[key];
        }
    }

    // 检查更新
    for (let key in props) {
        if (props[key] !== oldProps[key]) {
            elm[key] = props[key];
        }
    }
}

export const propsModule: IModuleHook = {
    create: updateProp,
    update: updateProp
};

export default propsModule;
