# Enforce either `console` or `require("console")` (`n/prefer-global/console`)

<!-- end auto-generated rule header -->

The `console` module is defined as a global variable.

```js
console.log(console === require("console")) //→ true
```

It will be readable if we use either `console` consistently.

## 📖 Rule Details

This rule enforces which `console` we should use.

### Options

This rule has a string option.

```json
{
    "n/prefer-global/console": ["error", "always" | "never"]
}
```

- `"always"` (default) ... enforces to use the global variable `console` rather than `require("console")`.
- `"never"` ... enforces to use `require("console")` rather than the global variable `console`.

#### always

Examples of 👎 **incorrect** code for this rule:

```js
/*eslint n/prefer-global/console: [error]*/

const console = require("console")
console.log("hello")
```

Examples of 👍 **correct** code for this rule:

```js
/*eslint n/prefer-global/console: [error]*/

console.log("hello")
```

#### never

Examples of 👎 **incorrect** code for the `"never"` option:

```js
/*eslint n/prefer-global/console: [error, never]*/

console.log("hello")
```

Examples of 👍 **correct** code for the `"never"` option:

```js
/*eslint n/prefer-global/console: [error, never]*/

const console = require("console")
console.log("hello")
```

## 🔎 Implementation

- [Rule source](../../../lib/rules/prefer-global/console.js)
- [Test source](../../../tests/lib/rules/prefer-global/console.js)
