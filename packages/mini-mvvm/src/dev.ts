import './dev.scss';
import MVVM from './core/MVVM';

new MVVM({
    el: '#app',
    render(h) {
        return h('div#app', [
            h('span', 'name:'),
            h('span', 'tom')
        ]);
    }
});
