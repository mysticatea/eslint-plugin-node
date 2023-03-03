# Disallow `import` declarations which import private modules (`n/no-unpublished-import`)

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/eslint-community/eslint-plugin-n#-configs).

<!-- end auto-generated rule header -->

This is similar to [no-unpublished-require](no-unpublished-require.md), but this rule handles `import` declarations.

⚠️ ECMAScript 2015 (ES6) does not define the lookup logic and Node does not support modules yet. So this rule spec might be changed in future.

## 📖 Rule Details

If a source code file satisfies all of the following conditions, the file is \*published\*.

- `"files"` field of `package.json` includes the file or `"files"` field of `package.json` does not exist.
- `.npmignore` does not include the file.

Then this rule warns `import` declarations in \*published\* files if the `import` declaration imports \*unpublished\* files or the packages of `devDependencies`.

> This intends to prevent "Module Not Found" error after `npm publish`.\
> 💡 If you want to import `devDependencies`, please write `.npmignore` or `"files"` field of `package.json`.

### Options

```json
{
    "rules": {
        "n/no-unpublished-import": ["error", {
            "allowModules": [],
            "convertPath": null
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
        "n/no-unpublished-import": ["error", {
            "allowModules": ["electron"]
        }]
    }
}
```

#### convertPath

If we use transpilers (e.g. Babel), perhaps the file path to a source code is never published.
`convertPath` option tells to the rule, it needs to convert file paths.

For example:

```json
{
    "rules": {
        "n/no-unpublished-import": ["error", {
            "convertPath": {
                "src/**/*.jsx": ["^src/(.+?)\\.jsx$", "lib/$1.js"]
            }
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

The `convertPath` option can be an array as well.

For example:

```json
{
    "rules": {
        "n/no-unpublished-import": ["error", {
            "convertPath": [
                {
                    "include": ["src/**/*.js"],
                    "exclude": ["**/*.spec.js"],
                    "replace": ["^src/(.+)$", "lib/$1"]
                }
            ]
        }]
    }
}
```

In this style, this option has the following shape as the same expression as above: `{include: [<targetFiles>], replace: [<fromRegExp>, <toString>]}`.
In addition, we can specify glob patterns to exclude files.

#### resolvePaths

TODO

### ignoreTypeImport

If using typescript, you may want to ignore type imports. This option allows you to do that.

```json
{
    "rules": {
        "n/no-unpublished-import": ["error", {
            "ignoreTypeImport": true
        }]
    }
}
```

In this way, the following code will not be reported:

```ts
import type foo from "foo";
```

### Shared Settings

The following options can be set by [shared settings](http://eslint.org/docs/user-guide/configuring.html#adding-shared-settings).
Several rules have the same option, but we can set this option at once.

- `allowModules`
- `convertPath`

For Example:

```json
{
    "settings": {
        "node": {
            "allowModules": ["electron"],
            "convertPath": {
                "src/**/*.jsx": ["^src/(.+?)\\.jsx$", "lib/$1.js"]
            }
        }
    },
    "rules": {
        "n/no-unpublished-import": "error"
    }
}
```

## 🔎 Implementation

- [Rule source](../../lib/rules/no-unpublished-import.js)
- [Test source](../../tests/lib/rules/no-unpublished-import.js)
