import h from "./lib/VDom/h";
import patch from "./lib/VDom";

const node = h('ul', [
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

console.log(node.elm);
