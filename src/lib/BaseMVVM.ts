import * as _ from '../utils';


/**
 * 把 static methods，和 instance methods 单独放出来
 *
 * @export
 * @class BaseMVVM
 */
export default class BaseMVVM {

    public static nextTick = _.nextTick;

    public $nextTick = _.nextTick;
}
