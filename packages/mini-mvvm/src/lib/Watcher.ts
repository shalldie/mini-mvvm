import Dep from "./Dep";

export default class Watcher {

    private deps: Dep[] = [];

    public addDep(dep: Dep) {
        this.deps.push(dep);
    }

    public update() {

    }
}
