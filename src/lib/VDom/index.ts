import VNode from "./VNode";

function inIt() {

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
        vnode.elm = oldVnode.elm;

        // 比较2个vnode是否是同一个vnode
        if (VNode.isSameVNode(oldVnode, vnode)) {

        }
        // 如果不是同一个vnode
        else {

        }

        return vnode;
    }
}

export default inIt();
