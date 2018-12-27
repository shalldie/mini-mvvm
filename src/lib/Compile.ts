import Watcher from './Watcher';


export default class Compile {

    public static compileNode(node: HTMLElement, watcher: Watcher) {
        const children: Node[] = [].slice.call(node.childNodes);
        children.forEach(child => {
            if (child.nodeType === 3) {
                Compile.compileTextNode(<Text>child, watcher);
            }
        });
    }

    public static compileTextNode(node: Text, watcher: Watcher) {
        const content = node.textContent;
        const reg = /\{\{\s*?(\S+?)\s*?\}\}/g;

        const depMarks = content.match(reg);
        if (!depMarks) {
            return;
        }


        for (let mark of depMarks) {
            let key = mark.match(/\{\{\s*?(\S+?)\s*?\}\}/)[1];
            watcher.on(key, (newVal: any) => {
                node.textContent = content.replace(mark, newVal);
            });
        }

    }

}
