/**
 * 存放回调的字典
 */
type Subscription = {
    [key: string]: Function[]
};

/**
 * pub/sub 类
 *
 * @export
 * @class EventEmitter
 */
export default class EventEmitter {

    private subscription: Subscription = {};

    /**
     * 添加事件监听
     *
     * @param {string} event 事件名
     * @param {Function} listener 监听器
     * @memberof EventEmitter
     */
    on(event: string, listener: Function): void {
        this.subscription[event] = this.subscription[event] || [];
        this.subscription[event].push(listener);
    }

    /**
     * 触发事件
     *
     * @param {string} event 事件名
     * @param {...any[]} args 参数
     * @memberof EventEmitter
     */
    emit(event: string, ...args: any[]): void {
        const callbacks = this.subscription[event] || [];
        callbacks.forEach(listener => listener(...args));
    }

}
