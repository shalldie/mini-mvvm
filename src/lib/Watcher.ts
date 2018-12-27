import MVVM from './MVVM';
/**
 * Watcher 用来 数据更新收集、派发
 *
 * @export
 * @class Watcher
 */
export default class Watcher {


    /**
     * 需要更新的所有属性
     *
     * @private
     * @type {string[]}
     * @memberof Watcher
     */
    private updateLinks: string[] = [];

    /**
     * 实际要更新的key
     *
     * @description
     * 没有使用 virtual dom
     * 为最大节约性能，每次只更新要更新的数据的最小共同节点数据对应的tpl
     * 所有数据修改后，在 nextTick 中去一起更新
     *
     * @readonly
     * @private
     * @type {string[]}
     * @memberof Watcher
     */
    private get actualLinks(): string[] {

        const filterRootLink = (list: string[], asc: boolean = true) => {
            list = list.slice();
            if (!asc) {
                list.reverse();
            }

            const result: string[] = [];
            for (let link of list) {

                const hasRoot = result.some(current => {
                    current = current.replace(/\./g, '\\.');
                    const reg = new RegExp(`^${current}(\\.|$)`);

                    return reg.test(link);
                });

                if (!hasRoot) {
                    result.push(link);
                }
            }

            return result;

        };

        let result = filterRootLink(this.updateLinks);
        result = filterRootLink(result, false);

        return result;
    }

    /**
     * 更新一个 key
     *
     * @param {string} link
     * @memberof Watcher
     */
    public updateKey(link: string): void {
        this.updateLinks.push(link);
        this.notifyView();
    }

    /**
     * 通知视图更新
     *
     * @private
     * @memberof Watcher
     */
    private notifyView() {
        MVVM.nextTick(() => {
            if (!this.updateLinks.length) {
                return;
            }

            console.log('--------------');
            console.log('本次更新了：');
            this.actualLinks.forEach(n => console.log(n));
            console.log('--------------');
            this.updateLinks = [];

        });
    }
}
