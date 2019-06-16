import VNode from "./VNode";
import attrsModule from './modules/Attrs';
import propsModule from './modules/Props';
import { hooks, IModuleHook, TModuleHookFunc } from './hooks';

const emptyVnode = new VNode('');

function inIt(modules: IModuleHook[]) {

    // 所有的钩子
    const cbs: Record<keyof IModuleHook, TModuleHookFunc[]> = {
        create: [], update: [], destroy: [], remove: []
    };

    function createElm(vnode: VNode) {
        // 注释节点
        if (vnode.type === '!') {
            vnode.elm = document.createComment(vnode.text) as any as Element;
        }
        // 普通节点
        else if (vnode.type) {
            vnode.elm = document.createElement(vnode.type);

            vnode.children && vnode.children.forEach(child => {
                vnode.elm.appendChild(createElm(child));
            });
        }
        // textNode
        else {
            vnode.elm = document.createTextNode(vnode.text) as any as Element;
        }

        // create 钩子
        cbs.create.forEach(hook => hook(emptyVnode, vnode));
        return vnode.elm;
    }

    function patchVNode(oldVnode: VNode, vnode: VNode) {

    }

    return function patch(oldVnode: any, vnode: VNode): VNode {

        // 如果是dom对象，即初始化的时候
        if (!VNode.isVNode(oldVnode)) {
            oldVnode = new VNode(
                (oldVnode as HTMLElement).tagName.toLowerCase(),
                {

                },
                [],
                undefined,
                oldVnode
            );
        }
        // 同步 elm
        // vnode.elm = oldVnode.elm;

        // 比较2个vnode是否是同一个vnode
        if (VNode.isSameVNode(oldVnode, vnode)) {

        }
        // 如果不是同一个vnode
        else {
            let elm = oldVnode.elm as Element;
            createElm(vnode);
            elm.parentNode.insertBefore(vnode.elm, elm);
            elm.parentNode.removeChild(elm);
        }

        return vnode;
    }
}

export default inIt([
    attrsModule, propsModule
]);
