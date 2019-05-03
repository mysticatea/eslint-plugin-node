# node/no-hide-core-modules
> disallow third-party modules which are hiding core modules
> - ⛔ This rule has been deprecated.

**:warning: This is deprecated since v4.2.0.** This rule was based on an invalid assumption. See also [#69](https://github.com/mysticatea/eslint-plugin-node/issues/69).

If you have dependencies which have the same name as core modules, your module would use the third-party modules instead of core modules.
Especially, if you depends on such modules indirectly and npm flattens dependencies, you can depend on such third-party modules before as you know it.
This might cause unintentional behaviors.

This rule warns `require()` expressions and `import` declarations if those import a third-party module which has the same name as core modules.

## 📖 Rule Details

:-1: Examples of **incorrect** code for this rule:

```js
/*eslint node/no-hide-core-modules: "error"*/

const util = require("util")  // ERROR if `util` module exists in node_modules directory.
const path = require("path")  // ERROR if `path` module exists in node_modules directory.
// ...
```

:+1: Examples of **correct** code for this rule:

```js
/*eslint node/no-hide-core-modules: "error"*/

const util = require("util")  // OK if this is the core module 'util' surely.
const path = require("path")  // OK if this is the core module 'path' surely.
```

### Options

```json
{
    "node/no-hide-core-modules": ["error", {
        "allow": [],
        "ignoreDirectDependencies": false,
        "ignoreIndirectDependencies": false,
    }]
}
```

#### allow

If you are sure that your module depends on the third-party module which has the same name as a core module, you can allow it by `allow` option.
E.g. `{"allow": ["util", "path"]}`.
Default is en empty array.

#### ignoreDirectDependencies

If `ignoreDirectDependencies: true`, if the third-party module which has the same name as a core module exists in your `package.json`, this rule ignores it.

This option would allow all explicit dependencies which are hiding core modules.

#### ignoreIndirectDependencies

If `ignoreIndirectDependencies: true`, if the third-party module which has the same name as a core module does not exist in your `package.json`, this rule ignores it.

This option would allow all implicit dependencies which are hiding core modules.

## 🔎 Implementation

- [Rule source](../../lib/rules/no-hide-core-modules.js)
- [Test source](../../tests/lib/rules/no-hide-core-modules.js)
