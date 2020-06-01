!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.MiniVdom=e():t.MiniVdom=e()}(window,(function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/dist/",r(r.s=1)}([function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}Object.defineProperty(e,"__esModule",{value:!0});var a=function(){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=arguments.length>2?arguments[2]:void 0,a=arguments.length>3?arguments[3]:void 0,i=arguments.length>4?arguments[4]:void 0;n(this,t),r.hook=r.hook||{},this.type=e,this.data=r,this.children=o,this.text=a,this.elm=i,this.key=r.key}var e,r,a;return e=t,a=[{key:"isVNode",value:function(e){return e instanceof t}},{key:"isSameVNode",value:function(t,e){return t.key===e.key&&t.type===e.type}}],(r=null)&&o(e.prototype,r),a&&o(e,a),t}();e.default=a},function(t,e,r){"use strict";var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),e.VNode=e.patch=e.h=void 0;var o=n(r(2));e.patch=o.default;var a=n(r(7));e.h=a.default;var i=n(r(0));e.VNode=i.default,e.default={patch:o.default,h:a.default,VNode:i.default}},function(t,e,r){"use strict";function n(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,l=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return u=t.done,t},e:function(t){l=!0,i=t},f:function(){try{u||null==r.return||r.return()}finally{if(l)throw i}}}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var a=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var i=a(r(0)),u=a(r(3)),l=a(r(4)),f=a(r(5)),c=r(6),d=new i.default("");e.default=function(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],r={create:[],insert:[],update:[],destroy:[],remove:[]},o=n(e);try{var a=function(){var e=t.value;c.hooks.forEach((function(t){return e[t]&&r[t].push(e[t])}))};for(o.s();!(t=o.n()).done;)a()}catch(t){o.e(t)}finally{o.f()}function u(t){return"!"===t.type?t.elm=document.createComment(t.text):t.type?(t.elm=t.data.ns?document.createElementNS(t.data.ns,t.type):document.createElement(t.type),t.children&&t.children.forEach((function(e){t.elm.appendChild(u(e))})),t.text&&t.text.length&&t.elm.appendChild(document.createTextNode(t.text))):t.elm=document.createTextNode(t.text),r.create.forEach((function(e){return e(d,t)})),t.data.hook.create&&t.data.hook.create(),t.elm}function l(t,e,n){for(var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:n.length-1,i=function(){var a=n[o];t.insertBefore(u(a),e),r.insert.forEach((function(t){return t(d,a)})),a.data.hook.insert&&a.data.hook.insert()};o<=a;o++)i()}function f(t,e){for(var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:e.length-1,a=function(){var o=e[n];t&&t.removeChild(o.elm),r.destroy.forEach((function(t){return t(o,d)})),o.data.hook.destroy&&o.data.hook.destroy()};n<=o;n++)a()}function s(t,e,r){for(var n=e.slice(),o=function(e){var o=r[e],a=n.findIndex((function(t){return t&&i.default.isSameVNode(t,o)}));if(~a){var u=n[a];n[a]=void 0,a!==e&&t.insertBefore(u.elm,t.children[e+1]),p(u,o)}else l(t,t.children[e+1],[o])},a=0;a<r.length;a++)o(a);var u=n.filter((function(t){return!!t}));u.length&&f(t,u)}function p(t,e){var n=e.elm=t.elm,o=t.children,a=e.children;t!==e&&(void 0===e.text||e.text===t.text?(o&&a?o!==a&&s(n,o,a):a?(t.text&&(n.textContent=""),l(n,null,a)):o?(f(n,o),e.text&&(n.textContent=e.text)):t.text!==e.text&&(n.textContent=e.text),r.update.forEach((function(r){return r(t,e)})),e.data.hook.update&&e.data.hook.update()):n.textContent=e.text)}function v(t,e){if(i.default.isVNode(t)||(t=new i.default("",{},[],void 0,t)),i.default.isSameVNode(t,e))p(t,e);else{var n=t.elm;l(n.parentNode,n,[e]),f(n.parentNode,[t]),r.insert.forEach((function(r){return r(t,e)}))}return e}return v}([u.default,l.default,f.default])},function(t,e,r){"use strict";function n(t,e){var r=t.data.attrs,n=e.data.attrs,o=e.elm;if((r||n)&&r!==n){for(var a in r=r||{},n=n||{}){var i=n[a];i!==r[a]&&o.setAttribute(a,i+"")}for(var u in r)u in n||o.removeAttribute(u)}}Object.defineProperty(e,"__esModule",{value:!0}),e.attrsModule=e.updateAttrs=void 0,e.updateAttrs=n,e.attrsModule={create:n,update:n},e.default=e.attrsModule},function(t,e,r){"use strict";function n(t,e){var r=t.data.props,n=e.data.props,o=e.elm;if((r||n)&&r!==n){for(var a in n=n||{},r=r||{})n[a]||delete o[a];for(var i in n)n[i]!==r[i]&&(o[i]=n[i])}}Object.defineProperty(e,"__esModule",{value:!0}),e.propsModule=e.updateProp=void 0,e.updateProp=n,e.propsModule={create:n,update:n},e.default=e.propsModule},function(t,e,r){"use strict";function n(t,e){var r=t.data.on,n=t.elm,o=e.data.on,a=e.elm;if(r!==o){if(r)for(var i in r)n.removeEventListener(i,r[i]);if(o)for(var u in o)a.addEventListener(u,o[u])}}Object.defineProperty(e,"__esModule",{value:!0}),e.EventModule=void 0,e.EventModule={create:n,update:n,destroy:n},e.default=e.EventModule},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.hooks=void 0,e.hooks=["create","insert","update","destroy","remove"]},function(t,e,r){"use strict";function n(t){return function(t){if(Array.isArray(t))return o(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var a=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var i=a(r(0)),u=r(8);e.default=function t(e,r,o){var a,l,f,c=u.getType(r),d=u.getType(o);if("object"===c?(a=r,"array"===d?f=o:"string"===d&&(l=o)):"array"===c?f=r:"string"===c&&(l=r),e&&null!=l&&(f=[t("",l)],l=void 0),e.length){a=a||{};var s=e.match(/#([^#\.\[\]]+)/);s&&(a.props=a.props||{},a.props.id=s[1]);var p=u.getMatchList(e,/\.([^#\.\[\]]+)/g).map((function(t){return t[1]}));p.length&&(a.attrs=a.attrs||{},a.attrs.class&&p.push.apply(p,n(a.attrs.class.split(" ").filter((function(t){return t&&t.length})))),a.attrs.class=p.join(" "));var v=u.getMatchList(e,/\[(\S+?)=(\S+?)\]/g);v.length&&(a.attrs=a.attrs||{},v.forEach((function(t){a.attrs[t[1]]=t[2]}))),e=e.replace(/(#|\.|\[)\S*/g,"").toLowerCase().trim()}var h=new i.default(e,a,f,l);return"svg"===h.type&&function t(e){e.type&&(e.data.ns="http://www.w3.org/2000/svg",e.children&&e.children.length&&e.children.forEach((function(e){return t(e)})))}(h),h}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getMatchList=e.getType=void 0,e.getType=function(t){return Object.prototype.toString.call(t).toLowerCase().match(/\s(\S+?)\]/)[1]},e.getMatchList=function(t,e){for(var r,n=[];r=e.exec(t);)n.push([].slice.call(r));return n}}]).default}));