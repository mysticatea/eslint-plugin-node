# Disallow `require()`s for files that don't exist (no-missing-require)

Maybe we cannot find typo of import paths until run it, so this rule checks import paths.

```js
// If the file "foo" doesn't exist, this is a runtime error.
const foo = require("./foo");
```

## Rule Details

This rule checks whether or not the file paths of `require()`s.
If the file paths don't exist, this reports these.

The following patterns are considered problems:

```js
var typoFile = require("./typo-file");   /*error "./typo-file" is not found.*/
var typoModule = require("typo-module"); /*error "typo-module" is not found.*/
```

The following patterns are considered not problems:

```js
var existingFile = require("./existing-file");
var existingModule = require("existing-module");
```

## When Not To Use It

If you don't want to be notified about usage of `require()`, then it's safe to disable this rule.
