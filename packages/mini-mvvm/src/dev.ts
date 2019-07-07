import './dev.scss';
import MVVM from './core/MVVM';
import { h } from 'mini-vdom';

const vm = new MVVM({
    el: '#app',
    template: `
    <div id="app" class="todo-list">
        <h2 class="title">Todo List</h2>
        <div class="input-row">
            <input m-model="todo" :disabled="disabled" @input="handleInput" type="text" placeholder="输入要做的事情，回车录入">
        </div>
        <br>
        <div class="input-row">
            {{ reverse }}
        </div>
        <div class="input-row">
            <label>
                <input :checked="checked" @change="handleCheckedChange" type="checkbox">
                <span>展示下方内容</span>
            </label>
        </div>
        <div m-if="checked" class="tab-list" key="list">
            <div 
                m-for="(item,index) in tabList" 
                :class=" 'tab-item'+ (activeIndex===index?' active':'') "
                @click="activeIndex=index"
                >
                {{ item }}
            </div>
        </div>
        <ul class="list-wrap" key="memeda">
            <li m-for="(item,index) in showList">
                <span class="content"></span>
            </li>
        </ul>
    </div>
    `,
    data() {
        return {
            activeIndex: 0,
            disabled: false,
            checked: true,
            todo: 'default todo',
            tabList: ['All', 'Todo', 'Done'],
            list: []
        };
    },
    computed: {
        showList() {
            let list = this.list.slice();
            if (this.activeIndex === 0) {
                return list;
            }
            else if (this.activeIndex === 1) {
                return list;
            }
            return list;
        },
        reverse() {
            return this.todo.split('').reverse().join('');
        }
    },

    mounted() {
        console.log('hook mounted invoked');
    },

    methods: {
        handleInput($event: Event) {
            console.log(($event.target as HTMLInputElement).value);
        },
        handleCheckedChange($event: Event) {
            this.checked = ($event.target as HTMLInputElement).checked;
        }
    },

    watch: {
        activeIndex(index, oldIndex) {
            console.log(`${oldIndex} => ${index}`);
        }
    }
    // render(h) {
    //     return h('div#app', [
    //         h('span', 'name:'),
    //         h('span', 'tom')
    //     ]);
    // }


});

window['vm'] = vm;

// window['mm'] = new MVVM();
