import Watcher from "./Watcher";

// https://segmentfault.com/a/1190000006599500

export default class Dep {

    private subs: Watcher[] = [];

    public static target: Watcher = null;

    public add(watcher: Watcher) {
        if (~this.subs.indexOf(watcher)) {
            return;
        }
        this.subs.push(watcher);
    }

    public remove(watcher: Watcher) {
        const index = this.subs.indexOf(watcher);
        if (~index) {
            this.subs.splice(index, 1);
        }
    }

    public depend() {
        Dep.target && Dep.target.addDep(this);
    }

    public notify() {
        this.subs.forEach(n => n.update());
    }
}
