/**
 * events 模块
 * 处理绑定的所有事件
 */

import { IModuleHook } from "../hooks";
import VNode from "../VNode";

export type IListener = {
    [key in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[key]) => void;
} & {
    [key: string]: EventListener
};

function updateEventListener(oldVnode: VNode, vnode: VNode) {
    // 旧的监听、元素
    const oldOn = oldVnode.data.on;
    const oldElm = oldVnode.elm;

    // 新的监听、元素
    const on = vnode.data.on;
    const elm = vnode.elm;

    // 监听器没有改变，在 vnode 也没变的情况下会出现
    if (oldOn === on) {
        return;
    }

    // 改变之后，就直接把旧的监听全部删掉
    if (oldOn) {
        for (let event in oldOn) {
            oldElm.removeEventListener(event, oldOn[event]);
        }
    }

    if (on) {
        for (let event in on) {
            elm.addEventListener(event, on[event]);
        }
    }
}

export const EventModule: IModuleHook = {
    create: updateEventListener,
    update: updateEventListener,
    destroy: updateEventListener
};

export default EventModule;
