# Enforce either `TextDecoder` or `require("util").TextDecoder` (`n/prefer-global/text-decoder`)

<!-- end auto-generated rule header -->

The `TextDecoder` class of `util` module is defined as a global variable.

```js
console.log(TextDecoder === require("util").TextDecoder) //→ true
```

It will be readable if we use either `TextDecoder` consistently.

## 📖 Rule Details

This rule enforces which `TextDecoder` we should use.

### Options

This rule has a string option.

```json
{
    "n/prefer-global/text-decoder": ["error", "always" | "never"]
}
```

- `"always"` (default) ... enforces to use the global variable `TextDecoder` rather than `require("util").TextDecoder`.
- `"never"` ... enforces to use `require("util").TextDecoder` rather than the global variable `TextDecoder`.

#### always

Examples of 👎 **incorrect** code for this rule:

```js
/*eslint n/prefer-global/text-decoder: [error]*/

const { TextDecoder } = require("util")
const u = new TextDecoder(s)
```

Examples of 👍 **correct** code for this rule:

```js
/*eslint n/prefer-global/text-decoder: [error]*/

const u = new TextDecoder(s)
```

#### never

Examples of 👎 **incorrect** code for the `"never"` option:

```js
/*eslint n/prefer-global/text-decoder: [error, never]*/

const u = new TextDecoder(s)
```

Examples of 👍 **correct** code for the `"never"` option:

```js
/*eslint n/prefer-global/text-decoder: [error, never]*/

const { TextDecoder } = require("util")
const u = new TextDecoder(s)
```

## 🔎 Implementation

- [Rule source](../../../lib/rules/prefer-global/text-decoder.js)
- [Test source](../../../tests/lib/rules/prefer-global/text-decoder.js)
