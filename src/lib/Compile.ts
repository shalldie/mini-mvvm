import Watcher from './Watcher';
import * as _ from '../utils';


/**
 * Compile，用于编译模板
 *
 * @export
 * @class Compile
 */
export default class Compile {

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
            if (child.nodeType === 1) {
                // attributes
                Compile.compileAttributes(<HTMLElement>child, watcher);
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

        // Map<依赖,属性>
        const attrMap: Map<string, { originAttr: string, actualAttr: string }> = new Map();

        for (let attr of attributes) {
            const reg = /(x-bind)?:(\S+)/;
            let match = attr.name.match(reg);

            if (match) {
                attrMap.set(
                    attr.value.trim(),      // key，依赖
                    {
                        originAttr: attr.name,  // 原始attribute的name
                        actualAttr: match[2]   // 实际attribute的name
                    });
            }
        }

        // 更新attribute为当前默认值，监听更新
        for (let [key, { originAttr, actualAttr }] of attrMap) {
            node.removeAttribute(originAttr);
            node.setAttribute(actualAttr, _.getValueFromVM(watcher.vm, key));

            watcher.on(key, (newVal: any) => {
                node.setAttribute(actualAttr, newVal);
            });
        }

    }

    public static compileNodeEvents(node: HTMLElement, watcher: Watcher) {
        const attributes: Attr[] = [].slice.call(node.attributes);

        const eventMap: Map<string, {}> = new Map();

        const reg = /(x-on:|@)(\S+?)/;

        // let match: RegExpExecArray;

        for (let attr of attributes) {
            let match = attr.name.match(reg);
            if (!match) {
                continue;
            }

            eventMap.set(
                match[2],
                {
                    type: ''
                }
            );
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
