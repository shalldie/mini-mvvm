/**
 * 测试 h 函数
 */
import { h } from '../src';

describe('function h', () => {

    test('h(type: string, text?: string)', () => {
        const vnode = h('span', 'hello');
        expect(vnode.type).toBe('span');
        expect(vnode.children[0].text).toBe('hello');
    });

    test('h(type: string, children?: VNode[])', () => {
        const vnode = h('div#id.class1', [
            h('span[name=tom]')
        ]);

        expect(vnode.type).toBe('div');
        expect(vnode.data.attrs.class).toBe('class1');
        expect(vnode.children).toHaveLength(1);
        expect(vnode.children[0].data.attrs.name).toBe('tom');
    });

    test('h(type: string, data?: IVNodeData, text?: string)', () => {
        const vnode = h('div.hello', {
            attrs: {
                'data-name': 'tom'
            }
        }, 'world');

        expect(vnode.type).toBe('div');
        expect(vnode.data.attrs.class).toBe('hello');
        expect(vnode.data.attrs['data-name']).toBe('tom');
        expect(vnode.children).toHaveLength(1);
        expect(vnode.children[0].text).toBe('world');
    });

    test('h(type: string, data?: IVNodeData, children?: VNode[])', () => {
        const vnode = h('div.hello', {}, [
            h('span', 'world')
        ]);

        expect(vnode.type).toBe('div');
        expect(vnode.data.attrs.class).toBe('hello');
        expect(vnode.children).toHaveLength(1);
        expect(vnode.children[0].type).toBe('span');
        expect(vnode.children[0].children[0].text).toBe('world');
    });

});
