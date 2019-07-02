import './dev.scss';
import MVVM from './core/MVVM';
import { h } from 'mini-vdom';

const vm = new MVVM({
    // el: '#app'
    template: `
    <div id="app">
        <div class="line">
            <span>name:</span>
            <span>{{ person.name }}</span>
        </div>
        <div class="line">
            <span>age:</span>
            <span>{{ person.age }}</span>
        </div>
    </div>
    `,
    data() {
        return {
            person: {
                name: 'tom',
                age: 12
            }
        };
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
