/**
 * 测试 hook
 * @jest-environment jsdom
 */

import { h, patch } from '../src';

describe('测试 hook', () => {

    let dom: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>'
        dom = document.getElementById('app');
    });

    test('hook: create', () => {
        expect(dom.parentNode).toBe(document.body);
        const vnode = h('div', {
            hook: {
                create() {
                    expect(vnode.elm.tagName).toBe('DIV'); // 这个是测试生成了dom节点
                    expect(vnode.elm.parentNode).toBe(null);
                }
            }
        });
        patch(dom, vnode);
    });

    test('hook: insert', () => {
        expect(dom.parentNode).toBe(document.body);
        const vnode = h('div', {
            hook: {
                insert() {
                    expect(dom.parentNode).toBe(document.body);
                }
            }
        });
        patch(dom, vnode);
    });

    test('hook: update', () => {
        const mockFn = jest.fn();

        const vnode = h('div');
        patch(dom, vnode);

        const newVnode = h('div', {
            hook: {
                create: mockFn, // 这俩不触发，因为复用了
                insert: mockFn,
                update() {
                    mockFn('update');
                },
                destroy: mockFn
            }
        });
        patch(vnode, newVnode);

        expect(mockFn).toBeCalledTimes(1);
        expect(mockFn).toBeCalledWith('update');
    });

    test('hook: destroy', () => {
        const mockFn = jest.fn();

        const vnode = h('span', {
            hook: {
                destroy: mockFn
            }
        });
        patch(dom, vnode);

        const newVnode = h('div');
        patch(vnode, newVnode);

        expect(mockFn).toBeCalledTimes(1);
    });

    test('hook: create, insert, update, destroy', async () => {
        const mockFn = jest.fn();
        expect(dom.parentNode).toBe(document.body);
        const vnode = h('div', {
            hook: {
                create() {
                    mockFn();

                    expect(vnode.elm.tagName).toBe('DIV'); // 这个是测试生成了dom节点
                    expect(vnode.elm.parentNode).toBe(null);
                },
                insert() {
                    mockFn();
                    // 因为是直接节点，所以不用nexttick，实际项目中需要nexttick
                    expect(vnode.elm.parentNode).toBe(document.body);
                }
            }
        });
        patch(dom, vnode);
        expect(mockFn).toBeCalledTimes(2);

        const newVnode = h('div', {
            hook: {
                create: mockFn,
                insert: mockFn,
                update: mockFn, // 只有这个触发，因为复用了
                destroy: mockFn
            }
        });

        patch(vnode, newVnode);
        expect(mockFn).toBeCalledTimes(3);

        patch(newVnode, h('span'));
        expect(mockFn).toBeCalledTimes(4);

    });
});
