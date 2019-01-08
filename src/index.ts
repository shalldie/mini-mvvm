import MVVM from './core/MVVM';
import './index.scss';
import { V4MAPPED } from 'dns';

window['vm'] = new MVVM({
    el: '#root',
    data() {
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
        list() {
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
    created() {
        this.restore();
    },
    methods: {
        getTabClass(index) {
            return index === this.filterIndex ? 'tab active' : 'tab';
        },
        getListItemClass(item) {
            return item && item.done ? 'done' : '';
        },
        changeFilter(index) {
            this.filterIndex = index;
        },
        addItem() {
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
        toggleDone(item) {
            item.done = !item.done;
            this.infos = this.infos.slice();
        },
        deleteItem(item) {
            const index = this.infos.indexOf(item);
            this.infos.splice(index, 1);
        },
        reset() {
            Object.assign(this.$data, this.$options.data());
        },
        save() {
            var content = JSON.stringify(this.infos);
            localStorage['_cache_'] = content;
        },
        restore() {
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
        infos() {
            this.save();
        }
    }
});
