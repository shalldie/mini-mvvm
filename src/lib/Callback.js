
export default class Callback {

    callbacks = [];

    add(fn) {
        this.callbacks.push(fn);
    }

    fire(...args) {
        this.callbacks.forEach(fn => fn(...args));
    }
}
