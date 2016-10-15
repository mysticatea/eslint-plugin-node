# Disallow `import` declarations which import unpublished files/modules (no-unpublished-import)

This is similar to [no-unpublished-require](no-unpublished-require.md), but this rule handles `import` declarations.

:warning: ECMAScript 2015 (ES6) does not define the lookup logic and Node does not support modules yet. So this rule spec might be changed in future.

## Rule Details

If a source code file satisfies all of the following conditions, the file is \*published*.

- `"files"` field of `package.json` includes the file. (or `"files"` field of `package.json` does not exist)
- `.npmignore` does not include the file.

This rule disallows importing the following things from the \*published* files.

- Unpublished files.
- Extraneous modules.
- Modules in `devDependencies`.

> This intends to prevent "Module Not Found" error after `npm publish`.<br>
> :bulb: If you want to import `devDependencies`, please write `.npmignore` or `"files"` field of `package.json`.

This rule disallows importing the following things from the \*unpublished* files.

- Extraneous modules.

> This intends to prevent "Module Not Found" error after `npm install`.

## Options

```json
{
    "rules": {
        "node/no-unpublished-import": ["error", {
            "allowModules": [],
            "convertPath": null,
            "tryExtensions": [".js", ".json", ".node"]
        }]
    }
}
```

### allowModules

Some platforms have additional embedded modules.
For example, Electron has `electron` module.

We can specify additional embedded modules with this option.
This option is an array of strings as module names.

```json
{
    "rules": {
        "node/no-unpublished-import": ["error", {
            "allowModules": ["electron"]
        }]
    }
}
```

### convertPath

If we use transpilers (e.g. Babel), perhaps the file path to a source code is never published.
`convertPath` option tells to the rule, it needs to convert file paths.

For example:

```json
{
    "rules": {
        "node/no-unpublished-import": ["error", {
            "convertPath": {
                "src/**/*.jsx": ["^src/(.+?)\\.jsx$", "lib/$1.js"]
            },
            "tryExtensions": [".js", ".jsx", ".json"]
        }]
    }
}
```

This option has the following shape: `<targetFiles>: [<fromRegExp>, <toString>]`

`targetFiles` is a glob pattern.
It converts paths which are matched to the pattern with the following way.

```js
path.replace(new RegExp(fromRegExp), toString);
```

So on this example, `src/a/foo.jsx` is handled as `lib/a/foo.js`.

### tryExtensions

When an import path does not exist, this rule checks whether or not any of `path.js`, `path.json`, and `path.node` exists.
`tryExtensions` option is the extension list this rule uses at the time.

Default is `[".js", ".json", ".node"]`.

## Shared Settings

The following options can be set by [shared settings](http://eslint.org/docs/user-guide/configuring.html#adding-shared-settings).
Several rules have the same option, but we can set this option at once.

- `allowModules`
- `convertPath`
- `tryExtensions`

For Example:

```json
{
    "settings": {
        "node": {
            "allowModules": ["electron"],
            "convertPath": {
                "src/**/*.jsx": ["^src/(.+?)\\.jsx$", "lib/$1.js"]
            },
            "tryExtensions": [".js", ".jsx", ".json"]
        }
    },
    "rules": {
        "node/no-unpublished-import": "error"
    }
}
```
