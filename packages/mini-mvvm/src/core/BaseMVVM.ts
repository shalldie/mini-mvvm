import { h, VNode } from "mini-vdom";
import EventEmitter from "../common/EventEmitter";
import { nextTick } from "../common/utils";

export interface IMvvmOptions {

    /**
     * 模板的选择器
     * el 用来从dom获取template，vm实例会挂载到这里
     *
     * @type {string}
     * @memberof IMvvmOptions
     */
    el: string;

    /**
     * 模板
     * 模板字符串，用来生成render函数
     *
     * @type {string}
     * @memberof IMvvmOptions
     */
    template?: string;

    /**
     * render 函数
     * 用来生成 vnode
     *
     * @memberof IMvvmOptions
     */
    render?: (createElement: typeof h) => void;
}

export default abstract class MVVM extends EventEmitter {

    public static nextTick = nextTick;

    public $nextTick = nextTick;

    public vnode: VNode;

}
