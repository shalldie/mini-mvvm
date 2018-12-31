import Observer from '../lib/Observer';
import * as _ from '../utils';
import BaseMVVM from './BaseMVVM';
import Watcher from '../lib/Watcher';
import Compiler from '../lib/Compiler';
// import

type MVVMOptions = {
    el: HTMLElement | string,
    data: () => Object,
    computed?: {
        [key: string]: () => any
    },
    methods?: {
        [key: string]: () => any
    }
};


export default class MVVM extends BaseMVVM {

    public $options: MVVMOptions;

    public $el: HTMLElement;

    public $data: Object;

    public $computed: Object = {};

    public $watcher: Watcher = new Watcher(this);

    public $compiler: Compiler;

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

        // 代理 computed

        Object.keys(this.$options.computed || {})
            .forEach((fnName: string) => {
                const fn: Function = this.$options.computed[fnName];
                const depKeys = _.serializeDependences(fn);

                const updateComputedHandler = () => {
                    // 在依赖项更新的时候，先更新数据到 $computed
                    this.$computed[fnName] = fn.call(this);
                    // 再触发 computed 更新
                    this.$watcher.emit(fnName, this.$computed[fnName]);
                };

                // 在某一项依赖更新的时候，同时触发当前 computed 更新
                for (let dep of depKeys) {
                    this.$watcher.on(dep, updateComputedHandler);
                }
                this.$nextTick(updateComputedHandler);

                // 从this上直接拿到computed
                Object.defineProperty(this, fnName, {
                    enumerable: true,
                    configurable: false,
                    get: () => this.$computed[fnName]
                })

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
