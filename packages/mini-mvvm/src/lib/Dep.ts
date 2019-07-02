/**
 * 搜集所有依赖
 */

import Watcher from "./Watcher";

// https://segmentfault.com/a/1190000006599500

let depId = 1;

export default class Dep {

    private subs: Watcher[] = [];

    public id: number = depId++;

    public static target: Watcher;

    /**
     * 添加一个 watcher
     *
     * @param {Watcher} watcher
     * @returns
     * @memberof Dep
     */
    public add(watcher: Watcher) {
        if (~this.subs.indexOf(watcher)) {
            return;
        }
        this.subs.push(watcher);
    }

    /**
     * 移除一个 watcher
     *
     * @param {Watcher} watcher
     * @memberof Dep
     */
    public remove(watcher: Watcher) {
        const index = this.subs.indexOf(watcher);
        if (~index) {
            this.subs.splice(index, 1);
        }
    }

    /**
     * 通过 Dep.target 把 dep 添加到当前到 watcher
     *
     * @memberof Dep
     */
    public depend() {
        const target = Dep.target;
        if (!target) {
            return;
        }
        target.addDep(this);
        this.add(target);
    }

    /**
     * 通知所有 watcher 更新
     *
     * @memberof Dep
     */
    public notify() {
        this.subs.forEach(n => n.update());
    }
}
