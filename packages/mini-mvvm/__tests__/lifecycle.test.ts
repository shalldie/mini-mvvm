/**
 * 生命周期
 * @jest-environment jsdom
 */
import MVVM from '../src/core/MVVM';

describe('life cycle', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
    });

    test('created、mounted、beforeUpdate、updated', () => {
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
            }
        });

        return new Promise(resolve => {
            // 第一个 nexttick 是为了在mounted之后再修改
            MVVM.nextTick(() => {
                vm['name'] = 'lily';
                MVVM.nextTick(resolve);
            });
        });
    });
});
