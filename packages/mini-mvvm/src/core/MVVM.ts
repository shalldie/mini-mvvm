import { VNode, patch, h } from "mini-vdom";
import BaseMVVM, { IMvvmOptions } from './BaseMVVM';
import Compile from "../lib/Compile";
import Observer, { proxy } from "../lib/Observer";
import Dep from "../lib/Dep";
import Watcher from "../lib/Watcher";
import { nextTick } from "../common/utils";

export default class MVVM extends BaseMVVM {

    constructor(options: IMvvmOptions = {}) {
        super();
        this.$options = options;

        this._init();
    }

    /**
     * 初始化
     *
     * @private
     * @memberof MVVM
     */
    private _init() {

        // 初始化数据
        this._initData();

        // 编译
        this._compile();

        // patch
        this._update();
    }

    /**
     * 把模板编译成 render 函数
     *
     * @private
     * @memberof MVVM
     */
    private _compile() {
        const { el, template } = this.$options;
        if (!this.$options.render && (template || el)) {
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
    private _initData() {
        if (this.$options.data) {
            this._data = this.$options.data.call(this);
            new Observer(this._data);
            proxy(this._data, this);
        }
    }

    private _initComputed() {

    }

    /**
     * 更新当前视图
     *
     * @memberof MVVM
     */
    public _update = (() => {
        let needUpdate = false;
        return () => {
            needUpdate = true;
            if (process.env.NODE_ENV !== 'production') {
                console.log('数据改变');
            }
            nextTick(() => {
                if (!needUpdate) {
                    return;
                }

                if (!this.$options.el) {
                    return;
                }
                if (process.env.NODE_ENV !== 'production') {
                    console.log('执行更新');
                }
                if (!this.el) {
                    this.el = document.querySelector(this.$options.el);
                }

                // nextTickQueue(() => {
                this.lastVnode = this.vnode || this.el;

                this._watcher && this._watcher.clear();
                Dep.target = this._watcher = new Watcher(this);
                this.vnode = this.$options.render.call(this, h);
                Dep.target = null;
                patch(
                    this.lastVnode,
                    this.vnode
                );
                needUpdate = false;
            });
        };
    })();

    /**
     * 挂载到 dom
     *
     * @param {string} selector
     * @returns
     * @memberof MVVM
     */
    public $mount(selector: string) {
        this.$options.el = selector;
        this._update();
        return this;
    }
}
