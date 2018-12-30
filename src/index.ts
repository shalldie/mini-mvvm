import MVVM from './core/MVVM';

export default MVVM;

window['vm'] = new MVVM({
    el: '#root',
    data() {
        return {
            person: {
                name: 'tom',
                age: 12
            },
            cmStyle: 'color:red;',
            cmClass: 'cm-classxx'
        };
    },
    computed: {
        message() {
            return `the person's name is ${this.person.name},
            and his age is ${this.person.age}`;
        },
        info() {
            return `${this.person.name}'s age is ${this.person.age}`;
        },
        info2() {
            return 'the info is: ' + this.info;
        }
    },
    methods: {
        sayHello() {
            const name = Array.apply(null, Array(4)).map(() => {
                return String.fromCharCode(~~(Math.random() * 25 + 65));
            }).join('');
            this.person = {
                name,
                age: ~~(Math.random() * 50)
            };
        }
    }
});
