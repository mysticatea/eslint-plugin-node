# Disallow `import` and `export` declarations for files that are not published (no-unpublished-import)

This is similar to [no-unpublished-require](no-unpublished-require.md), but this rule handles `import` and `export` declarations.

**NOTE:** ECMAScript 2015 (ES6) does not define the lookup logic and Node does not support modules yet. So this rule spec might be changed in future.

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

The following patterns are considered not problems:

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
            "tryExtensions": [".js", ".json", ".node"]
        }]
    }
}
```

#### `tryExtensions`

When an import path does not exist, this rule checks whether or not any of `path.js`, `path.json`, and `path.node` exists.
`tryExtensions` option is the extension list this rule uses at the time.

Default is `[".js", ".json", ".node"]`.

This option can be set by [shared settings](http://eslint.org/docs/user-guide/configuring.html#adding-shared-settings).
Several rules have this option, but we can set this option at once.

```json
{
    "settings": {
        "node": {
            "tryExtensions": [".js", ".json", ".node"]
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
