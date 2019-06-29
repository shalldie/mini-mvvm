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
     * 当前组件的 computed
     *
     * @protected
     * @memberof BaseMVVM
     */
    protected _computed = {};

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
