# node/no-restricted-require
> disallow specified modules when loaded by `require`

A module in Node.js is a simple or complex functionality organized in a JavaScript file which can be reused throughout the Node.js
application. The keyword `require` is used in Node.js/CommonJS to import modules into an application. This way you can have dynamic loading where the loaded module name isn't predefined /static, or where you conditionally load a module only if it's "truly required".

Why would you want to restrict a module?

Disallowing usage of specific Node.js modules can be useful if you want to limit the available methods a developer can use. For example, you can block usage of the `fs` module if you want to disallow file system access.

## 📖 Rule Details

This rule allows you to specify modules that you don’t want to use in your application.

### Options

The rule takes an array as options: the names of restricted modules.

```json
{
  "node/no-restricted-require": ["error", [
    "foo-module",
    "bar-module"
  ]]
}
```

You may also specify a custom message for each module you want to restrict as follows:

```json
{
  "node/no-restricted-require": ["error", [
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
  "node/no-restricted-require": ["error", [
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
        "node/no-restricted-require": ["error", [
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
        "node/no-restricted-require": ["error", [
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
/*eslint node/no-restricted-require: ["error", ["fs", "cluster", "lodash/*"]]*/

const fs = require('fs');
const cluster = require('cluster');
const pick = require('lodash/pick');
```

Examples of **correct** code for this rule with sample `"fs", "cluster", "lodash"` restricted modules:

```js
/*eslint node/no-restricted-require: ["error", ["fs", "cluster", "lodash/*"]]*/

const crypto = require('crypto');
const _ = require('lodash');
```

```js
/*eslint node/no-restricted-require: ["error", ["fs", "cluster", { "name": ["lodash/*", "!lodash/pick"] }]]*/

const pick = require('lodash/pick');
```

## 🔎 Implementation

- [Rule source](../../lib/rules/no-restricted-require.js)
- [Test source](../../tests/lib/rules/no-restricted-require.js)
