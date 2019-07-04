import { VNode, patch, h } from "mini-vdom";
import BaseMVVM, { IMvvmOptions } from './BaseMVVM';
import Compile from "../lib/Compile";
import Observer, { proxy } from "../lib/Observer";
import Dep from "../lib/Dep";
import Watcher, { defineComputed, defineWatch } from "../lib/Watcher";
import { nextTick } from "../common/utils";
import ELifeCycle, { defineLifeCycle } from "../lib/ELifeCycle";

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

        // 注册生命周期钩子
        defineLifeCycle(this);

        // 初始化methods，这个要放前面，因为其他地方在初始化的是可能会用到
        this._initMethods();

        // 初始化数据
        this._initData();

        // 初始化computed
        this._initComputed();

        // 初始化watch
        this._initWatch();

        // 准备完毕就调用 created
        this.$emit(ELifeCycle.created);

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

    /**
     * 初始化 computed
     *
     * @private
     * @memberof MVVM
     */
    private _initComputed() {
        this._computedWatchers = defineComputed(this, this.$options.computed);
    }

    /**
     * 初始化 methods
     *
     * @private
     * @memberof MVVM
     */
    private _initMethods() {
        Object.keys(this.$options.methods || {}).forEach(key => {
            this[key] = this.$options.methods[key].bind(this);
        });
    }

    /**
     * 初始化 watch
     *
     * @private
     * @memberof MVVM
     */
    private _initWatch() {
        defineWatch(this, this.$options.watch);
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
                let firstPatch = false;
                if (!this.el) {
                    this.el = document.querySelector(this.$options.el);
                    firstPatch = true;
                }

                // nextTickQueue(() => {
                this.lastVnode = this.vnode || this.el;

                this._watcher && this._watcher.clear();
                Dep.target = this._watcher = new Watcher(this);
                this.vnode = this.$options.render.call(this, h);
                Dep.target = null;

                // 如果是初次patch，即用 vnode 替换 dom
                // 触发 beforeMount
                if (firstPatch) {
                    this.$emit(ELifeCycle.beforeMount);
                }
                else {
                    this.$emit(ELifeCycle.beforeUpdate);
                }

                patch(
                    this.lastVnode,
                    this.vnode
                );

                this.el = this.vnode.elm as HTMLElement;

                needUpdate = false;

                // 如果是初次patch，即用 vnode 替换 dom
                // 触发 mounted
                if (firstPatch) {
                    this.$emit(ELifeCycle.mounted);
                }
                else {
                    this.$emit(ELifeCycle.updated);
                }
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
