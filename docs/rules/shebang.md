# Suggest correct usage of shebang (node/shebang)

When we make a CLI tool with Node.js, we add `bin` field to `package.json`, then we add a shebang the entry file.
This rule suggests correct usage of shebang.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule looks up `package.json` file from each linitng target file.
Starting from the directory of the target file, it goes up ancestor directories until found.

If `package.json` was not found, this rule does nothing.

This rule checks `bin` field of `package.json`, then if a target file matches one of `bin` files, it checks whether or not there is a correct shebang.
Otherwise it checks whether or not there is not a shebang.

The following patterns are considered problems for files in `bin` field of `package.json`:

```js
console.log("hello"); /*error This file needs shebang "#!/usr/bin/env node".*/
```

The following patterns are considered problems for other files:

```js
#!/usr/bin/env node   /*error This file needs no shebang.*/
console.log("hello");
```

The following patterns are considered not problems for files in `bin` field of `package.json`:

```js
#!/usr/bin/env node
console.log("hello");
```

The following patterns are considered not problems for other files:

```js
console.log("hello");
```

### Options

```json
{
    "node/shebang": [2, {"convertPath": null}]
}
```

#### `convertPath`

If we use transpilers (e.g. Babel), perhaps the file path to a source code is never handled as a bin file.
`convertPath` option tells to the rule, it needs to convert file paths.

For example:

```json
{
    "rules": {
        "node/shebang": [2, {
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
        "node/shebang": 2
    }
}
```

## When Not To Use It

If you don't want to be notified about usage of shebang, then it's safe to disable this rule.
