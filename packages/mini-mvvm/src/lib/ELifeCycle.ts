import MVVM from '../core/MVVM';

export interface ILifeCycle {
    /**
     * 组件创建成功
     *
     * @memberof ILifeCycle
     */
    created?: () => void;

    /**
     * 将要被插入dom
     *
     * @memberof ILifeCycle
     */
    beforeMount?: () => void;

    /**
     * 组件被添加到dom
     *
     * @memberof ILifeCycle
     */
    mounted?: () => void;

    /**
     * 组件将要更新
     *
     * @memberof ILifeCycle
     */
    beforeUpdate?: () => void;

    /**
     * 组件更新完毕
     *
     * @memberof ILifeCycle
     */
    updated?: () => void;
}

/**
 * 生命周期
 *
 * @enum {number}
 */
enum ELifeCycle {
    /**
     * 创建成功
     */
    created = 'hook:created',

    /**
     * 插入dom之前
     */
    beforeMount = 'hook:beforeMount',

    /**
     * 插入dom
     */
    mounted = 'hook:mounted',

    /**
     * 更新之前
     */
    beforeUpdate = 'hook:beforeUpdate',

    /**
     * 更新完毕
     */
    updated = 'hook:updated'
}

export default ELifeCycle;

/**
 * 给 vm 添加声明周期钩子
 *
 * @export
 * @param {MVVM} vm
 */
export function defineLifeCycle(vm: MVVM): void {
    Object.keys(ELifeCycle).forEach(key => {
        const lifeMethod = vm.$options[key];
        if (!lifeMethod) return;

        vm[key] = lifeMethod.bind(vm);

        vm.$on(ELifeCycle[key], vm[key]);
    });
}
