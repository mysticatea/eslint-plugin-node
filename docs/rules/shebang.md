# node/shebang
> suggest correct usage of shebang
> - ⭐️ This rule is included in `plugin:node/recommended` preset.
> - ✒️ The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

When we make a CLI tool with Node.js, we add `bin` field to `package.json`, then we add a shebang the entry file.
This rule suggests correct usage of shebang.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## 📖 Rule Details

This rule looks up `package.json` file from each linting target file.
Starting from the directory of the target file, it goes up ancestor directories until found.

If `package.json` was not found, this rule does nothing.

This rule checks `bin` field of `package.json`, then if a target file matches one of `bin` files, it checks whether or not there is a correct shebang.
Otherwise it checks whether or not there is not a shebang.

The following patterns are considered problems for files in `bin` field of `package.json`:

```js
console.log("hello"); /*error This file needs shebang "#!/usr/bin/env node".*/
```

```js
#!/usr/bin/env node  /*error This file must not have Unicode BOM.*/
console.log("hello");
// If this file has Unicode BOM.
```

```js
#!/usr/bin/env node  /*error This file must have Unix linebreaks (LF).*/
console.log("hello");
// If this file has Windows' linebreaks (CRLF).
```

The following patterns are considered problems for other files:

```js
#!/usr/bin/env node   /*error This file needs no shebang.*/
console.log("hello");
```

The following patterns are not considered problems for files in `bin` field of `package.json`:

```js
#!/usr/bin/env node
console.log("hello");
```

The following patterns are not considered problems for other files:

```js
console.log("hello");
```

### Options

```json
{
    "node/shebang": ["error", {"convertPath": null}]
}
```

#### convertPath

If we use transpilers (e.g. Babel), perhaps the file path to a source code is never handled as a bin file.
`convertPath` option tells to the rule, it needs to convert file paths.

For example:

```json
{
    "rules": {
        "node/shebang": ["error", {
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
        "node/shebang": ["error", {
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

### Shared Settings

The following options can be set by [shared settings](http://eslint.org/docs/user-guide/configuring.html#adding-shared-settings).
Several rules have the same option, but we can set this option at once.

- `convertPath`

For Example:

```json
{
    "settings": {
        "node": {
            "convertPath": {
                "src/**/*.jsx": ["^src/(.+?)\\.jsx$", "lib/$1.js"]
            }
        }
    },
    "rules": {
        "node/shebang": "error"
    }
}
```

## 🔎 Implementation

- [Rule source](../../lib/rules/shebang.js)
- [Test source](../../tests/lib/rules/shebang.js)
