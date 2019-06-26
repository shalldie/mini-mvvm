import { h, patch } from './index';
import './dev.scss';
import VNode from './lib/VNode';


interface ITodoItem {
    content: string;
    done: boolean;
}

let todoList: ITodoItem[] = [];
let showList: ITodoItem[] = [];
let currentFilter = 0;  // 0-全部 1-已完成 2-未完成

try {
    todoList = JSON.parse(localStorage['todoList']);
}
catch{
    todoList = [
        { content: '买彩票', done: true },
        { content: '中大奖', done: false },
        { content: '走上人生巅峰', done: false }
    ];
}

function renderView(filter: number = currentFilter) {
    currentFilter = filter;
    if (filter === 1) {
        showList = todoList.filter(n => n.done);
    }
    else if (filter === 2) {
        showList = todoList.filter(n => !n.done);
    }
    else {
        showList = todoList;
    }
    render();
    localStorage['todoList'] = JSON.stringify(todoList);
}

const render = (() => {
    let oldNode: any = document.getElementById('app');
    let newNode: VNode = oldNode;

    return function () {
        oldNode = newNode;
        newNode = h('div#app.todo-list', [
            h('h2.title', 'Todo List'),
            h('div.input-row', [
                h('input[type=text][placeholder=请输入要做的事情，回车添加]', {
                    on: {
                        keyup(ev) {
                            if (ev.keyCode === 13) {
                                let target = ev.target as HTMLInputElement;
                                let val = target.value.trim();
                                if (val.length) {
                                    todoList.push({
                                        content: val,
                                        done: false
                                    });
                                    renderView();
                                    target.value = '';
                                }
                            }
                        }
                    }
                })
            ]),
            h('div.tab-list', [
                h('div.tab-item',
                    {
                        attrs: { class: currentFilter === 0 ? 'active' : '' },
                        on: { click: () => renderView(0) }
                    },
                    '全部'),
                h('div.tab-item',
                    {
                        attrs: { class: currentFilter === 1 ? 'active' : '' },
                        on: { click: () => renderView(1) }
                    },
                    '已完成'),
                h('div.tab-item',
                    {
                        attrs: { class: currentFilter === 2 ? 'active' : '' },
                        on: { click: () => renderView(2) }
                    },
                    '未完成')
            ]),
            h('ul.list-wrap', showList.map(item => h(
                'li',
                {
                    key: item.content,
                    attrs: {
                        class: item.done ? 'done' : ''
                    }
                },
                [
                    h('span.content', {
                        on: {
                            click: () => {
                                item.done = !item.done;
                                renderView();
                            }
                        }
                    }, item.content),
                    h('span.del', {
                        on: {
                            click() {
                                let index = todoList.findIndex(n => n === item);
                                todoList.splice(index, 1);
                                renderView();
                            }
                        }
                    }, '删除')
                ]
            )))
        ]);

        patch(oldNode, newNode);
    }
})();

renderView();
