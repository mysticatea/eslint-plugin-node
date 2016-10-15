# Disallow unsupported ECMAScript features on the specified version (no-unsupported-features)

Node.js v0.12, v4, and v5 don't support all ECMAScript 2015 (ES6) features.
This rule reports when you used unsupported ECMAScript 2015 features on the specified Node version.

## Rule Details

**This rule expects to be used with `"env": {"es6": true}` configuration.**

This rule requires a Node version.
For Example:

```json
{
    "node/no-unsupported-features": ["error", {"version": 4}]
}
```

This rule accepts the following version number:

- `0.10`
- `0.12`
- `4`
- `5`
- `6`

If the version was omitted, this rule will read the [engines](https://docs.npmjs.com/files/package.json#engines) field of `package.json`.
If both the `version` option and the `engines` field don't exist, this rule will use the minimum version Node community is maintaining (It's `0.10` currently).

Examples of :-1: **incorrect** code for this rule:

```js
/*eslint node/no-unsupported-features: ["error", {version: 4}]*/
/*eslint-env es6*/

function foo(a = 1) {  /*error Default Parameters are not supported yet on Node v4.*/
    //...
}

function foo(...a) {   /*error Rest Parameters are not supported yet on Node v4.*/
    //...
}

var a = [...b];        /*error Spread Operators are not supported yet on Node v4.*/
var a = /foo/y;        /*error RegExp 'y' Flags are not supported yet on Node v4.*/
var a = /foo/u;        /*error RegExp 'u' Flags are not supported yet on Node v4.*/
var {a, b} = c;        /*error Destructuring are not supported yet on Node v4.*/
var {a, b} = c;        /*error Destructuring are not supported yet on Node v4.*/

let a = 1;             /*error 'let' Declarations in non-strict mode are not supported yet on Node v4.*/
const a = 1;           /*error 'const' Declarations in non-strict mode are not supported yet on Node v4.*/
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

Examples of :+1: **correct** code for this rule:

```js
/*eslint node/no-unsupported-features: ["error", {version: 4}]*/
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

## Options

This rule has `"ignores"` option to ignore to use the specified features.

```json
{
    "node/no-unsupported-features": ["error", {"version": 4, "ignores": []}]
}
```

Features which are specified by this `"ignores"` option are not warned.
This `"ignores"` option accepts an array of the following strings.

- `"syntax"` (group)
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
  - `"new.target"`
  - `"const"`
  - `"let"`
  - `"blockScopedFunctions"`
  - `"arrowFunctions"`
  - `"generatorFunctions"`
  - `"classes"`
  - `"modules"`
- `"runtime"` (group)
  - `"globalObjects"` (group)
    - `"typedArrays"` (group)
      - `"Int8Array"`
      - `"Uint8Array"`
      - `"Uint8ClampedArray"`
      - `"Int16Array"`
      - `"Uint16Array"`
      - `"Int32Array"`
      - `"Uint32Array"`
      - `"Float32Array"`
      - `"Float64Array"`
      - `"DataView"`
    - `"Map"`
    - `"Set"`
    - `"WeakMap"`
    - `"WeakSet"`
    - `"Proxy"`
    - `"Reflect"`
    - `"Promise"`
    - `"Symbol"`
  - `"staticMethods"` (group)
    - `"Object.*"` (group)
      - `"Object.assign"`
      - `"Object.is"`
      - `"Object.getOwnPropertySymbols"`
      - `"Object.setPrototypeOf"`
    - `"String.*"` (group)
      - `"String.raw"`
      - `"String.fromCodePoint"`
    - `"Array.*"` (group)
      - `"Array.from"`
      - `"Array.of"`
    - `"Number.*"` (group)
      - `"Number.isFinite"`
      - `"Number.isInteger"`
      - `"Number.isSafeInteger"`
      - `"Number.isNaN"`
      - `"Number.EPSILON"`
      - `"Number.MIN_SAFE_INTEGER"`
      - `"Number.MAX_SAFE_INTEGER"`
    - `"Math.*"` (group)
      - `"Math.clz32"`
      - `"Math.imul"`
      - `"Math.sign"`
      - `"Math.log10"`
      - `"Math.log2"`
      - `"Math.log1p"`
      - `"Math.expm1"`
      - `"Math.cosh"`
      - `"Math.sinh"`
      - `"Math.tanh"`
      - `"Math.acosh"`
      - `"Math.asinh"`
      - `"Math.atanh"`
      - `"Math.trunc"`
      - `"Math.fround"`
      - `"Math.cbrt"`
      - `"Math.hypot"`
    - `"Symbol.*"` (group)
      - `"Symbol.hasInstance"`
      - `"Symbol.isConcatSpreadablec"`
      - `"Symbol.iterator"`
      - `"Symbol.species"`
      - `"Symbol.replace"`
      - `"Symbol.search"`
      - `"Symbol.split"`
      - `"Symbol.match"`
      - `"Symbol.toPrimitive"`
      - `"Symbol.toStringTag"`
      - `"Symbol.unscopables"`
  - `"extends"` (group)
    - `"extendsArray"`
    - `"extendsRegExp"`
    - `"extendsFunction"`
    - `"extendsPromise"`
    - `"extendsBoolean"`
    - `"extendsNumber"`
    - `"extendsString"`
    - `"extendsMap"`
    - `"extendsSet"`

If a group value is given, all sub items of the value are ignored.
e.g. if `"String.*"` is given then `"String.raw"` and `"String.fromCodePoint"` are ignored.

Examples of :+1: **correct** code for the `"ignores"` option:

```js
/*eslint node/no-unsupported-features: ["error", {version: 4, ignores: ["defaultParameters"]}]*/
/*eslint-env es6*/

function foo(a = 1) {
    //...
}
```

## Further Reading

- http://node.green/
- http://kangax.github.io/compat-table/es6/
