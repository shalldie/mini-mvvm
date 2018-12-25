// https://github.com/DMQ/mvvm

// import './index.scss';
// document.body.innerHTML='<h2>hello world</h2>';

import Callback from './lib/Callback';

const callback = new Callback();

callback.add(n => console.log(n));

callback.fire('hello');
