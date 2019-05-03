# node/prefer-global/buffer
> enforce either `Buffer` or `require("buffer").Buffer`

The `Buffer` class of `buffer` module is defined as a global variable.

```js
console.log(Buffer === require("buffer").Buffer) //→ true
```

It will be readable if we use either `Buffer` consistently.

## 📖 Rule Details

This rule enforces which `Buffer` we should use.

### Options

This rule has a string option.

```json
{
    "node/prefer-global/buffer": ["error", "always" | "never"]
}
```

- `"always"` (default) ... enforces to use the global variable `Buffer` rather than `require("buffer").Buffer`.
- `"never"` ... enforces to use `require("buffer").Buffer` rather than the global variable `Buffer`.

#### always

Examples of :-1: **incorrect** code for this rule:

```js
/*eslint node/prefer-global/buffer: [error]*/

const { Buffer } = require("buffer")
const b = Buffer.alloc(16)
```

Examples of :+1: **correct** code for this rule:

```js
/*eslint node/prefer-global/buffer: [error]*/

const b = Buffer.alloc(16)
```

#### never

Examples of :-1: **incorrect** code for the `"never"` option:

```js
/*eslint node/prefer-global/buffer: [error, never]*/

const b = Buffer.alloc(16)
```

Examples of :+1: **correct** code for the `"never"` option:

```js
/*eslint node/prefer-global/buffer: [error, never]*/

const { Buffer } = require("buffer")
const b = Buffer.alloc(16)
```

## 🔎 Implementation

- [Rule source](../../../lib/rules/prefer-global/buffer.js)
- [Test source](../../../tests/lib/rules/prefer-global/buffer.js)
