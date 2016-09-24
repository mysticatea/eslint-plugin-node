# disallow 'bin' files that npm ignores (no-unpublished-bin)

We can publish CLI commands by `npm`. It uses `bin` field of `package.json`.

```json
{
    "name": "command-name",
    "bin": "bin/index.js"
}
```

At this time, if `npm` ignores the file, your package will fail to install.

## Rule Details

If `npm` ignores the files in `bin` field, this rule warns the files.

- If `files` field does not includes the files in `bin` field.
- If `.npmignore` file includes the files in `bin` field.

## Options

```json
{
    "rules": {
        "node/no-unpublished-bin": ["error", {
            "convertPath": null
        }]
    }
}
```

### `convertPath`

If we use transpilers (e.g. Babel), perhaps the file path to a source code is never published.
`convertPath` option tells to the rule, it needs to convert file paths.

For example:

```json
{
    "rules": {
        "node/no-unpublished-bin": ["error", {
            "convertPath": {
                "src/bin/**/*.js": ["^src/bin/(.+)$", "bin/$1"]
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

So on this example, `src/bin/index.js` is handled as `bin/index.js`.

## Shared Settings

The following options can be set by [shared settings](http://eslint.org/docs/user-guide/configuring.html#adding-shared-settings).
Several rules have the same option, but we can set this option at once.

- `convertPath`

For Example:

```json
{
    "settings": {
        "node": {
            "convertPath": {
                "src/bin/**/*.js": ["^src/bin/(.+)$", "bin/$1"]
            }
        }
    },
    "rules": {
        "node/no-unpublished-bin": "error"
    }
}
```
