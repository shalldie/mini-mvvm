import VNode from "./VNode";
import attrsModule from './modules/Attrs';
import propsModule from './modules/Props';
import eventModule from './modules/Events';
import { hooks, IModuleHook, TModuleHookFunc } from './hooks';

const emptyVnode = new VNode('');

function patchFactory(modules: IModuleHook[] = []) {

    // modules 的所有的钩子
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
        vnode.data.hook.create && vnode.data.hook.create();
        return vnode.elm;
    }

    function addVnodes(
        parentElm: Node,
        before: Node,
        vnodes: VNode[],
        startIndex: number = 0,
        endIndex: number = vnodes.length - 1
    ) {
        for (; startIndex <= endIndex; startIndex++) {
            const vnode = vnodes[startIndex];
            parentElm.insertBefore(
                createElm(vnode),
                before
            );
            cbs.insert.forEach(hook => hook(emptyVnode, vnode));
            vnode.data.hook.insert && vnode.data.hook.insert();
        }
    }

    function removeVnodes(
        parentElm: Node,
        vnodes: VNode[],
        startIndex: number = 0,
        endIndex: number = vnodes.length - 1
    ) {
        for (; startIndex <= endIndex; startIndex++) {
            const vnode = vnodes[startIndex];
            parentElm && parentElm.removeChild(vnode.elm);
            cbs.destroy.forEach(hook => hook(vnode, emptyVnode));
            vnode.data.hook.destroy && vnode.data.hook.destroy();
        }
    }

    function updateChildren(parentElm: Element, oldChildren: VNode[], children: VNode[]) {

        // 方式一：
        // 如果想无脑点可以直接这样，不复用dom，直接把所有children都更新
        // removeVnodes(parentElm, oldChildren);
        // addVnodes(parentElm, null, children);
        // return;

        // 方式二：
        // 当前算法是，顺序依次找到可复用的元素
        // 对于大批量列表，从 上、中 部进行 添加、删除 操作效率上稍微不太友好，并不是最佳方式
        // 有时候多次操作后的结果是元素没有移动，但还是会按照操作步骤来一遍
        // 如果先在内存中把所有的位置，移动等都计算好，然后再进行操作，效率会更高。

        const oldMirror = oldChildren.slice();  // 用来表示哪些oldchildren被用过，位置信息等
        for (let i = 0; i < children.length; i++) {
            // 当前vnode
            const vnode = children[i];
            // 可以被复用的vnode的索引
            let oldVnodeIndex = oldMirror.findIndex(node => {
                return node && VNode.isSameVNode(node, vnode);
            });
            // 如果有vnode可以复用
            if (~oldVnodeIndex) {
                // console.log(oldVnodeIndex);
                const oldVnode = oldMirror[oldVnodeIndex];

                // 把之前的置空，表示已经用过。之后仍然存留的要被删除
                oldMirror[oldVnodeIndex] = undefined;
                // 调整顺序（如果旧的索引对不上新索引）
                if (oldVnodeIndex !== i) {
                    parentElm.insertBefore(oldVnode.elm, parentElm.children[i + 1]);
                }
                // 比较数据,进行更新
                patchVNode(oldVnode, vnode);
            }
            // 不能复用就创建新的
            else {
                addVnodes(
                    parentElm,
                    parentElm.children[i + 1],
                    [vnode]
                );
            }

        }

        // 删除oldchildren中未被复用的部分
        const rmVnodes = oldMirror.filter(n => !!n);

        rmVnodes.length && removeVnodes(
            parentElm,
            rmVnodes
        );

    }

    /**
     * patch oldVnode 和 vnode ，他们自身相同，但是可能其它属性或者children有变动
     *
     * @param {VNode} oldVnode 旧的vnode
     * @param {VNode} vnode 新的vnode
     */
    function patchVNode(oldVnode: VNode, vnode: VNode) {
        // console.log('patch vnode');
        const elm = vnode.elm = oldVnode.elm;
        const oldChildren = oldVnode.children;
        const children = vnode.children;

        // 相同的vnode，直接返回。
        if (oldVnode === vnode) return;

        // 注释节点不考虑

        // 如果是文本节点
        // 不需要钩子，至少以某标签为单位
        if (vnode.text !== undefined && vnode.text !== oldVnode.text) {
            elm.textContent = vnode.text;
            return;
        }

        // 有 children 的情况

        // 新老节点都有 children，且不相同的情况下，去对比 新老children，并更新
        if (oldChildren && children) {
            if (oldChildren !== children) {
                // console.log('all children');
                updateChildren(elm, oldChildren, children);
            }
        }
        // 只有新的有children，则以前的是text节点
        else if (children) {
            // console.log('only new children');
            // 先去掉可能存在的textcontent
            oldVnode.text && (elm.textContent = '');
            addVnodes(elm, null, children);
        }
        // 只有旧的有children，则现在的是text节点
        else if (oldChildren) {

            // console.log('only old children');
            removeVnodes(elm, oldChildren);
            vnode.text && (elm.textContent = vnode.text);
        }
        // 都没有children，则只改变了textContent
        // 不过在 h 函数中添加了处理，现在不会出现这种情况了
        else if (oldVnode.text !== vnode.text) {
            elm.textContent = vnode.text;
        }

        cbs.update.forEach(hook => hook(oldVnode, vnode));
        vnode.data.hook.update && vnode.data.hook.update();
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
                '', // 这里使dom不复用，触发生命周期钩子
                // (oldVnode as HTMLElement).tagName.toLowerCase(),
                {},
                [],
                undefined,
                oldVnode
            );
        }

        // 比较2个vnode是否是可复用的vnode，如果可以，就patch
        // 是否是相同的 VNode 对象 判断依据是 key 跟 tagname 是否相同，既 对于相同类型dom元素尽可能复用
        if (VNode.isSameVNode(oldVnode, vnode)) {
            patchVNode(oldVnode, vnode);
        }
        // 如果不是同一个vnode，把旧的删了创建新的
        else {
            const elm = oldVnode.elm as Element;
            addVnodes(
                elm.parentNode,
                elm,
                [vnode]
            );

            removeVnodes(elm.parentNode, [oldVnode]);

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
