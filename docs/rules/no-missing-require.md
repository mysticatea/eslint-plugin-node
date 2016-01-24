# Disallow `require()`s for files that don't exist (no-missing-require)

Maybe we cannot find typo of import paths until run it, so this rule checks import paths.

```js
// If the file "foo" doesn't exist, this is a runtime error.
const foo = require("./foo");
```

## Rule Details

This rule checks the file paths of `require()`s.
If the file paths don't exist, this reports these.

The following patterns are considered problems:

```js
/*eslint node/no-missing-require: 2*/

var typoFile = require("./typo-file");   /*error "./typo-file" is not found.*/
var typoModule = require("typo-module"); /*error "typo-module" is not found.*/
```

The following patterns are not considered problems:

```js
/*eslint node/no-missing-require: 2*/

var existingFile = require("./existing-file");
var existingModule = require("existing-module");

// This rule cannot check for dynamic imports.
var foo = require(FOO_NAME);
```

### Options

```json
{
    "rules": {
        "node/no-missing-require": [2, {
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
        "node/no-missing-require": 2
    }
}
```

## When Not To Use It

If you don't want to be notified about usage of `require()`, then it's safe to disable this rule.
