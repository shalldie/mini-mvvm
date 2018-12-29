import VNode from './VNode';
import Watcher from './Watcher';

import * as _ from '../utils';

/**
 * 缓存的key
 */
const VNODE_KEY = '__MVVM__';;


/**
 * Compile，用于编译模板
 *
 * @export
 * @class Compile
 */
export default class Compile {

    public static disposeNode(node: HTMLElement) {
        // 文本节点
        if (node.nodeType === 3) {
            return;
        }
    }

    /**
     * 处理节点
     *
     * @static
     * @param {HTMLElement} node
     * @param {Watcher} watcher
     * @memberof Compile
     */
    public static compileNode(node: HTMLElement, watcher: Watcher) {
        const children: Node[] = [].slice.call(node.childNodes);
        children.forEach(child => {
            child[VNODE_KEY] = new VNode(watcher);

            if (child.nodeType === 1) {
                // attributes
                Compile.compileAttributes(<HTMLElement>child, watcher);
                // events
                Compile.compileNodeEvents(<HTMLElement>child, watcher);
                // 递归
                Compile.compileNode(<HTMLElement>child, watcher);
            }
            if (child.nodeType === 3) {
                Compile.compileTextNode(<Text>child, watcher);
            }
        });
    }

    /**
     * 处理节点上的属性
     *
     * @static
     * @param {HTMLElement} node
     * @param {Watcher} watcher
     * @memberof Compile
     */
    public static compileAttributes(node: HTMLElement, watcher: Watcher) {
        const attributes: Attr[] = [].slice.call(node.attributes);

        // Map<属性 ,any>
        const attrMap: Map<string, { originAttr: string, actualAttr: string, dep: string }> = new Map();

        for (let attr of attributes) {
            const reg = /(x-bind)?:(\S+)/;
            let match = attr.name.match(reg);

            if (match) {
                attrMap.set(
                    match[2],      // key，依赖
                    {
                        originAttr: attr.name,  // 原始attribute的name
                        actualAttr: match[2],   // 实际attribute的name
                        dep: attr.value.trim()
                    });
            }
        }

        // 更新attribute为当前默认值，监听更新
        for (let { originAttr, actualAttr, dep } of attrMap.values()) {
            node.removeAttribute(originAttr);
            node.setAttribute(actualAttr, _.getValueFromVM(watcher.vm, dep));

            watcher.on(dep, (newVal: any) => {
                node.setAttribute(actualAttr, newVal);
            });
        }

    }

    public static compileNodeEvents(node: HTMLElement, watcher: Watcher) {
        const attributes: Attr[] = [].slice.call(node.attributes);

        const eventMap: Map<string, { event: string, handler: Function }> = new Map();

        // 解析事件，并绑定
        const reg = /(x-on:|@)(\S+)/;

        // 解析
        for (let attr of attributes) {
            let match = attr.name.match(reg);
            if (!match) {
                continue;
            }

            node.removeAttribute(attr.name);

            eventMap.set(
                match[2],
                {
                    event: match[2],
                    handler: watcher.vm[attr.value.trim()]
                }
            );
        }

        // 绑定
        for (let [event, { handler }] of eventMap) {
            node.addEventListener(event, <EventListenerOrEventListenerObject>handler);
        }

    }

    /**
     * 处理文本节点
     *
     * @static
     * @param {Text} node
     * @param {Watcher} watcher
     * @memberof Compile
     */
    public static compileTextNode(node: Text, watcher: Watcher) {

        const cache: VNode = node[VNODE_KEY];

        const watcherEventMap: Map<string, { event: string, handler: Function }> = cache.watcherEventMap;

        const content = node.textContent;
        const reg = /\{\{\s*?(\S+?)\s*?\}\}/g;

        const depMap: Map<string, any> = new Map();

        let match: RegExpExecArray;

        while (match = reg.exec(content)) {
            depMap.set(match[1], '');
        }

        const updateContent = () => {

            let result = content;
            depMap.forEach((mapVal: any, mapKey: string) => {
                const regKey = mapKey.replace(/\./g, '\\.');
                const reg = new RegExp(`\\{\\{\\\s*?${regKey}\\s*?\}\\}`, 'g');
                result = result.replace(reg, mapVal);
            });

            node.textContent = result;
        };

        for (let key of depMap.keys()) {
            depMap.set(key, _.getValueFromVM(watcher.vm, key));

            watcher.on(key, (newVal: any) => {
                depMap.set(key, newVal);
                updateContent();
            });
        }

        updateContent();
    }

}
