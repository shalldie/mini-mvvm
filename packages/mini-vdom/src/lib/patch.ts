import VNode from './VNode';
import attrsModule from './modules/attrs';
import propsModule from './modules/props';
import eventModule from './modules/events';
import { hooks, IModuleHook, TModuleHookFunc } from './hooks';

const emptyVnode = new VNode('');

function patchFactory(modules: IModuleHook[] = []): (oldVnode: any, vnode: VNode) => VNode {
    // modules 的所有的钩子
    const cbs: Record<keyof IModuleHook, TModuleHookFunc[]> = {
        create: [],
        insert: [],
        update: [],
        destroy: [],
        remove: []
    };

    // 把各个module的钩子注入进去
    for (const item of modules) {
        hooks.forEach(hookKey => item[hookKey] && cbs[hookKey].push(item[hookKey]));
    }

    function createElm(vnode: VNode): Element {
        // 注释节点
        if (vnode.type === '!') {
            vnode.elm = (document.createComment(vnode.text) as any) as Element;
        }
        // 普通节点
        else if (vnode.type) {
            vnode.elm = vnode.data.ns
                ? document.createElementNS(vnode.data.ns, vnode.type)
                : document.createElement(vnode.type);

            // 如果有children，递归
            vnode.children &&
                vnode.children.forEach(child => {
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
            vnode.elm = (document.createTextNode(vnode.text) as any) as Element;
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
        startIndex = 0,
        endIndex = vnodes.length - 1
    ): void {
        for (; startIndex <= endIndex; startIndex++) {
            const vnode = vnodes[startIndex];
            parentElm.insertBefore(createElm(vnode), before);
            cbs.insert.forEach(hook => hook(emptyVnode, vnode));
            vnode.data.hook.insert && vnode.data.hook.insert();
        }
    }

    function removeVnodes(parentElm: Node, vnodes: VNode[], startIndex = 0, endIndex = vnodes.length - 1): void {
        for (; startIndex <= endIndex; startIndex++) {
            const vnode = vnodes[startIndex];
            parentElm && parentElm.removeChild(vnode.elm);
            cbs.destroy.forEach(hook => hook(vnode, emptyVnode));
            vnode.data.hook.destroy && vnode.data.hook.destroy();
        }
    }

    function updateChildren(parentElm: Element, oldChildren: VNode[], children: VNode[]): void {
        // 方式一：
        // 如果想无脑点可以直接这样，不复用dom，直接把所有children都更新
        // removeVnodes(parentElm, oldChildren);
        // addVnodes(parentElm, null, children);
        // return;

        // 方式二：
        // 顺序依次找到可复用的元素
        // 对于大批量列表，从 上、中 部进行 添加、删除 操作效率上稍微不太友好，并不是最佳方式
        // 有时候多次操作后的结果是元素没有移动，但还是会按照操作步骤来一遍
        // 如果先在内存中把所有的位置，移动等都计算好，然后再进行操作，效率会更高。

        // const oldMirror = oldChildren.slice(); // 用来表示哪些oldchildren被用过，位置信息等
        // for (let i = 0; i < children.length; i++) {
        //     // 当前vnode
        //     const vnode = children[i];
        //     // 可以被复用的vnode的索引
        //     const oldVnodeIndex = oldMirror.findIndex(node => {
        //         return node && VNode.isSameVNode(node, vnode);
        //     });
        //     // 如果有vnode可以复用
        //     if (~oldVnodeIndex) {
        //         // console.log(oldVnodeIndex);
        //         const oldVnode = oldMirror[oldVnodeIndex];

        //         // 把之前的置空，表示已经用过。之后仍然存留的要被删除
        //         oldMirror[oldVnodeIndex] = undefined;
        //         // 调整顺序（如果旧的索引对不上新索引）
        //         if (oldVnodeIndex !== i) {
        //             parentElm.insertBefore(oldVnode.elm, parentElm.childNodes[i + 1]);
        //         }
        //         // 比较数据,进行更新
        //         // eslint-disable-next-line
        //         patchVNode(oldVnode, vnode);
        //     }
        //     // 不能复用就创建新的
        //     else {
        //         addVnodes(parentElm, parentElm.childNodes[i + 1], [vnode]);
        //     }
        // }

        // // 删除oldchildren中未被复用的部分
        // const rmVnodes = oldMirror.filter(n => !!n);

        // rmVnodes.length && removeVnodes(parentElm, rmVnodes);

        // 方式三：
        // 类 snabbdom 的 diff 算法

        // debugger;

        let oldStartIndex = 0;
        let oldStartVNode = oldChildren[oldStartIndex];
        let oldEndIndex = oldChildren.length - 1;
        let oldEndVNode = oldChildren[oldEndIndex];

        let newStartIndex = 0;
        let newStartVNode = children[newStartIndex];
        let newEndIndex = children.length - 1;
        let newEndVNode = children[newEndIndex];

        // if (parentElm.classList.contains('page-item')) {
        //     debugger;
        // }

        while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
            // console.log(oldStartVNode, newStartVNode);
            switch (true) {
                // 1. 先校验2个 old start/end vnode 是否为空，当为`undefined`的时候，表示被其它地方复用了
                // 对 new start/end vnode 也做处理，是因为可能移动后根本没子节点
                case !oldStartVNode:
                    oldStartVNode = oldChildren[++oldStartIndex];
                    break;
                case !oldEndVNode:
                    oldEndVNode = oldChildren[--oldEndIndex];
                    break;
                case !newStartVNode:
                    newStartVNode = children[++newStartIndex];
                    break;
                case !newEndVNode:
                    newEndVNode = oldChildren[--newEndIndex];
                    break;

                // 2. 首首、尾尾 对比， 适用于 普通的 插入、删除 节点
                // 首首比较
                case VNode.isSameVNode(oldStartVNode, newStartVNode):
                    patchVNode(oldStartVNode, newStartVNode);
                    oldStartVNode = oldChildren[++oldStartIndex];
                    newStartVNode = children[++newStartIndex];
                    break;

                // 尾尾比较
                case VNode.isSameVNode(oldEndVNode, newEndVNode):
                    patchVNode(oldEndVNode, newEndVNode);
                    oldEndVNode = oldChildren[--oldEndIndex];
                    newEndVNode = children[--newEndIndex];
                    break;

                // 3. 旧尾=》新头，旧头=》新尾， 适用于移动了某个节点的情况
                // 旧尾=》新头，把节点左移
                //    [1, 2, 3]
                // [3, 1, 2]
                case VNode.isSameVNode(oldEndVNode, newStartVNode):
                    parentElm.insertBefore(oldEndVNode.elm, parentElm.childNodes[newStartIndex]);
                    patchVNode(oldEndVNode, newStartVNode);
                    oldEndVNode = oldChildren[--oldEndIndex];
                    newStartVNode = children[++newStartIndex];
                    break;

                // 旧头=》新尾，把节点右移
                // [1, 2, 3]
                //    [2, 3, 1]
                case VNode.isSameVNode(oldStartVNode, newEndVNode):
                    parentElm.insertBefore(oldEndVNode.elm, oldEndVNode.elm.nextSibling);
                    patchVNode(oldStartVNode, newEndVNode);
                    oldStartVNode = oldChildren[++oldStartIndex];
                    newEndVNode = children[--newEndIndex];
                    break;

                // 4. 交叉比较
                // 不属于数组常规操作，比如这种情况：
                // old: [1,    2, 3,    4]
                // new: [1, 5, 2, 3, 6, 4]
                // 当然理想的状态下，是 5跟6 重新生成，其它的直接复用
                // 这个时候 5 会复用 2，2 会复用 3，6 会重新生成。
                // 只处理 newStartVNode
                default:
                    // 可以被复用的vnode的索引
                    const oldVnodeIndex = oldChildren.findIndex((node, index) => {
                        return (
                            // 索引在 oldStartIndex ~ oldEndIndex
                            // 之前没有被复用过
                            //  并且可以被复用
                            index >= oldStartIndex &&
                            index <= oldEndIndex &&
                            node &&
                            VNode.isSameVNode(node, newStartVNode)
                        );
                    });
                    // 如果有vnode可以复用
                    if (~oldVnodeIndex) {
                        const oldVnode = oldChildren[oldVnodeIndex];

                        // 把之前的置空，表示已经用过。之后仍然存留的要被删除
                        oldChildren[oldVnodeIndex] = undefined;
                        // 调整顺序（如果旧的索引对不上新索引）
                        if (oldVnodeIndex !== newStartIndex) {
                            parentElm.insertBefore(oldVnode.elm, parentElm.childNodes[newStartIndex]);
                        }
                        // 比较数据,进行更新
                        patchVNode(oldVnode, newStartVNode);
                    }
                    // 不能复用就创建新的
                    // old: [1,    2, 3,    4]
                    // new: [1, 5, 2, 3, 6, 4]
                    else {
                        // if (parentElm.classList.contains('page-item')) {
                        //     debugger;
                        // }
                        addVnodes(parentElm, parentElm.childNodes[newStartIndex], [newStartVNode]);
                    }

                    // 新头 向右移动一位
                    newStartVNode = children[++newStartIndex];
                    break;
            }
        }

        // 如果循环完毕，还有 oldStartIndex ～ oldEndIndex || newStartIndex ～ newEndIndex 之间还有空余，
        // 表示有旧节点未被删除干净，或者新节点没有完全添加完毕

        // 旧的 vnodes 遍历完，新的没有
        // 表示有新的没有添加完毕
        if (oldStartIndex > oldEndIndex && newStartIndex <= newEndIndex) {
            // addVnodes(parentElm, newEndVNode.elm.nextSibling, children.slice(newStartIndex, newEndIndex));

            addVnodes(parentElm, children[newEndIndex + 1]?.elm, children.slice(newStartIndex, newEndIndex + 1));
            // addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        }
        // 新的 vnodes 遍历完，旧的没有
        // 表示有旧的没有删除干净
        else if (oldStartIndex <= oldEndIndex && newStartIndex > newEndIndex) {
            // debugger;
            removeVnodes(
                parentElm,
                oldChildren.slice(oldStartIndex, oldEndIndex + 1).filter(n => !!n)
            );
        }
    }

    /**
     * patch oldVnode 和 vnode ，他们自身相同，但是可能其它属性或者children有变动
     *
     * @param {VNode} oldVnode 旧的vnode
     * @param {VNode} vnode 新的vnode
     */
    function patchVNode(oldVnode: VNode, vnode: VNode): void {
        // console.log('patch vnode');
        const elm = (vnode.elm = oldVnode.elm);
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
            addVnodes(elm.parentNode, elm, [vnode]);

            removeVnodes(elm.parentNode, [oldVnode]);

            // insert hook
            cbs.insert.forEach(hook => hook(oldVnode, vnode));
        }

        return vnode;
    }

    return patch;
}

export default patchFactory([attrsModule, propsModule, eventModule]);
