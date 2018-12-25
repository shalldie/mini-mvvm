// https://github.com/DMQ/mvvm

// import './index.scss';
document.body.innerHTML = '<h2>hello worldd</h2>';

import EventEmitter from './lib/EventEmitter';

const emitter = new EventEmitter();

emitter.on('hello', name => console.log(name));

emitter.emit('hello', 'tom');

// console.log('hello world');
