import Observer from '../lib/Observer';
import * as _ from '../utils';
import BaseMVVM from './BaseMVVM';
import Watcher from '../lib/Watcher';
import Compiler from '../lib/Compiler';
// import

type MVVMOptions = {
    el: HTMLElement | string,
    data: () => Object,
    methods?: {
        [key: string]: () => any
    }
};


export default class MVVM extends BaseMVVM {

    public $options: MVVMOptions;

    public $el: HTMLElement;

    public $data: Object;

    private $watcher: Watcher = new Watcher(this);

    private $compiler: Compiler;

    constructor(options: MVVMOptions) {
        super();
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

        // 观察 $data
        new Observer(this.$data, this.$watcher);

        // 编译模板
        this.$compiler = new Compiler(this.$el, this, this.$watcher);

        // Compile.compileNode(this.$el, this.$watcher);
    }

}
