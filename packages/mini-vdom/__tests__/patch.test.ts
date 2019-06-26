/**
 * 测试 渲染 结果,patch
 * @jest-environment jsdom
 */

import { h, patch } from '../src';

describe('function patch', () => {

    let dom: HTMLElement;

    function getNode(): HTMLElement {
        return [].slice.call(document.body.children).slice(-1)[0];
    }

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>'
        dom = document.getElementById('app');
    });

    test('初始化，patch dom', () => {

        const vnode = h('span', 'lalala');
        patch(dom, vnode);

        const node = getNode();
        expect(node.tagName).toBe('SPAN');

        expect(node.textContent).toBe('lalala');

    });

    test('attrs', () => {
        const vnode = h('div', {
            attrs: {
                'data-name': 'tom',
                'class': 'class'
            }
        }, 'lalala');
        patch(dom, vnode);

        const node = getNode();
        expect(node.dataset.name).toBe('tom');
        expect(node.className).toBe('class');
    });

    test('attrs update', () => {
        const vnode = h('div', {
            attrs: {
                'data-name': 'lily'
            }
        }, 'lalala');

        patch(dom, vnode);

        const newVnode = h('div', {
            attrs: {
                'data-name': 'tom',
                'class': 'class'
            }
        }, 'lalala');

        patch(vnode, newVnode);

        const node = getNode();
        expect(node.dataset.name).toBe('tom');
        expect(node.className).toBe('class');
    });

    test('props', () => {
        const vnode = h('input', {
            props: {
                type: 'checkbox',
                checked: true
            }
        });
        patch(dom, vnode);

        const node = getNode() as HTMLInputElement;
        expect(node.type).toBe('checkbox');
        expect(node.checked).toBe(true);
        node.click();
        expect(node.checked).toBe(false);
    });

    test('props update', () => {
        const vnode = h('input', {
            props: {
                type: 'checkbox',
                checked: false
            }
        });
        patch(dom, vnode);

        const newVnode = h('input', {
            props: {
                type: 'checkbox',
                checked: true
            }
        });
        patch(vnode, newVnode);

        const node = getNode() as HTMLInputElement;
        expect(node.type).toBe('checkbox');
        expect(node.checked).toBe(true);
        node.click();
        expect(node.checked).toBe(false);
    });

    test('events', () => {
        const mockFn = jest.fn();
        const vnode = h('div', { on: { click: mockFn } }, [
            h('input', { on: { focus: mockFn } })
        ]);
        patch(dom, vnode);

        const node = getNode();

        expect(mockFn).toBeCalledTimes(0);
        node.click();
        expect(mockFn).toBeCalledTimes(1);
        node.querySelector('input').focus();
        expect(mockFn).toBeCalledTimes(2);
    });

    test('events update', () => {
        const mockFn = jest.fn();
        const vnode = h('div', { on: { click: mockFn } });
        patch(dom, vnode);

        const newVnode = h('div', [
            h('input', { on: { focus: mockFn } })
        ]);
        patch(vnode, newVnode);

        const node = getNode();

        expect(mockFn).toBeCalledTimes(0);
        node.click();
        expect(mockFn).toBeCalledTimes(0);
        node.querySelector('input').focus();
        expect(mockFn).toBeCalledTimes(1);
    });

});
