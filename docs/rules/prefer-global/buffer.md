# Enforce either `Buffer` or `require("buffer").Buffer` (`n/prefer-global/buffer`)

<!-- end auto-generated rule header -->

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
    "n/prefer-global/buffer": ["error", "always" | "never"]
}
```

- `"always"` (default) ... enforces to use the global variable `Buffer` rather than `require("buffer").Buffer`.
- `"never"` ... enforces to use `require("buffer").Buffer` rather than the global variable `Buffer`.

#### always

Examples of 👎 **incorrect** code for this rule:

```js
/*eslint n/prefer-global/buffer: [error]*/

const { Buffer } = require("buffer")
const b = Buffer.alloc(16)
```

Examples of 👍 **correct** code for this rule:

```js
/*eslint n/prefer-global/buffer: [error]*/

const b = Buffer.alloc(16)
```

#### never

Examples of 👎 **incorrect** code for the `"never"` option:

```js
/*eslint n/prefer-global/buffer: [error, never]*/

const b = Buffer.alloc(16)
```

Examples of 👍 **correct** code for the `"never"` option:

```js
/*eslint n/prefer-global/buffer: [error, never]*/

const { Buffer } = require("buffer")
const b = Buffer.alloc(16)
```

## 🔎 Implementation

- [Rule source](../../../lib/rules/prefer-global/buffer.js)
- [Test source](../../../tests/lib/rules/prefer-global/buffer.js)
