/*eslint-disable*/
import './dev.scss';
import MVVM from './core/MVVM';
// import { h } from 'mini-vdom';

const CACHE_KEY = '__mini-mvvm_cache_key__';

const vm = new MVVM({
    $el: '#app',
    template: `
    <div id="root">
        <h2>
            <a href="https://github.com/shalldie/mini-mvvm" target="_blank">mini-mvvm</a>
            <span>- 功能演示</span>
            <button @click="reset">重置所有</button>
        </h2>
        <div class="list-tab">
            <div
                @click="activeIndex=index"
                m-for="(item,index) in tabList"
                :class=" activeIndex===index?'tab active':'tab' "
            >{{ item }}</div>
        </div>
        <div class="tab-page">
            <div m-if="activeIndex === 0" class="page-item">
                <h4>双向绑定（m-model）：</h4>
                <ul class="list">
                    <li class="list-item">
                        <span class="label">姓名：</span>
                        <input m-model="person.name" type="text" />
                    </li>
                    <li class="list-item">
                        <span class="label">年龄：</span>
                        <input m-model="person.age" type="number" />
                    </li>
                    <li class="list-item">
                        <span class="label">性别：</span>
                        <select m-model="person.sex">
                            <option value="男">男</option>
                            <option value="女">女</option>
                        </select>
                    </li>
                    <li class="list-item">
                        <p> 姓名：{{ person.name }}，年龄：{{ person.age }}，性别：{{ person.sex }} </p>
                    </li>
                </ul>
            </div>
            <div m-if="activeIndex===1" class="page-item">
                <h4>计算属性（computed）：</h4>
                <ul class="list">
                    <li class="list-item">
                        <p>{{ computedDescription }}</p>
                    </li>
                </ul>
            </div>
            <div m-if="activeIndex===2" class="page-item">
                <h4>条件渲染（m-if）</h4>
                <ul class="list">
                    <li class="list-item">
                        <label>
                            <input :checked="showText" @change="showText=$event.target.checked" type="checkbox" />
                            <span>点我 &gt;_&lt;#@! 显示下文：</span>
                        </label>
                    </li>
                    <li m-if="showText" class="list-item">
                        噼里啪啦噼里啪啦噼里啪啦噼里啪啦噼里啪啦
                    </li>
                </ul>
            </div>
            <div m-if="activeIndex===3" class="page-item">
                <h4>循环（m-for），嵌套for循环，99乘法表（尝试点击）：</h4>
                <table class="for-table">
                    <tbody>
                        <tr m-for="row in forTable">
                            <td
                                @click="item && alert(item)"
                                m-for="item in row"
                            >
                                {{ item }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div m-if="activeIndex===4" class="page-item todo-list">
                <h2>Todo List</h2>
                <p>watch了list，任何操作都会保存在localstorage</p>
                <div class="input-box">
                    <input
                        @keyup="handleKeyup"
                        m-model="content"
                        type="text"
                        placeholder="Enter plan to save."
                    >
                    <button @click="addItem" type="button">Add</button>
                </div>
                <div class="list-tab">
                    <div
                        @click="filterIndex=index"
                        m-for="(item,index) in filters"
                        :class="index===filterIndex?'tab active': 'tab' "
                    >
                        {{ item }}
                    </div>
                </div>
                <ul class="item-list">
                    <li
                        m-for="(item,index) in list"
                        :class="item.done?'done':'' "
                        :data-content="item.content"
                        :key="item.content"
                    >
                        <div @click="toggleDone(item)" class="text">
                            {{ item.content }}
                        </div>
                        <div @click="deleteItem(item)" class="del">Del</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            activeIndex: 0,
            tabList: ['双向绑定', '计算属性', '条件渲染', '循环/事件', 'Todo List'],
            // 双绑
            person: {
                name: '花泽香菜',
                age: 12,
                sex: '女'
            },

            // m-if
            showText: false,

            // m-for
            forTable: [],

            // todoList
            content: '',
            infos: [
                {
                    content: '中一次双色球，十注的 >_<#@!',
                    done: true
                },
                {
                    content: '然后再中一次体彩，还是十注的 0_o',
                    done: false
                },
                {
                    content: '我全都要 😂 🌚 🤣 💅 👅 🤠 ',
                    done: false
                }
            ],
            filters: ['All', 'Todos', 'Dones'],
            filterIndex: 0
        };
    },
    computed: {
        computedDescription() {
            return `${this.person.name}的年龄是${this.person.age}，然后是个${this.person.sex}的`;
        },

        // 当前tab对应的数据
        list() {
            switch (this.filterIndex) {
                case 0:
                    return this.infos;
                case 1:
                    return this.infos.filter(n => !n.done);
                default:
                    return this.infos.filter(n => n.done);
            }
        }
    },
    created() {
        this.init99();

        // todolist
        this.restore();
    },

    methods: {
        // 99 乘法表初始化
        init99() {
            // 构建99乘法表
            const result = [];
            for (let y = 1; y <= 9; y++) {
                const list = [];
                for (let x = 1; x <= 9; x++) {
                    if (x > y) list.push('');
                    else list.push(x + ' * ' + y + ' = ' + x * y);
                }
                result.push(list);
            }
            this.forTable = result;
        },

        //todolist 相关

        // 新增一项
        addItem() {
            const content = this.content.trim();
            if (!content.length) {
                return;
            }
            this.infos.push({
                content: content,
                done: false
            });
            this.content = '';
        },

        handleKeyup(ev: KeyboardEvent) {
            if (ev.keyCode === 13) {
                this.addItem();
            }
        },

        // 切换完成状态
        toggleDone(item) {
            item.done = !item.done;
            this.infos = this.infos.slice();
        },

        // 删除一项
        deleteItem(item) {
            const index = this.infos.indexOf(item);
            this.infos.splice(index, 1);
        },

        // 重置数据
        reset() {
            Object.assign(this.$data, this.$options.data());
            this.init99();
        },

        // 从localstorage更新数据
        restore() {
            try {
                const content = localStorage[CACHE_KEY];
                if (!content.length) {
                    return;
                }
                const infos = JSON.parse(content);
                this.infos = infos;
            } catch (ex) {
                this.reset();
            }
        }
    },
    watch: {
        // 监听infos改变，存入localstorage
        infos() {
            const content = JSON.stringify(this.infos);
            localStorage[CACHE_KEY] = content;
        }
    }
});

window['vm'] = vm;

// window['mm'] = new MVVM();
