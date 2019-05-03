# node/prefer-global/url-search-params
> enforce either `URLSearchParams` or `require("url").URLSearchParams`

The `URLSearchParams` class of `url` module is defined as a global variable.

```js
console.log(URLSearchParams === require("url").URLSearchParams) //→ true
```

It will be readable if we use either `URLSearchParams` consistently.

## 📖 Rule Details

This rule enforces which `URLSearchParams` we should use.

### Options

This rule has a string option.

```json
{
    "node/prefer-global/url-search-params": ["error", "always" | "never"]
}
```

- `"always"` (default) ... enforces to use the global variable `URLSearchParams` rather than `require("url").URLSearchParams`.
- `"never"` ... enforces to use `require("url").URLSearchParams` rather than the global variable `URLSearchParams`.

#### always

Examples of :-1: **incorrect** code for this rule:

```js
/*eslint node/prefer-global/url-search-params: [error]*/

const { URLSearchParams } = require("url")
const u = new URLSearchParams(s)
```

Examples of :+1: **correct** code for this rule:

```js
/*eslint node/prefer-global/url-search-params: [error]*/

const u = new URLSearchParams(s)
```

#### never

Examples of :-1: **incorrect** code for the `"never"` option:

```js
/*eslint node/prefer-global/url-search-params: [error, never]*/

const u = new URLSearchParams(s)
```

Examples of :+1: **correct** code for the `"never"` option:

```js
/*eslint node/prefer-global/url-search-params: [error, never]*/

const { URLSearchParams } = require("url")
const u = new URLSearchParams(s)
```

## 🔎 Implementation

- [Rule source](../../../lib/rules/prefer-global/url-search-params.js)
- [Test source](../../../tests/lib/rules/prefer-global/url-search-params.js)
