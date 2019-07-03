/**
 * 声明初始化参数
 * 导出 MVVM 的基类，把 fields 和 static methods 拆出来
 */

import { h, VNode } from "mini-vdom";
import EventEmitter from "../common/EventEmitter";
import { nextTick } from "../common/utils";
import Watcher from "../lib/Watcher";

export interface IMvvmOptions {

    /**
     * 模板的选择器
     * el 用来从dom获取template，vm实例会挂载到这里
     *
     * @type {string}
     * @memberof IMvvmOptions
     */
    el?: string;

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

    /**
     * 当前组件的数据
     *
     * @memberof IMvvmOptions
     */
    data?: () => Object;

    /**
     * 计算属性
     *
     * @memberof IMvvmOptions
     */
    computed?: Record<string, () => any>;
}

export default abstract class BaseMVVM extends EventEmitter {

    /**
     * 当前 data
     *
     * @protected
     * @memberof BaseMVVM
     */
    protected _data = {};

    /**
     * 当前组件的 computed watchers
     *
     * @protected
     * @type {Record<string, Watcher>}
     * @memberof BaseMVVM
     */
    protected _computedWatchers: Record<string, Watcher> = {};

    /**
     * 当前的 component watcher
     *
     * @protected
     * @type {Watcher}
     * @memberof BaseMVVM
     */
    protected _watcher: Watcher;

    /**
     * 旧的 vnode，可能是dom或者vnode
     *
     * @protected
     * @type {*}
     * @memberof BaseMVVM
     */
    protected lastVnode: any;

    /**
     * 组件对应的 vnode
     *
     * @protected
     * @type {VNode}
     * @memberof BaseMVVM
     */
    protected vnode: VNode;

    /**
     * 初始化配置参数信息
     *
     * @type {IMvvmOptions}
     * @memberof BaseMVVM
     */
    public $options: IMvvmOptions;

    /**
     * 当前组件挂载的dom
     *
     * @type {HTMLElement}
     * @memberof BaseMVVM
     */
    public el: HTMLElement;

    public static nextTick = nextTick;

    public $nextTick = nextTick;

}
