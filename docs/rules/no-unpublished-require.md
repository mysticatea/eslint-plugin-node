# Disallow `require()`s for files that are not published (no-unpublished-require)

If `require()` targets are not published, the program works in local, but will not work after published to npm.
This rule catches `require()` for files and modules that not published.

## Rule Details

This rule checks the file paths of `require()`s.
If the file paths are not published, this reports these.

"published" is that satisfying the following conditions:

- If it's a file:
  - `"files"` field of `package.json` includes the file, or the field is nothing.
  - `.npmignore` does not include the file.
- If it's a module:
  - `"dependencies"` or `"peerDependencies"` field of `package.json` includes the module.
    If the file `require` is written is not published then it's also OK that `"devDependencies"` field of `package.json` includes the module.

The following patterns are considered problems:

```js
/*eslint node/no-unpublished-require: 2*/

var ignoredFile = require("./ignored-file");             /*error "./ignored-file" is not published.*/
var notDependedModule = require("not-depended-module");  /*error "not-depended-module" is not published.*/
```

The following patterns are not considered problems:

```js
/*eslint node/no-unpublished-require: 2*/

var publishedFile = require("./published-file");
var dependedModule = require("depended-module");

// This rule cannot check for dynamic imports.
var foo = require(FOO_NAME);
```

### Options

```json
{
    "rules": {
        "node/no-unpublished-require": [2, {
            "allowModules": [],
            "convertPath": null,
            "tryExtensions": [".js", ".json", ".node"]
        }]
    }
}
```

#### `allowModules`

Some platforms have additional embedded modules.
For example, Electron has `electron` module.

We can specify additional embedded modules with this option.
This option is an array of strings as module names.

```json
{
    "rules": {
        "node/no-unpublished-require": [2, {
            "allowModules": ["electron"]
        }]
    }
}
```

#### `convertPath`

If we use transpilers (e.g. Babel), perhaps the file path to a source code is never published.
`convertPath` option tells to the rule, it needs to convert file paths.

For example:

```json
{
    "rules": {
        "node/no-unpublished-require": [2, {
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

#### `tryExtensions`

When an import path does not exist, this rule checks whether or not any of `path.js`, `path.json`, and `path.node` exists.
`tryExtensions` option is the extension list this rule uses at the time.

Default is `[".js", ".json", ".node"]`.

### Shared Settings

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
        "node/no-unpublished-require": 2
    }
}
```

## When Not To Use It

If you don't want to be notified about usage of `require()`, then it's safe to disable this rule.
