import Dep from "./Dep";
import MVVM from "../core/MVVM";

export default class Watcher {

    public vm: MVVM;

    public value: any;

    public deps: Dep[] = [];

    public getter: () => any;

    constructor(vm: MVVM, getter?: () => any) {
        this.vm = vm;
        this.getter = getter;
    }

    public addDep(dep: Dep) {
        if (!~this.deps.indexOf(dep)) {
            this.deps.push(dep);
        }
    }

    public update() {
        this.vm._update();
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
        this.value = this.getter();
    }
}
