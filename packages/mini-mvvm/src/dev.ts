import './dev.scss';
import MVVM from './core/MVVM';
import { h } from 'mini-vdom';

new MVVM({
    // el: '#app'
    template: `
    <div id="app">
        <span>name:</span>
        <span>tom</span>
    </div>
    `,
    // render(h) {
    //     return h('div#app', [
    //         h('span', 'name:'),
    //         h('span', 'tom')
    //     ]);
    // }


}).$mount('#app');
