import VNode from "./VNode";

export const hooks = [
    'create', 'update', 'destroy', 'remove'
];

export type TModuleHookFunc = (oldVnode: VNode, vnode: VNode) => void;

export interface IModuleHook {

    create?: TModuleHookFunc;

    update?: TModuleHookFunc;

    destroy?: TModuleHookFunc;

    remove?: TModuleHookFunc;

}

