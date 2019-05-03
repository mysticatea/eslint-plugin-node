# node/prefer-global/url
> enforce either `URL` or `require("url").URL`

The `URL` class of `url` module is defined as a global variable.

```js
console.log(URL === require("url").URL) //→ true
```

It will be readable if we use either `URL` consistently.

## 📖 Rule Details

This rule enforces which `URL` we should use.

### Options

This rule has a string option.

```json
{
    "node/prefer-global/url": ["error", "always" | "never"]
}
```

- `"always"` (default) ... enforces to use the global variable `URL` rather than `require("url").URL`.
- `"never"` ... enforces to use `require("url").URL` rather than the global variable `URL`.

#### always

Examples of :-1: **incorrect** code for this rule:

```js
/*eslint node/prefer-global/url: [error]*/

const { URL } = require("url")
const u = new URL(s)
```

Examples of :+1: **correct** code for this rule:

```js
/*eslint node/prefer-global/url: [error]*/

const u = new URL(s)
```

#### never

Examples of :-1: **incorrect** code for the `"never"` option:

```js
/*eslint node/prefer-global/url: [error, never]*/

const u = new URL(s)
```

Examples of :+1: **correct** code for the `"never"` option:

```js
/*eslint node/prefer-global/url: [error, never]*/

const { URL } = require("url")
const u = new URL(s)
```

## 🔎 Implementation

- [Rule source](../../../lib/rules/prefer-global/url.js)
- [Test source](../../../tests/lib/rules/prefer-global/url.js)
