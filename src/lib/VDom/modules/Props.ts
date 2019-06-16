import VNode from "../VNode";
import { IModuleHook } from "../hooks";

/**
 * attribute 包装
 */

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
}

export const propsModule: IModuleHook = {
    create: updateProp,
    update: updateProp
};

export default propsModule;