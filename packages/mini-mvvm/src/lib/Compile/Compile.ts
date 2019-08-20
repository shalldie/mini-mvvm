import { ENodeType } from "../../common/enums";
import AST, { parseElement2AST } from "./AST";

const spFn = '__spVnode__';

/**
 * Compile ，用来编译模板
 *
 * @export
 * @class Compile
 */
export default class Compile {

    public static render(template: string): Function {
        return new Compile().render(template);
    }

    public render(template: string): Function {
        const wrap = document.createElement('div');
        wrap.innerHTML = template.trim();

        const node = wrap.children[0];
        const ast = parseElement2AST(node);

        const renderStr = `
var ${spFn} = function(args){
    var r = [];
    args.forEach(function(item){
        if(!item) return;

        if(Object.prototype.toString.call(item) === '[object Array]'){
            item=item.filter(function(n){
                return !!n;
            });
            [].push.apply(r,item);
        }
        else{
            r.push(item);
        }
    });
    return r;
}
with(this) {
    return ${this.ast2Render(ast)};
}
        `;

        if (process.env.NODE_ENV !== 'production') {
            console.log(renderStr);
        }
        return new Function('h', renderStr);
    }

    private ast2Render(ast: AST): string {
        // console.log(ast.type);
        if (ast.type === ENodeType.Text) {
            return this.textAst2Render(ast);
        }
        if (ast.type === ENodeType.Element) {
            return this.eleAst2Render(ast);
        }
        // 理论上不会走到这里来，在生成ast的时候就过滤了
        return null;
    }

    private eleAst2Render(ast: AST): string {

        const attrs = JSON.stringify(ast.attrs)
            .replace(/"\(|\)"/g, ''); // 处理  attr:"((value))"

        const props = JSON.stringify(ast.props)
            .replace(/"\(|\)"/g, ''); // 处理  prop:"((value))"

        const children = ast.children
            .map(n => this.ast2Render(n))
            .filter(n => n)
            .join(',\n'); // 这里用\n是为了调试时候美观 =。=

        const events = Object.keys(ast.events).map(key => {
            return '' +
                `${key}:(function($event){
                    ${ast.events[key].join(';')}
                }).bind(this)`;
        }).join(',');

        const keyStr = ast.key ? `key:${ast.key},` : '';

        const childTpl = (): string => {
            const ifContent = ast.if ? `!(${ast.if})?null:` : '';
            return ifContent +
                `h('${ast.tag}',{
                    ${keyStr}
                    attrs: ${attrs},
                    props:${props},
                    on:{${events}}
                },
                ${spFn}([
                    ${children}
                ])
            )`;
        };

        if (!ast.for) {
            return childTpl();
        }
        else {
            const forIndex = ast.forIndex ? `,${ast.forIndex}` : '';
            return '' +
                `${ast.for}.map(function (${ast.forItem}${forIndex}) {
                    return ${childTpl()}
                })
            `;
        }
    }

    private textAst2Render(ast: AST): string {
        // console.log(ast);
        const content = `'` + ast.text
            .replace(      // 先把文本中的 换行/多个连续空格 替换掉
                /[\r\n\s]+/g,
                ' '
            )
            .replace(
                /'/g, `\\'`
            )
            .replace(      // 再处理依赖 {{ field }}
                /\{\{(.*?)\}\}/g,
                `' + ($1) + '`
            ) + `'`;

        return `h('', ${content})`;
    }

}
