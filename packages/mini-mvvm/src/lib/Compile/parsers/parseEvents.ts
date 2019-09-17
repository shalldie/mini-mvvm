import AST from '../AST';

export default function parseEvents(ast: AST): void {

    ast.events = ast.events || {};

    for (const key in ast.attrs) {
        if (!/^@/.test(key)) {
            continue;
        }

        /**
        * 对于 @click="handleClick" 这种绑定
        * 修改为 @click="handleClick(@event)"
        *
        * @click="temp=xxx" @click="handleClick(...args)" 就不处理了
        * 这个正则用来表示定义 变量/方法:
        * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_Types#%E5%8F%98%E9%87%8F
        */
        if (/^(($|_)[\w$]*|[\w$]+)$/.test(ast.attrs[key])) {
            ast.attrs[key] += '($event)';
        }

        // 添加到事件
        ast.events[key.slice(1)] = [ast.attrs[key]];
        // 从 attrs 删除事件
        delete ast.attrs[key];

    }

}
