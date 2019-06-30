import { VNode, patch, h } from "mini-vdom";
import BaseMVVM, { IMvvmOptions } from './BaseMVVM';
import Compile from "../lib/Compile";

export default class MVVM extends BaseMVVM {

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

        // 初始化数据
        this.initData();

        // 编译
        this.compile();

        // patch
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
            this.$options.render = Compile.render(
                template
                || document.querySelector(el).outerHTML
            ) as any;
        }
    }

    /**
     * 初始化 data
     *
     * @private
     * @memberof MVVM
     */
    private initData() {
        if (this.$options.data) {
            this._data = this.$options.data();
        }
    }

    /**
     * 更新当前视图
     *
     * @private
     * @memberof MVVM
     */
    private patch() {
        if (!this.$options.el) {
            return;
        }
        if (!this.el) {
            this.el = document.querySelector(this.$options.el);
        }
        this.lastVnode = this.vnode || this.el;
        this.vnode = this.$options.render.call(this, h);
        patch(
            this.lastVnode,
            this.vnode
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
        this.patch();
        return this;
    }
}
