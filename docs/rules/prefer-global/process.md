# node/prefer-global/process
> enforce either `process` or `require("process")`

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
    "node/prefer-global/process": ["error", "always" | "never"]
}
```

- `"always"` (default) ... enforces to use the global variable `process` rather than `require("process")`.
- `"never"` ... enforces to use `require("process")` rather than the global variable `process`.

#### always

Examples of :-1: **incorrect** code for this rule:

```js
/*eslint node/prefer-global/process: [error]*/

const process = require("process")
process.exit(0)
```

Examples of :+1: **correct** code for this rule:

```js
/*eslint node/prefer-global/process: [error]*/

process.exit(0)
```

#### never

Examples of :-1: **incorrect** code for the `"never"` option:

```js
/*eslint node/prefer-global/process: [error, never]*/

process.exit(0)
```

Examples of :+1: **correct** code for the `"never"` option:

```js
/*eslint node/prefer-global/process: [error, never]*/

const process = require("process")
process.exit(0)
```

## 🔎 Implementation

- [Rule source](../../../lib/rules/prefer-global/process.js)
- [Test source](../../../tests/lib/rules/prefer-global/process.js)
