import Observer from '../lib/Observer';
import * as _ from '../utils';
import BaseMVVM from './BaseMVVM';
import Watcher from '../lib/Watcher';
import Compiler from '../lib/Compiler';
import Computed from '../models/Computed';

type MVVMOptions = {
    el: HTMLElement | string,
    data: () => Object,
    computed?: {
        [key: string]: () => any
    },
    methods?: {
        [key: string]: (...args: any) => any
    },
    created?: () => void,
    watch?: Object
};


export default class MVVM extends BaseMVVM {

    public $options: MVVMOptions;

    public $el: HTMLElement;

    public $data: Object;

    public $computed: Computed;

    public $watcher: Watcher = new Watcher(this);

    public $compiler: Compiler;

    public created: Function = () => { };

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
        _.each(this.$data, (val, key) => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: false,
                get: () => this.$data[key],
                set: newVal => this.$data[key] = newVal
            });
        });

        // 代理 computed
        this.$computed = new Computed(this.$options.computed, this.$watcher, this);

        _.each(this.$options.computed, (val, key) => {
            // 从this上直接拿到computed
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: false,
                get: () => this.$computed.data[key]
            });
        });

        // 代理 methods
        _.each(this.$options.methods, (val, key) => {
            this[key] = this.$options.methods[key].bind(this);
        });

        // 观察 $data
        new Observer(this.$data, this.$watcher);

        // watch
        _.each(this.$options.watch, (func: Function, key: string) => {
            this.$watcher.on(key, func.bind(this));
        });

        // 编译模板
        this.$compiler = new Compiler(this.$el, this, this.$watcher);


        if (_.getType(this.$options.created) === 'function') {
            this.created = this.$options.created;
        }
        this.created();

    }
}
