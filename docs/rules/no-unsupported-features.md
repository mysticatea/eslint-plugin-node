# node/no-unsupported-features
> disallow unsupported ECMAScript features on the specified version
> - ⛔ This rule has been deprecated. Use [node/no-unsupported-features/es-syntax](./no-unsupported-features/es-syntax.md) and [node/no-unsupported-features/es-builtins](./no-unsupported-features/es-builtins.md) instead.

**:warning: This is deprecated since v7.0.0.** Use [node/no-unsupported-features/es-syntax](./no-unsupported-features/es-syntax.md) and [node/no-unsupported-features/es-builtins](./no-unsupported-features/es-builtins.md) instead.

Node.js doesn't support all ECMAScript standard features.
This rule reports when you used unsupported ECMAScript 2015-2018 features on the specified Node.js version.

> ※ About ECMAScript 2018, this rule reports only features which have arrived at stage 4 until 2018-02-01.
> It needs a major version bump in order to cover newer features.

## 📖 Rule Details

:warning: This rule expects to be used with the following configuration:

```json
{
    "env": {"es6": true},
    "parserOptions": {"ecmaVersion": 2018}
}
```

:warning: This rule reads the [engines] field of `package.json` to detect Node.js version.

I recommend a use of the [engines] field since it's the official way to indicate what Node.js versions your module is supporting.
For example of `package.json`:

```json
{
    "name": "your-module",
    "version": "1.0.0",
    "engines": {
        "node": ">=6.0.0"
    }
}
```

If the [engines] field is omitted, this rule chooses `4` since it's the minimum version the community is maintaining.

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

### Options

```json
{
    "node/no-unsupported-features": ["error", {
        "version": 4,
        "ignores": []
    }]
}
```

#### version

As mentioned above, this rule reads the [engines] field of `package.json` to detect Node.js version.
Also, you can overwrite the version by `version` option.
The `version` option accepts the following version number:

- `0.10`
- `0.12`
- `4`
- `5`
- `6`
- `6.5` ... `Symbol.hasInstance` and `Symbol.species`.
- `7` ... Exponential operators, `Object.values`, `Object.entries`, and `Object.getOwnPropertyDescriptors`.
- `7.6` ... Async functions.
- `8` ... Trailing commas in functions.
- `8.3` ... Rest/Spread proeprties.
- `9.0` ... Illegal escape sequences in taggled templates, RegExp 's' flags, RegExp lookbehind assertions, `SharedArrayBuffer`, and `Atomics`.
- `10.0` ... RegExp named capture groups, RegExp Unicode property escapes, Async generators, and `for-await-of` loops.

#### ignores

If you are using transpilers, maybe you want to ignore the warnings about some features.
You can use this `ignores` option to ignore the given features.
The `"ignores"` option accepts an array of the following strings.

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
  - `"exponentialOperators"`
  - `"asyncAwait"`
  - `"trailingCommasInFunctions"`
  - `"templateLiteralRevision"`
  - `"regexpS"`
  - `"regexpNamedCaptureGroups"`
  - `"regexpLookbehind"`
  - `"regexpUnicodeProperties"`
  - `"restProperties"`
  - `"spreadProperties"`
  - `"asyncGenerators"`
  - `"forAwaitOf"`
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
    - `"SharedArrayBuffer"`
    - `"Atomics"`
  - `"staticMethods"` (group)
    - `"Object.*"` (group)
      - `"Object.assign"`
      - `"Object.is"`
      - `"Object.getOwnPropertySymbols"`
      - `"Object.setPrototypeOf"`
      - `"Object.values"`
      - `"Object.entries"`
      - `"Object.getOwnPropertyDescriptors"`
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
    - `"Atomics.*"` (group)
      - `"Atomics.add"`
      - `"Atomics.and"`
      - `"Atomics.compareExchange"`
      - `"Atomics.exchange"`
      - `"Atomics.wait"`
      - `"Atomics.wake"`
      - `"Atomics.isLockFree"`
      - `"Atomics.load"`
      - `"Atomics.or"`
      - `"Atomics.store"`
      - `"Atomics.sub"`
      - `"Atomics.xor"`
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
    - `"extendsNull"`

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

## ⚠️ Known Limitations

This rule cannot report non-static things.
E.g., a use of instance methods.

## 📚 Further Reading

- http://node.green/

[engines]: https://docs.npmjs.com/files/package.json#engines

## 🔎 Implementation

- [Rule source](../../lib/rules/no-unsupported-features.js)
- [Test source](../../tests/lib/rules/no-unsupported-features.js)
