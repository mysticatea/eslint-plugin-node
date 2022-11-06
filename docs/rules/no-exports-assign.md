# Disallow the assignment to `exports` (`n/no-exports-assign`)

💼 This rule is enabled in the following configs: ✅ `recommended`, ☑️ `recommended-module`, ✔️ `recommended-script`.

<!-- end auto-generated rule header -->

To assign to `exports` variable would not work as expected.

```js
// This assigned object is not exported.
// You need to use `module.exports = { ... }`.
exports = {
    foo: 1
}
```

## 📖 Rule Details

This rule is aimed at disallowing `exports = {}`, but allows `module.exports = exports = {}` to avoid conflict with [n/exports-style](./exports-style.md) rule's `allowBatchAssign` option.

👍 Examples of **correct** code for this rule:

```js
/*eslint n/no-exports-assign: error */

module.exports.foo = 1
exports.bar = 2

module.exports = {}

// allows `exports = {}` if along with `module.exports =`
module.exports = exports = {}
exports = module.exports = {}
```

👎 Examples of **incorrect** code for this rule:

```js
/*eslint n/no-exports-assign: error */

exports = {}
```

## 🔎 Implementation

- [Rule source](../../lib/rules/no-exports-assign.js)
- [Test source](../../tests/lib/rules/no-exports-assign.js)
