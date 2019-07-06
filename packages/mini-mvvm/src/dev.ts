import './dev.scss';
import MVVM from './core/MVVM';
import { h } from 'mini-vdom';

const vm = new MVVM({
    // el: '#app'
    template: `
    <div id="app" class="todo-list">
        <h2 class="title">Todo List</h2>
        <div class="input-row">
            <input type="text" placeholder="输入要做的事情，回车录入">
        </div>
        <br>
        <div class="input-row">
            <input type="text" disabled placeholder="输入要做的事情，回车录入">
        </div>
        <div class="tab-list">
            <div 
                m-for="(item,index) in tabList" 
                :class=" 'tab-item'+ (activeIndex===index?' active':'') "
                >
                {{ item }}
            </div>
        </div>
        <ul class="list-wrap">
            <li m-for="(item,index) in showList">
                <span class="content"></span>
            </li>
        </ul>
    </div>
    `,
    data() {
        return {
            activeIndex: 0,
            tabList: ['All', 'Todo', 'Done'],
            list: []
        };
    },
    computed: {
        showList() {
            let list = this.list.slice();
            return list
        }
    },

    mounted() {
        console.log('hook mounted invoked');
    },

    watch: {
    }
    // render(h) {
    //     return h('div#app', [
    //         h('span', 'name:'),
    //         h('span', 'tom')
    //     ]);
    // }


});

// vm['name'] = 'lilyth';

vm.$mount('#app');

window['vm'] = vm;

// window['mm'] = new MVVM();
