import MVVM from './core/MVVM';
import './index.scss';

window['vm'] = new MVVM({
    el: '#root',
    data() {
        return {
            content: '',
            list: [
                { content: '找个女朋友 >_<#@!', done: false },
                { content: '中彩票 0_o', done: false }
            ],
            filters: ['All', 'Todos', 'Dones'],
            filterIndex: 0
        };
    },
    computed: {
        // 显示的tab
        computedFilters() {
            var list = this.filters.slice();
            list[this.filterIndex] = '*** ' + list[this.filterIndex] + ' ***';
            return list;
        },
        // 当前tab对应的数据
        infos() {
            var filterIndex = this.filterIndex;
            var list = this.list.map(function (item, index) {
                item.index = index;
                if (item.done) {
                    return {
                        index: index,
                        content: '--- ' + item.content + ' ---',
                        done: item.done
                    };
                }
                return item;
            });

            if (filterIndex === 0) {
                return list;
            }
            else if (filterIndex === 1) {
                return list.filter(function (item) {
                    return !item.done;
                });
            }
            else {
                return list.filter(function (item) {
                    return item.done;
                });
            }
        }
    },
    methods: {
        changeFilter(index) {
            this.filterIndex = index;
        },
        addItem() {
            this.list.push({
                content: this.content,
                done: false
            });
            this.content = '';
        },
        toggleDone(index) {
            this.list[index].done = !this.list[index].done;
            this.list = this.list.slice();
        },
        deleteItem(index) {
            this.list.splice(index, 1);
        },
        reset() {
            Object.assign(this.$data, this.$options.data());
        }
    }
});
