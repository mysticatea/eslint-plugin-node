# node/no-new-require
> disallow `new` operators with calls to `require`

The `require` function is used to include modules that exist in separate files, such as:

```js
var appHeader = require('app-header');
```

Some modules return a constructor which can potentially lead to code such as:

```js
var appHeader = new require('app-header');
```

Unfortunately, this introduces a high potential for confusion since the code author likely meant to write:

```js
var appHeader = new (require('app-header'));
```

For this reason, it is usually best to disallow this particular expression.

## 📖 Rule Details

This rule aims to eliminate use of the `new require` expression.

Examples of **incorrect** code for this rule:

```js
/*eslint node/no-new-require: "error"*/

var appHeader = new require('app-header');
```

Examples of **correct** code for this rule:

```js
/*eslint node/no-new-require: "error"*/

var AppHeader = require('app-header');
var appHeader = new AppHeader();
```

## 🔎 Implementation

- [Rule source](../../lib/rules/no-new-require.js)
- [Test source](../../tests/lib/rules/no-new-require.js)
