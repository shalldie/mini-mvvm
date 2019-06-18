import { patch, h } from "./lib/vdom";

let node = h('ul', {
    attrs: {
        style: 'color:#fff'
    }
}, [
        h('li', {
            attrs: {
                style: 'color:#f00',
                'data-name': 'tom'
            },
            on: {
                click(ex) {
                    alert((ex.currentTarget as HTMLElement).dataset.name);
                }
            }
        }, [
                h('', 'lalala'),
                h('span', {
                    attrs: {
                        style: 'color:#666;'
                    }
                }, 'this is word')
            ]),
        h('li', {
            attrs: {
                style: 'color:#2ad',
                'data-name': 'lily'
            },
            on: {
                click(ex) {
                    alert((ex.currentTarget as HTMLElement).dataset.name);
                }
            }
        }, [
                h('', 'this is word2')
            ])
    ]);

patch(
    document.getElementById('app'),
    node
);

// console.log(patch);

let newNode = h('ul', {
    attrs: {
        style: 'color:#2ad'
    }
}, [
        h('li', {
            attrs: {
                'id': 'memeda',
                'data-name': 'lalala'
            }
        }, 'this is new 11'),
        h('li', 'this is new 2'),
        h('li', 'this is new 3')
    ]);

// setInterval(() => {
//     patch(node, newNode);
//     newNode = [node, node = newNode][0];
// }, 1000);


setTimeout(() => {
    patch(node, newNode);
    newNode = [node, node = newNode][0];
}, 1000);

setTimeout(() => {
    patch(node, newNode);
    newNode = [node, node = newNode][0];
}, 2000);

var timer = setInterval(() => {
    // console.log('interval');
    // try {
    // patch(node, newNode);
    // newNode = [node, node = newNode][0];
    // }
    // catch (ex) {
    //     clearInterval(timer);
    //     console.log(ex);
    // }
}, 3000);
