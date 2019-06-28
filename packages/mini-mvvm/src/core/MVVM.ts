import { VNode, patch, h } from "mini-vdom";
import BaseMVVM, { IMvvmOptions } from './BaseMVVM';
import compile from "../lib/compile";

export default class MVVM extends BaseMVVM {

    private lastVnode: any;

    private currentVnode: VNode;

    public $options: IMvvmOptions;

    public el: HTMLElement;

    constructor(options: IMvvmOptions) {
        super();
        this.$options = options;

        this.init();
    }

    /**
     * 初始化
     *
     * @private
     * @memberof MVVM
     */
    private init() {
        // 编译
        this.compile();

        // patch
        if (!this.$options.el) {
            return;
        }
        this.patch();
    }

    /**
     * 把模板编译成 render 函数
     *
     * @private
     * @memberof MVVM
     */
    private compile() {
        const { el, template } = this.$options;
        if (!this.$options.render) {
            this.$options.render = compile(
                template
                || document.querySelector(el).outerHTML
            ) as any;
        }

    }

    /**
     * 更新当前视图
     *
     * @private
     * @memberof MVVM
     */
    private patch() {
        if (!this.el) {
            this.el = document.querySelector(this.$options.el);
        }
        this.lastVnode = this.currentVnode || this.el;
        this.currentVnode = this.$options.render.call(this, h);
        patch(
            this.lastVnode,
            this.currentVnode
        );
    }

    /**
     * 挂载到 dom
     *
     * @param {string} selector
     * @returns
     * @memberof MVVM
     */
    public $mount(selector: string) {
        this.$options.el = selector;
        this.init();
        return this;
    }
}
