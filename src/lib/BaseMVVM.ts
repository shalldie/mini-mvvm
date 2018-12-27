import * as _ from '../utils';
import EventEmitter from './EventEmitter'


/**
 * 把 static methods，和 instance methods 单独放出来
 *
 * @export
 * @class BaseMVVM
 */
export default class BaseMVVM {

    public static nextTick = _.nextTick;

    public $nextTick = _.nextTick;

    private _emitter = new EventEmitter();

    public $on(event: string, fn: Function) {
        this._emitter.on(event, fn);
    }

    public $emit(event: string, ...args: any[]) {
        this._emitter.emit(event, ...args);
    }
}
