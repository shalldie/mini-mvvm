import Dep from "./Dep";
import MVVM from "../core/MVVM";
import { proxy } from "./Observer";


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
        const watcher = new Watcher(vm, computed[key], { lazy: true });
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
}

export default class Watcher implements IWatcherOpotions {

    public vm: MVVM;

    public value: any;

    public deps: Dep[] = [];

    public getter: Function;

    public lazy: boolean;

    public dirty: boolean;

    constructor(vm: MVVM, getter?: Function, options: IWatcherOpotions = {}) {
        this.vm = vm;
        this.getter = getter;
        // 把 options 传入 this
        Object.assign(this, options);
        // 初始化的时候，如果是lazy，就表示是脏数据
        this.dirty = this.lazy;
    }

    public addDep(dep: Dep) {
        if (!~this.deps.indexOf(dep)) {
            this.deps.push(dep);
        }
    }

    public update() {
        // lazy 表示是 computed，只有在用到的时候才去更新
        if (this.lazy) {
            console.log('设置了 dirty');
            this.dirty = true;
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
        Dep.target = this;
        this.value = this.getter.call(this.vm, this.vm);
        Dep.target = null;
        this.dirty = false;
        return this.value;
    }
}
