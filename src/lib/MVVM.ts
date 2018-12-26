import Observer from './Observer';
import * as _ from '../utils';

type MVVMOptions = {
    el: HTMLElement | string,
    data: () => Object,
    methods?: {
        [key: string]: () => any
    }
};


export default class MVVM {

    public $options: MVVMOptions;

    public $el: HTMLElement;

    public $data: Object;

    constructor(options: MVVMOptions) {
        this.$options = options;
        this.initialize();
    }

    private initialize(): void {
        this.$el = _.getType(this.$options.el) === 'string' ?
            document.querySelector(<string>this.$options.el) :
            <HTMLElement>this.$options.el;
        this.$data = this.$options.data();

        // 代理 data
        Object.keys(this.$data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: false,
                get: () => this.$data[key],
                set: newVal => this.$data[key] = newVal
            });
        });

        // 代理 methods
        Object.keys(this.$options.methods || {}).forEach(key => {
            this[key] = this.$options.methods[key].bind(this);
        });
    }

}
