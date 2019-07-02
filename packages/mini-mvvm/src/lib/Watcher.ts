import Dep from "./Dep";
import MVVM from "../core/MVVM";

export default class Watcher {

    public vm: MVVM;

    public value: any;

    public deps: Dep[] = [];

    constructor(vm: MVVM) {
        this.vm = vm;
    }

    public addDep(dep: Dep) {
        this.deps.push(dep);
        dep.add(this);
    }

    public update() {
        this.vm._update();
    }
}
