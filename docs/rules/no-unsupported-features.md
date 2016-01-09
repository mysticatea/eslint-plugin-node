# Disallow unsupported ECMAScript features on the specified version (no-unsupported-features)

Node.js v0.12, v4, and v5 don't support all ECMAScript 2015 (ES6) features.
This rule reports when you used unsupported ECMAScript 2015 features on the specified Node version.

## Rule Details

**This rule expects to be used with `"env": {"es6": true}` configuration.**

This rule requires to specify a Node version always.
For Example:

```json
{
    "node/no-unsupported-features": [2, {"version": 4}]
}
```

This rule accepts the following version number:

- `0.10`
- `0.12`
- `4`
- `5`

The following patterns are considered problems:

```js
/*eslint node/no-unsupported-features: [2, {version: 4}]*/
/*eslint-env es6*/

function foo(a = 1) {  /*error Default Parameters are not supported yet on Node v4.*/
    //...
}

function foo(...a) {   /*error Rest Parameters are not supported yet on Node v4.*/
    //...
}

var a = [...b];        /*error Spread Operators are not supported yet on Node v4.*/
var a = /foo/y;        /*error RegExp "y" Flags are not supported yet on Node v4.*/
var a = /foo/u;        /*error RegExp "u" Flags are not supported yet on Node v4.*/
var {a, b} = c;        /*error Destructuring are not supported yet on Node v4.*/
var {a, b} = c;        /*error Destructuring are not supported yet on Node v4.*/

let a = 1;             /*error "let" Declarations in non-strict mode are not supported yet on Node v4.*/
const a = 1;           /*error "const" Declarations in non-strict mode are not supported yet on Node v4.*/
class A {}             /*error Classes in non-strict mode are not supported yet on Node v4.*/

if (a) {
    function foo() {   /*error Block-Scoped Functions in non-strict mode are not supported yet on Node v4.*/
        //...
    }
}

var p = new Proxy(o, { /*error Proxy is not supported yet on Node v4.*/
    //...
});
```

The following patterns are considered not problems:

```js
/*eslint node/no-unsupported-features: [2, {version: 4}]*/
/*eslint-env es6*/

for (var a of list) {
    //...
}

var a = `hello, ${world}!`;

function foo() {
    "use strict";

    let a = 1;
    const b = 2;

    class A {
        //...
    }

    if (c) {
        function bar() {
            //...
        }
    }
}

var p = new Promise((resolve, reject) => {
    //...
});
```

### Options

This rule has `"ignores"` option to ignore to use the specified features.

```json
{
    "node/no-unsupported-features": [2, {"version": 4, "ignores": []}]
}
```

Features which are specified by this `"ignores"` option are not warned.
This `"ignores"` option accepts the following strings.

- `"defaultParameters"`
- `"restParameters"`
- `"spreadOperators"`
- `"objectLiteralExtensions"`
- `"forOf"`
- `"binaryNumberLiterals"`
- `"octalNumberLiterals"`
- `"templateStrings"`
- `"regexpY"`
- `"regexpU"`
- `"destructuring"`
- `"unicodeCodePointEscapes"`
- `"newTarget"`
- `"const"`
- `"let"`
- `"blockScopedFunctions"`
- `"arrowFunctions"`
- `"generatorFunctions"`
- `"classes"`
- `"typedArrays"`
- `"mapSet"`
- `"weakMapSet"`
- `"proxy"`
- `"reflect"`
- `"promise"`
- `"symbol"`
- `"modules"`

The following patterns are considered not problems when it's using `"ignores"`:

```js
/*eslint node/no-unsupported-features: [2, {version: 4, ignores: ["defaultParameters"]}]*/
/*eslint-env es6*/

function foo(a = 1) {
    //...
}
```

## When Not To Use It

If you don't want to restrict features, then it's safe to disable this rule.

## Further Reading

- http://kangax.github.io/compat-table/es6/
