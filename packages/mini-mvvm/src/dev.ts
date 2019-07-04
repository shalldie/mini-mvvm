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
        <div class="line">
            {{ cc }}
        </div>
        <div class="line">
            {{ ccc }}
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
    },
    computed: {
        c1() {
            return `${this.person.name}'s`;
        },
        c3() {
            return `is ${this.person.age}`;
        },
        c2() {
            return ' age ';
        },
        cc() {
            return this.c1 + this.c2 + this.c3;
        },
        ccc() {
            return `${this.person.name}: | ${this.cc} | ${this.c1}`;
        }
    },

    created() {
        console.log('hook created invoked');
        console.log(this.person.name);
    },

    beforeMount() {
        console.log('hook beforeMounted');
    },

    mounted() {
        console.log('hook mounted invoked');
    },

    beforeUpdate() {
        console.log('hook before update');
    },

    updated() {
        console.log('hook before updated');
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
