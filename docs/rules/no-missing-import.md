# Disallow `import` and `export` declarations for files that don't exist (no-missing-import)

This is similar to [no-missing-require](no-missing-require.md), but this rule handles `import` and `export` declarations.

:warning: ECMAScript 2015 (ES6) does not define the lookup logic and Node does not support modules yet. So this rule spec might be changed in future.

## Rule Details

This rule checks the file paths of `import` and `export` declarations.
If the file paths don't exist, this reports these.

Examples of :-1: **incorrect** code for this rule:

```js
/*eslint node/no-missing-import: "error" */

import typoFile from "./typo-file";   /*ERROR: "./typo-file" is not found.*/
import typoModule from "typo-module"; /*ERROR: "typo-module" is not found.*/
```

Examples of :+1: **correct** code for this rule:

```js
/*eslint node/no-missing-import: "error" */

import existingFile from "./existing-file";
import existingModule from "existing-module";
```

## Options

```json
{
    "rules": {
        "node/no-missing-import": ["error", {
            "allowModules": [],
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
        "node/no-missing-import": ["error", {
            "allowModules": ["electron"]
        }]
    }
}
```

### tryExtensions

When an import path does not exist, this rule checks whether or not any of `path.js`, `path.json`, and `path.node` exists.
`tryExtensions` option is the extension list this rule uses at the time.

Default is `[".js", ".json", ".node"]`.

## Shared Settings

The following options can be set by [shared settings](http://eslint.org/docs/user-guide/configuring.html#adding-shared-settings).
Several rules have the same option, but we can set this option at once.

- `allowModules`
- `tryExtensions`

```json
{
    "settings": {
        "node": {
            "allowModules": ["electron"],
            "tryExtensions": [".js", ".json", ".node"]
        }
    },
    "rules": {
        "node/no-missing-import": "error"
    }
}
```
