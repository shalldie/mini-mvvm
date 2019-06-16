/**
 * 存放回调的字典
 */
type Subscription = {
    [key: string]: Array<{ type: ESubscribeType, listener: Function }>
};

/**
 * 订阅类型
 *
 * @enum {number}
 */
enum ESubscribeType {
    /**
     * 常规
     */
    normal,
    /**
     * 仅执行一次久删除
     */
    once
}

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
     * @param {ESubscribeType} [type=ESubscribeType.normal] 监听类型
     * @memberof EventEmitter
     */
    public on(event: string, listener: Function, type: ESubscribeType = ESubscribeType.normal): void {
        this.subscription[event] = this.subscription[event] || [];
        this.subscription[event].push({
            type,
            listener
        });
    }

    /**
     * 添加事件监听，执行一次就删除
     *
     * @param {string} event 事件名
     * @param {Function} listener 监听器
     * @memberof EventEmitter
     */
    public once(event: string, listener: Function): void {
        this.on(event, listener, ESubscribeType.once);
    }

    /**
     * 解除事件绑定
     *
     * @param {string} event 事件名
     * @param {Function} listener 监听器
     * @memberof EventEmitter
     */
    public off(event: string, listener: Function): void {
        const subscriptions = this.subscription[event] || [];
        const index = subscriptions.findIndex(item => item.listener === listener);
        if (index >= 0) {
            subscriptions.splice(index, 1);
        }
    }

    /**
     * 触发事件
     *
     * @param {string} event 事件名
     * @param {...any[]} args 参数
     * @memberof EventEmitter
     */
    public emit(event: string, ...args: any[]): void {
        const subscriptions = this.subscription[event] || [];

        // 不缓存length是因为length会更改
        for (let i = 0; i < subscriptions.length; i++) {
            let item = subscriptions[i];
            item.listener(...args);

            // 常规回调
            if (item.type === ESubscribeType.normal) {
                continue;
            }
            // 仅执行一次的
            if (item.type === ESubscribeType.once) {
                subscriptions.splice(i, 1);
                i--;
            }
        }
    }

    public listeners(event: string) {
        return this.subscription[event] || [];
    }

    /**
     * 获取所有监听的事件
     *
     * @readonly
     * @type {string[]}
     * @memberof EventEmitter
     */
    public get events(): string[] {
        return Object.keys(this.subscription);
    }

}
