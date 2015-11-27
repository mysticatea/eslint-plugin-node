# Disallow invalid `require()`s (no-missing-require)

Maybe we cannot find typo of import paths until run it.
Also, maybe we cannot find lacking of `dependencies` of `package.json` until publish it.

So this rule checks import paths and `dependencies` of `package.json`.

## Rule Details

This rule does two checks.

1. This rule checks whether or not the files of import paths exist.
   If those do not exist, it reports the invalid `require()`.
2. This rule looks up `package.json` file from each linitng target file.
   Starting from the directory of the target file, it goes up ancestor directories until found.
   Then it checks whether or not the imported modules are published properly.

This does not check for dynamic imports.

The following patterns are considered problems:

```js
var typoFile = require("./typo-file");   /*error "./typo-file" is not found.*/
var typoModule = require("typo-module"); /*error "typo-module" is not found.*/

// If the module is not written in "dependencies" and "peerDependencies"....
var someone = require("someone");        /*error "someone" is not published.*/
```

The following patterns are considered not problems:

```js
var existingFile = require("./existing");

// If it's installed and it's written in `dependencies` or `peerDependencies`.
var eslint = require("eslint");
```

### Options

```json
{
    "no-missing-require": [2, {"publish": "+(./*|./{bin,lib,src}/**)"}]
}
```

- `publish` (`string`) - A glob pattern.
  If a linting target file is matched this pattern, the file is addressed as a published file.
  `require()` in the published files cannot import files which are not published.
  On the other hand, other files can import files which are not published.

## When Not To Use It

If you don't want to be notified about usage of `require()`, then it's safe to disable this rule.
