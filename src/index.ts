// https://github.com/DMQ/mvvm

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
            cmClass: 'cm-classxx',
            message: ''
        };
    },
    methods: {
        sayHello() {
            this.message = `当前时间： ${+new Date}`;
        }
    }
});
