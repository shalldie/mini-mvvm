import VNode from "./VNode";
import attrsModule from './modules/Attrs';
import propsModule from './modules/Props';
import eventModule from './modules/Events';
import { hooks, IModuleHook, TModuleHookFunc } from './hooks';

const emptyVnode = new VNode('');

function patchFactory(modules: IModuleHook[] = []) {

    // 所有的钩子
    const cbs: Record<keyof IModuleHook, TModuleHookFunc[]> = {
        create: [], insert: [], update: [], destroy: [], remove: []
    };

    // 把各个module的钩子注入进去
    for (let item of modules) {
        hooks.forEach(hookKey => item[hookKey] && cbs[hookKey].push(item[hookKey]));
    }

    function createElm(vnode: VNode) {
        // 注释节点
        if (vnode.type === '!') {
            vnode.elm = document.createComment(vnode.text) as any as Element;
        }
        // 普通节点
        else if (vnode.type) {
            vnode.elm = document.createElement(vnode.type);

            // 如果有children，递归
            vnode.children && vnode.children.forEach(child => {
                vnode.elm.appendChild(createElm(child));
            });

            // 如果只有innertext，这是个hook，可以让 h 在创建的时候更方便
            // 这个时候不应该有 children
            if (vnode.text && vnode.text.length) {
                vnode.elm.appendChild(document.createTextNode(vnode.text));
            }
        }
        // textNode
        else {
            vnode.elm = document.createTextNode(vnode.text) as any as Element;
        }

        // create 钩子
        cbs.create.forEach(hook => hook(emptyVnode, vnode));
        return vnode.elm;
    }

    function addVnodes(
        parentElm: Node,
        before: Node,
        vnodes: VNode[],
        startIndex: number,
        endIndex: number
    ) {
        for (; startIndex <= endIndex; startIndex++) {
            parentElm.insertBefore(
                createElm(vnodes[startIndex]),
                before
            );
        }
    }

    function removeVnodes(
        parentElm: Node,
        vnodes: VNode[],
        startIndex: number,
        endIndex: number
    ) {
        for (; startIndex <= endIndex; startIndex++) {
            parentElm.removeChild(vnodes[startIndex].elm);
            cbs.destroy.forEach(hook => hook(vnodes[startIndex], emptyVnode));
        }
    }

    /**
     * patch oldVnode 和 vnode ，他们自身相同，但是可能其它属性或者children有变动
     *
     * @param {VNode} oldVnode 旧的vnode
     * @param {VNode} vnode 新的vnode
     */
    function patchVNode(oldVnode: VNode, vnode: VNode) {
        const elm = vnode.elm = oldVnode.elm;
        const oldChildren = oldVnode.children;
        const children = vnode.children;

        // 相同的vnode，直接返回。
        if (oldVnode === vnode) return;

        // 注释节点不考虑

        // 如果是文本节点
        if (vnode.text !== undefined) {
            elm.textContent = vnode.text;
            return;
        }

        // 有 children 的情况

        // 新老节点都有 children，且不相同的情况下，去对比 新老children，并更新
        if (oldChildren && children) {
            if (oldChildren !== children) {
                // todo: 添加新老children对比
            }
        }
        // 只有新的有children，则以前的是text节点
        else if (children) {
            // 先去掉可能存在的textcontent
            oldVnode.text && (elm.textContent = '');
            addVnodes(elm.parentNode, null, children, 0, children.length - 1);
        }
        // 只有旧的有children，则现在的是text节点
        else if (oldChildren) {
            removeVnodes(elm.parentNode, oldChildren, 0, oldChildren.length - 1);
            vnode.text && (elm.textContent = vnode.text);
        }
        // 都没有children，则只改变了textContent
        else if (oldVnode.text !== vnode.text) {
            elm.textContent = vnode.text;
        }

    }

    /**
     * 创建/更新 vnode
     *
     * @param {*} oldVnode dom节点或者旧的vnode
     * @param {VNode} vnode 新的vnode
     * @returns {VNode}
     */
    function patch(oldVnode: any, vnode: VNode): VNode {

        // 如果是dom对象，即初始化的时候
        if (!VNode.isVNode(oldVnode)) {
            oldVnode = new VNode(
                (oldVnode as HTMLElement).tagName.toLowerCase(),
                {},
                [],
                undefined,
                oldVnode
            );
        }
        // 同步 elm
        // vnode.elm = oldVnode.elm;

        // 比较2个vnode是否是同一个vnode，如果相同，就patch
        // 是否是相同的 VNode 对象 判断依据是 key 跟 tagname 是否相同，既 对于相同类型dom元素尽可能复用
        if (VNode.isSameVNode(oldVnode, vnode)) {
            patchVNode(oldVnode, vnode);
        }
        // 如果不是同一个vnode，把旧的删了创建新的
        else {
            const elm = oldVnode.elm as Element;
            createElm(vnode);
            elm.parentNode.insertBefore(vnode.elm, elm);

            removeVnodes(elm.parentNode, [oldVnode], 0, 0);

            // insert hook
            cbs.insert.forEach(hook => hook(oldVnode, vnode));
        }

        return vnode;
    }

    return patch;
}

export default patchFactory([
    attrsModule, propsModule, eventModule
]);
