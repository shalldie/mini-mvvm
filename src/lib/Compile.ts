import Watcher from './Watcher';
import * as _ from '../utils';


export default class Compile {

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

    public static compileAttributes(node: HTMLElement, watcher: Watcher) {
        const attributes: Attr[] = [].slice.call(node.attributes);

        // Map<依赖,属性>
        const attrMap: Map<string, { origin: string, actual: string }> = new Map();
        // debugger;
        for (let attr of attributes) {
            const reg = /(x-bind)?:(\S+)/;
            let match = attr.name.match(reg);

            if (match) {
                attrMap.set(
                    attr.value.trim(),      // key，依赖
                    {
                        origin: attr.name,  // 原始attribute的name
                        actual: match[2]    // 实际attribute的name
                    });
            }
        }

        // 更新attribute为当前默认值
        for (let [key, { origin, actual }] of attrMap) {
            node.removeAttribute(origin);
            console.log(key);
            node.setAttribute(actual, _.getValueFromVM(watcher.vm, key));
        }
    }

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
