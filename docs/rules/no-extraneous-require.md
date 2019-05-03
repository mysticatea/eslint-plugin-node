# node/no-extraneous-require
> disallow `require()` expressions which import extraneous modules
> - ⭐️ This rule is included in `plugin:node/recommended` preset.

If a `require()`'s target is extraneous (it's not written in `package.json`), the program works in local, but will not work after dependencies are re-installed. It will cause troubles to your team/contributors.
This rule disallows `require()` of extraneous modules.

## 📖 Rule Details

This rule warns `require()` of extraneous modules.

### Options

```json
{
    "rules": {
        "node/no-extraneous-require": ["error", {
            "allowModules": [],
            "resolvePaths": [],
            "tryExtensions": []
        }]
    }
}
```

#### allowModules

Some platforms have additional embedded modules.
For example, Electron has `electron` module.

We can specify additional embedded modules with this option.
This option is an array of strings as module names.

```json
{
    "rules": {
        "node/no-extraneous-require": ["error", {
            "allowModules": ["electron"]
        }]
    }
}
```

#### resolvePaths

Adds additional paths to try for when resolving imports.
If a path is relative, it will be resolved from CWD.

Default is `[]`

#### tryExtensions

When an import path does not exist, this rule checks whether or not any of `path.js`, `path.json`, and `path.node` exists.
`tryExtensions` option is the extension list this rule uses at the time.

Default is `[".js", ".json", ".node"]`.

### Shared Settings

The following options can be set by [shared settings](http://eslint.org/docs/user-guide/configuring.html#adding-shared-settings).
Several rules have the same option, but we can set this option at once.

- `allowModules`
- `resolvePaths`
- `tryExtensions`

```js
// .eslintrc.js
module.exports = {
    "settings": {
        "node": {
            "allowModules": ["electron"],
            "resolvePaths": [__dirname],
            "tryExtensions": [".js", ".json", ".node"]
        }
    },
    "rules": {
        "node/no-extraneous-require": "error"
    }
}
```

## 🔎 Implementation

- [Rule source](../../lib/rules/no-extraneous-require.js)
- [Test source](../../tests/lib/rules/no-extraneous-require.js)
