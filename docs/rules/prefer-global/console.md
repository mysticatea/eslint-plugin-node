# node/prefer-global/console
> enforce either `console` or `require("console")`

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
    "node/prefer-global/console": ["error", "always" | "never"]
}
```

- `"always"` (default) ... enforces to use the global variable `console` rather than `require("console")`.
- `"never"` ... enforces to use `require("console")` rather than the global variable `console`.

#### always

Examples of :-1: **incorrect** code for this rule:

```js
/*eslint node/prefer-global/console: [error]*/

const console = require("console")
console.log("hello")
```

Examples of :+1: **correct** code for this rule:

```js
/*eslint node/prefer-global/console: [error]*/

console.log("hello")
```

#### never

Examples of :-1: **incorrect** code for the `"never"` option:

```js
/*eslint node/prefer-global/console: [error, never]*/

console.log("hello")
```

Examples of :+1: **correct** code for the `"never"` option:

```js
/*eslint node/prefer-global/console: [error, never]*/

const console = require("console")
console.log("hello")
```

## 🔎 Implementation

- [Rule source](../../../lib/rules/prefer-global/console.js)
- [Test source](../../../tests/lib/rules/prefer-global/console.js)
