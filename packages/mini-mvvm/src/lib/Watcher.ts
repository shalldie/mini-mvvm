import Dep from "./Dep";

export default class Watcher {

    public value: any;

    public deps: Dep[] = [];

    public addDep(dep: Dep) {
        this.deps.push(dep);
    }

    public update() {

    }
}
