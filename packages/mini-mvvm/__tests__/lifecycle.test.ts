/**
 * 生命周期
 * @jest-environment jsdom
 */
import MVVM from '../src/core/MVVM';

describe('life cycle', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
    });

    test('执行顺序 与 执行时机： created、mounted、beforeUpdate、updated', async () => {
        const mockFn = jest.fn();

        const vm = new MVVM({
            $el: '#app',
            template: `
            <div id="app">
                {{ name }}
            </div>`,
            data() {
                return {
                    name: 'tom'
                };
            },
            created() {
                expect(this.$el).toBeUndefined();
            },
            mounted() {
                expect(!!this.$el).toBeTruthy();
                // console.log(this.$el);
                expect(this.$el.parentNode).toBe(document.body);
            },
            beforeUpdate() {
                expect(this.$el.textContent.trim()).toBe('tom');
            },
            updated() {
                expect(this.$el.textContent.trim()).toBe('lily');
                mockFn();
            }
        });

        // 等待 mounted
        await MVVM.nextTick();
        expect(mockFn).toBeCalledTimes(0);

        vm['name'] = 'lily';

        await MVVM.nextTick();
        expect(mockFn).toBeCalledTimes(1);
    });

    test('多次改变数据，只会触发一次 rerender', async () => {
        const mockFn = jest.fn();

        const vm = new MVVM({
            $el: '#app',
            template: `
            <div id="app">
                {{ name }}
            </div>`,
            data() {
                return {
                    name: 'tom'
                };
            },
            updated() {
                mockFn();
            }
        });

        // 先等待 mounted
        await MVVM.nextTick();

        // 只有 updated 的时候才会 rerender
        expect(mockFn).toBeCalledTimes(0);

        for (let i = 0; i < 10; i++) {
            vm['name'] = i;
        }

        // 只有 nextTick 才会更新
        expect(mockFn).toBeCalledTimes(0);
        await MVVM.nextTick();
        // 同一个 tick 改变多次数据，只会更新一次
        expect(mockFn).toBeCalledTimes(1);

        vm['name'] = 'tom';
        await MVVM.nextTick();
        expect(mockFn).toBeCalledTimes(2);
    });
});
