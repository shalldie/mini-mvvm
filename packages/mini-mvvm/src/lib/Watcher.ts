import Dep from "./Dep";
import MVVM from "../core/MVVM";
import { proxy } from "./Observer";
import { getValByPath, nextTick } from "../common/utils";


/**
 * 给 vm 添加 computed
 *
 * @export
 * @param {MVVM} vm
 * @param {Record<string, Function>} [computed={}]
 * @returns
 */
export function defineComputed(vm: MVVM, computed: Record<string, Function> = {}) {
    const computedWatchers: Record<string, Watcher> = {};
    for (let key in computed) {
        const watcher = new Watcher(vm, computed[key], null, { lazy: true });
        proxy(vm, key, {
            get() {

                // 如果是在 watcher 中引用 watcher，被引用的 watcher 会更改和清空 Dep.target
                // 所以缓存一下，并且在之后更新
                const wrapWatcher = Dep.target; // 外面的那层 watcher

                const val = watcher.dirty ?
                    // 如果需要更新，就重新计算并获取依赖
                    watcher.get()
                    :
                    // 否则就从缓存拿
                    watcher.value;

                if (wrapWatcher) { // 把 watcher 中的引用，传递给外部的 watcher
                    Dep.target = wrapWatcher;
                    watcher.deps.forEach(dep => dep.depend());
                }

                return val;
            }
        });
        computedWatchers[key] = watcher;
    }
    return computedWatchers;
}

type TWatchFn = (val: any, oldVal: any) => void;

export type TWatchDefine = TWatchFn | {
    immediate: boolean,
    handler: TWatchFn
};


/**
 * 给 vm 添加 $watch，并处理 $options.watch
 *
 * @export
 * @param {MVVM} vm
 * @param {Record<string, TWatchDefine>} watch
 */
export function defineWatch(vm: MVVM, watch: Record<string, TWatchDefine>) {

    vm.$watch = function (exp, callback, { immediate } = { immediate: false }) {
        vm._watchers.push(new Watcher(
            vm,
            // 这个是用来借助computed来搜集依赖用
            () => getValByPath(vm, exp),
            // 在依赖进行改变的时候，执行回掉
            callback,
            // 是否立即执行
            { immediate }
        ));
    };

    for (let exp in watch) {
        const watchDef = watch[exp];
        if (typeof watchDef === 'function') {
            vm.$watch(
                exp,
                watchDef as TWatchFn
            );
        }
        else if (typeof watchDef === 'object') {
            vm.$watch(
                exp,
                watchDef.handler,
                { immediate: watchDef.immediate }
            );
        }
    }
}

interface IWatcherOpotions {

    /**
     * 延迟计算，只有在用到的时候才去计算
     *
     * @type {boolean}
     * @memberof IWatcherOpotions
     */
    lazy?: boolean;

    /**
     * 脏数据，需要重新计算
     *
     * @type {boolean}
     * @memberof IWatcherOpotions
     */
    dirty?: boolean;

    /**
     * 是否立即执行
     *
     * @type {boolean}
     * @memberof IWatcherOpotions
     */
    immediate?: boolean;
}

export default class Watcher implements IWatcherOpotions {

    private invoked: boolean = false;

    public vm: MVVM;

    public value: any;

    public deps: Dep[] = [];

    public getter: Function;

    public cb: Function;

    public lazy: boolean;

    public dirty: boolean;

    public immediate: boolean;

    constructor(vm: MVVM, getter?: Function, cb?: Function, options: IWatcherOpotions = {}) {
        this.vm = vm;
        this.getter = getter;
        this.cb = cb;

        // 把 options 传入 this
        Object.assign(this, options);

        // 初始化的时候，如果是lazy，就表示是脏数据
        this.dirty = this.lazy;

        // 是 watch 的时候，计算一下当前依赖
        if (this.cb) {
            this.get();
        }
    }

    public addDep(dep: Dep) {
        if (!~this.deps.indexOf(dep)) {
            this.deps.push(dep);
        }
    }

    public update() {
        // lazy 表示是 computed，只有在用到的时候才去更新
        if (this.lazy) {
            this.dirty = true;
        }
        // cb 表示是 watch
        else if (this.cb) {
            // debugger;

            // 连续的修改，以最后一次为准
            // 全都在 nexttick 中处理
            this.dirty = true;

            nextTick(() => {
                if (!this.dirty) {
                    return;
                }

                this.get();
            });
        }
        // 更新因为是在 nextTick ，所以在 render 的时候，
        // 所有的 computed watchers 都已经标记为 dirty:false 了
        else {
            this.vm._update();
        }
    }

    /**
     * 清空所有依赖
     *
     * @memberof Watcher
     */
    public clear() {
        this.deps.forEach(dep => dep.remove(this));
        this.deps = [];
    }

    /**
     * 计算value并重新搜集依赖
     *
     * @memberof Watcher
     */
    public get() {

        this.clear();
        const oldVal = this.value;
        Dep.target = this;

        try {
            this.value = this.getter.call(this.vm, this.vm);

            // 在【立即执行】或者【更新】的时候，进行通知
            if (this.cb && this.value !== oldVal && (this.immediate || this.invoked)) {
                this.cb.call(this.vm, this.value, oldVal);
            }
        }
        catch (ex) {
            console.log('watcher get error');
            throw ex;
        }
        finally {
            Dep.target = null;
            this.dirty = false;
            this.invoked = true;
        }

        return this.value;
    }
}
