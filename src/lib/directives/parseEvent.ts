import NodeStore from "../../models/NodeStore";

/**
 * 处理节点上绑定的事件
 *
 * @export
 * @param {HTMLElement} node
 * @param {NodeStore} nodeStore
 */
export default function parseEventbind(node: HTMLElement, nodeStore: NodeStore) {
    for (let [name, value] of nodeStore.vnode.attributes) {
        // 获取事件名
        const reg = /(x-on:|@)(\S+)/;

        let match = name.match(reg);

        if (!match) {
            continue;
        }

        if (nodeStore.vnode.isRoot) {
            node.removeAttribute(name);
        }

        // 事件名
        const eventName = match[2];

        // 这个正则用来找到方法名，参数。
        // 不能改，眼睛会花的。只能重写 >_<#@!
        const { handler } = serializeEvent(value, nodeStore);

        node.addEventListener(eventName, handler);

        nodeStore.domEventMap.set(eventName, {
            event: eventName,
            handler
        });
    }
}

/**
 * 从表达式中分析出方法、依赖
 *
 * @export
 * @param {string} expression
 * @param {NodeStore} nodeStore
 * @returns
 */
export function serializeEvent(expression: string, nodeStore: NodeStore) {
    // 这个正则用来找到方法名，参数。
    // 不能改，眼睛会花的。只能重写 >_<#@!
    const reg = /^([^\()]+)(\((([^,\)]+,)*[^,\)]*)\))?$/;
    const match = expression.match(reg);
    const methodName = match[1].trim();
    const args = match[3] ? match[3].split(',').map(n => n.trim()).filter(n => n.length) : [];

    const handler = (event?: Event) => {
        const runtimeArgs = args.map(name => {
            if (name === '$event') {
                return event;
            }
            return nodeStore.context.get(name);
        });
        return nodeStore.vm[methodName](...runtimeArgs);
    };

    return {
        deps: args.filter(n => n !== '$event'),
        handler
    };
}
