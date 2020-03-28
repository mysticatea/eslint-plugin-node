# node/no-restricted-import
> disallow specified modules when loaded by `import` declarations

## 📖 Rule Details

This rule allows you to specify modules that you don’t want to use in your application.

### Options

The rule takes an array as options: the names of restricted modules.

```json
{
  "node/no-restricted-import": ["error", [
    "foo-module",
    "bar-module"
  ]]
}
```

You may also specify a custom message for each module you want to restrict as follows:

```json
{
  "node/no-restricted-import": ["error", [
    {
      "name": "foo-module",
      "message": "Please use foo-module2 instead."
    },
    {
      "name": "bar-module",
      "message": "Please use bar-module2 instead."
    }
  ]]
}
```

And you can use glob patterns in the `name` property.

```json
{
  "node/no-restricted-import": ["error", [
    {
      "name": "lodash/*",
      "message": "Please use xyz-module instead."
    },
    {
      "name": ["foo-module/private/*", "bar-module/*", "!baz-module/good"],
      "message": "Please use xyz-module instead."
    }
  ]]
}
```

And you can use absolute paths in the `name` property.

```js
module.exports = {
  overrides: [
    {
      files: "client/**",
      rules: {
        "node/no-restricted-import": ["error", [
          {
            name: path.resolve(__dirname, "server/**"),
            message: "Don't use server code from client code."
          }
        ]]
      }
    },
    {
      files: "server/**",
      rules: {
        "node/no-restricted-import": ["error", [
          {
            name: path.resolve(__dirname, "client/**"),
            message: "Don't use client code from server code."
          }
        ]]
      }
    }
  ]
}
```

### Examples

Examples of **incorrect** code for this rule with sample `"fs", "cluster", "lodash"` restricted modules:

```js
/*eslint node/no-restricted-import: ["error", ["fs", "cluster", "lodash/*"]]*/

import fs from 'fs';
import cluster from 'cluster';
import pick from 'lodash/pick';
```

Examples of **correct** code for this rule with sample `"fs", "cluster", "lodash"` restricted modules:

```js
/*eslint node/no-restricted-import: ["error", ["fs", "cluster", "lodash/*"]]*/

import crypto from 'crypto';
import _ from 'lodash';
```

```js
/*eslint node/no-restricted-import: ["error", ["fs", "cluster", { "name": ["lodash/*", "!lodash/pick"] }]]*/

import pick from 'lodash/pick';
```

## 🔎 Implementation

- [Rule source](../../lib/rules/no-restricted-import.js)
- [Test source](../../tests/lib/rules/no-restricted-import.js)
