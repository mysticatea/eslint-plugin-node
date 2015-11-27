# Disallow invalid `import` and `export` declarations (no-missing-import)

This is similar to [no-missing-require](no-missing-require.md), but this rule handles `import` and `export` declarations.

**NOTE:** ECMAScript 2015 (ES6) does not define the lookup logic. So this rule spec might be changed in future.

## Rule Details

See [no-missing-require](no-missing-require.md#rule-details).

The following patterns are considered problems:

```js
import typoFile from "./typo-file";   /*error "./typo-file" is not found.*/
import typoModule from "typo-module"; /*error "typo-module" is not found.*/

// If the module is not written in "dependencies" and "peerDependencies"....
import someone from "someone";        /*error "someone" is not published.*/
```

## When Not To Use It

This rule should not be used in ES3/5 environments.

If you don't want to be notified about usage of `import` and `export` declarations, then it's safe to disable this rule.
