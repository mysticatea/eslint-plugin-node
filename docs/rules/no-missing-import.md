# Disallow `import` and `export` declarations for files that don't exist (no-missing-import)

This is similar to [no-missing-require](no-missing-require.md), but this rule handles `import` and `export` declarations.

**NOTE:** ECMAScript 2015 (ES6) does not define the lookup logic and Node does not support modules yet. So this rule spec might be changed in future.

## Rule Details

This rule checks the file paths of `import` and `export` declarations.
If the file paths don't exist, this reports these.

The following patterns are considered problems:

```js
/*eslint node/no-missing-import: 2*/

import typoFile from "./typo-file";   /*error "./typo-file" is not found.*/
import typoModule from "typo-module"; /*error "typo-module" is not found.*/
```

The following patterns are considered not problems:

```js
/*eslint node/no-missing-import: 2*/

import existingFile from "./existing-file";
import existingModule from "existing-module";
```

## When Not To Use It

This rule should not be used in ES3/5 environments.

If you don't want to be notified about usage of `import` and `export` declarations, then it's safe to disable this rule.
