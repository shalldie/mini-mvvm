import './dev.scss';
import MVVM from './core/MVVM';
import { h } from 'mini-vdom';

const vm = new MVVM({
    // el: '#app'
    template: `
    <div id="app">
        <span>name: {{ name }}</span>
        <span>tom</span>
    </div>
    `,
    data() {
        return {
            memeda: 'hhh'
        };
    }
    // render(h) {
    //     return h('div#app', [
    //         h('span', 'name:'),
    //         h('span', 'tom')
    //     ]);
    // }


});

vm['name'] = 'lilyth';

vm.$mount('#app');

window['vm'] = vm;
