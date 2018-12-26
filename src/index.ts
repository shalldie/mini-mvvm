// https://github.com/DMQ/mvvm

// import './index.scss';
document.body.innerHTML = '<h2>hello worldd</h2>';

import EventEmitter from './lib/EventEmitter';

const emitter = new EventEmitter();

emitter.on('hello', name => console.log(name));

emitter.once('hello', name => console.log('once ' + name));

emitter.emit('hello', 'tom');
emitter.emit('hello', 'lily');

// console.log('hello world');
