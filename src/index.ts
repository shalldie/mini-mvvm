/**
 * 该文件是开发环境入口，打包入口在 `src/core/MVVM.ts`
 * 因为粘贴到demo的html方便，所以用 es5 语法
 *
 * @file index.ts
 * @author https://github.com/shalldie
 */

import MVVM from './core/MVVM';
import './index.scss';

window['vm'] = new MVVM({
    el: '#root',
    data: function () {
        return {
            content: '',
            infos: [
                { content: '中一次双色球，十注的 >_<#@!', done: false },
                { content: '然后再中一次体彩，还是十注的 0_o', done: false },
                { content: '我全都要 😂 🌚 🤣 💅 👅 🤠 ', done: false }
            ],
            filters: ['All', 'Todos', 'Dones'],
            filterIndex: 0
        };
    },
    computed: {
        // 当前tab对应的数据
        list: function () {
            var filterIndex = this.filterIndex;
            var list = this.infos;

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
    created: function () {
        this.restore();
    },
    methods: {
        // 获取tab的class
        getTabClass: function (index) {
            return index === this.filterIndex ? 'tab active' : 'tab';
        },
        // 获取listItem的class
        getListItemClass: function (item) {
            return item && item.done ? 'done' : '';
        },
        // 改变过滤条件
        changeFilter: function (index) {
            this.filterIndex = index;
        },
        // 新增一项
        addItem: function () {
            var content = this.content.trim();
            if (!content.length) {
                return;
            }
            this.infos.push({
                content: content,
                done: false
            });
            this.content = '';
        },
        // 切换完成状态
        toggleDone: function (item) {
            item.done = !item.done;
            this.infos = this.infos.slice();
        },
        // 删除一项
        deleteItem: function (item) {
            var index = this.infos.indexOf(item);
            this.infos.splice(index, 1);
        },
        // 重置数据
        reset: function () {
            Object.assign(this.$data, this.$options.data());
        },
        // 从localstorage更新数据
        restore: function () {
            try {
                var content = localStorage['_cache_'];
                if (!content.length) {
                    return;
                }
                var infos = JSON.parse(content);
                this.infos = infos;
            }
            catch (ex) {
                this.reset();
            }
        }
    },
    watch: {
        // 监听infos改变，存入localstorage
        infos: function () {
            var content = JSON.stringify(this.infos);
            localStorage['_cache_'] = content;
        }
    }
});
