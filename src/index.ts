import MVVM from './core/MVVM';

window['vm'] = new MVVM({
    el: '#root',
    data() {
        return {
            person: {
                name: '凯瑟琳',
                age: 16
            }
        };
    },
    computed: {
        showAge() {
            if (this.person.age > 30) {
                return '秘密 >_<#@!';
            }
            return this.person.age;
        },
        doubleAge() {
            return this.person.age * 2;
        },
        over30() {
            return this.person.age > 30;
        }
    },
    methods: {
        reset() {
            Object.assign(this.$data, this.$options.data());
        }
    }
});
