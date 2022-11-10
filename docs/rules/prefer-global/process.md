# Enforce either `process` or `require("process")` (`n/prefer-global/process`)

<!-- end auto-generated rule header -->

The `process` module is defined as a global variable.

```js
process.log(process === require("process")) //→ true
```

It will be readable if we use either `process` consistently.

## 📖 Rule Details

This rule enforces which `process` we should use.

### Options

This rule has a string option.

```json
{
    "n/prefer-global/process": ["error", "always" | "never"]
}
```

- `"always"` (default) ... enforces to use the global variable `process` rather than `require("process")`.
- `"never"` ... enforces to use `require("process")` rather than the global variable `process`.

#### always

Examples of 👎 **incorrect** code for this rule:

```js
/*eslint n/prefer-global/process: [error]*/

const process = require("process")
process.exit(0)
```

Examples of 👍 **correct** code for this rule:

```js
/*eslint n/prefer-global/process: [error]*/

process.exit(0)
```

#### never

Examples of 👎 **incorrect** code for the `"never"` option:

```js
/*eslint n/prefer-global/process: [error, never]*/

process.exit(0)
```

Examples of 👍 **correct** code for the `"never"` option:

```js
/*eslint n/prefer-global/process: [error, never]*/

const process = require("process")
process.exit(0)
```

## 🔎 Implementation

- [Rule source](../../../lib/rules/prefer-global/process.js)
- [Test source](../../../tests/lib/rules/prefer-global/process.js)
