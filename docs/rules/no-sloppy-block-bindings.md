# Disallow block-scoped declarations outside strict mode (no-sloppy-block-bindings)

Node.js 5.x or before don't support block-scoped declarations outside strict mode.

```
$ node -e "let a = 0;"
[eval]:1
let a = 0;
^^^

SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
    at Object.exports.runInThisContext (vm.js:54:16)
    at Object.<anonymous> ([eval]-wrapper:6:22)
    at Module._compile (module.js:399:26)
    at node.js:592:27
    at nextTickCallbackWith0Args (node.js:433:9)
    at process._tickCallback (node.js:362:13)
```

## Rule Details

This rule finds block-scoped declarations outside strict mode, then warns these.

The following patterns are considered problems:

```js
let a = 0;          /*error Block-scoped declarations (let, const, function, class) not yet supported outside strict mode.*/
const b = 0;        /*error Block-scoped declarations (let, const, function, class) not yet supported outside strict mode.*/
class C {}          /*error Block-scoped declarations (let, const, function, class) not yet supported outside strict mode.*/

if (a) {
    function d() {} /*error Block-scoped declarations (let, const, function, class) not yet supported outside strict mode.*/
}
```

The following patterns are considered not problems:

```js
"use strict";

let a = 0;
const b = 0;
class C {}

if (a) {
    function d() {}
}
```

**Node:** In modules, the program is always strict mode.

## When Not To Use It

If you don't want to notify about block-scoped declarations, then it's safe to disable this rule.
