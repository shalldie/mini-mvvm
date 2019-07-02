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
        if (!~this.deps.indexOf(dep)) {
            this.deps.push(dep);
            console.log('current dep:' + this.deps.map(n => n.id).join(','));
        }
        // dep.add(this);
    }

    public update() {
        this.vm._update();
    }

    public dispose() {
        this.deps.forEach(dep => dep.remove(this));
    }
}
