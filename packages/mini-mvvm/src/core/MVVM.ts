import { VNode, patch, h } from "mini-vdom";
import BaseMVVM, { IMvvmOptions } from './BaseMVVM';

export default class MVVM extends BaseMVVM {

    public $options: IMvvmOptions;

    constructor(options: IMvvmOptions) {
        super();
        this.$options = options;

        // 处理参数
        const { el, template, render } = options;
        if (!template && !render) {
            options.template = document.querySelector(el).outerHTML;
        }

        this.init();
    }

    private init() {
        patch(
            document.querySelector(this.$options.el),
            this.$options.render.call(this, h)
        );
    }
}
