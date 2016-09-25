# Disallow `import` and `export` declarations for files that are not published (no-unpublished-import)

This is similar to [no-unpublished-require](no-unpublished-require.md), but this rule handles `import` and `export` declarations.

**⚠ NOTE:** ECMAScript 2015 (ES6) does not define the lookup logic and Node does not support modules yet. So this rule spec might be changed in future.

## Rule Details

This rule checks the file paths of `import` and `export` declarations.
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
/*eslint node/no-unpublished-import: 2*/

import ignoredFile from "./ignored-file";             /*error "./ignored-file" is not published.*/
import notDependedModule from "not-depended-module";  /*error "not-depended-module" is not published.*/
```

The following patterns are not considered problems:

```js
/*eslint node/no-unpublished-import: 2*/

import publishedFile from "./published-file";
import dependedModule from "depended-module";
```

### Options

```json
{
    "rules": {
        "node/no-unpublished-import": [2, {
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
        "node/no-unpublished-import": [2, {
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
        "node/no-unpublished-import": [2, {
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
        "node/no-unpublished-import": 2
    }
}
```

## When Not To Use It

This rule should not be used in ES3/5 environments.

If you don't want to be notified about usage of `import` and `export` declarations, then it's safe to disable this rule.
