import * as _ from '../utils';
import EventEmitter from '../lib/EventEmitter';


/**
 * 把 static methods，和 instance methods 单独放出来
 *
 * @export
 * @class BaseMVVM
 */
export default class BaseMVVM extends EventEmitter {

    [x: string]: any;

    public static nextTick = _.nextTick;

    public $nextTick = _.nextTick;

}
