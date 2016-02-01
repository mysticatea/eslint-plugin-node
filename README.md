# eslint-plugin-node

[![npm version](https://img.shields.io/npm/v/eslint-plugin-node.svg)](https://www.npmjs.com/package/eslint-plugin-node)
[![Downloads/month](https://img.shields.io/npm/dm/eslint-plugin-node.svg)](https://www.npmjs.com/package/eslint-plugin-node)
[![Build Status](https://travis-ci.org/mysticatea/eslint-plugin-node.svg?branch=master)](https://travis-ci.org/mysticatea/eslint-plugin-node)
[![Coverage Status](https://coveralls.io/repos/mysticatea/eslint-plugin-node/badge.svg?branch=master)](https://coveralls.io/r/mysticatea/eslint-plugin-node?branch=master)
[![Dependency Status](https://david-dm.org/mysticatea/eslint-plugin-node.svg)](https://david-dm.org/mysticatea/eslint-plugin-node)

Additional ESLint's rules for Node.js

## Install & Usage

```
> npm install --save-dev eslint eslint-plugin-node
```

**.eslintrc**

```json
{
    "extends": "eslint:recommended",
    "plugins": ["node"],
    "env": {
        "node": true
    },
    "rules": {
        "node/no-missing-import": 2,
        "node/no-missing-require": 2,
        "node/no-unpublished-import": 2,
        "node/no-unpublished-require": 2,
        "node/no-unsupported-features": [2, {"version": 4}],
        "node/shebang": 2
    }
}
```

## Rules

Some rules are slow because it searches `package.json` and opens it.

- [no-missing-import](docs/rules/no-missing-import.md) - Disallow `import` and `export` declarations for files that don't exist.
- [no-missing-require](docs/rules/no-missing-require.md) - Disallow `require()`s for files that don't exist.
- [no-unpublished-import](docs/rules/no-unpublished-import.md) - Disallow `import` and `export` declarations for files that are not published.
- [no-unpublished-require](docs/rules/no-unpublished-require.md) - Disallow `require()`s for files that are not published.
- [no-unsupported-features](docs/rules/no-unsupported-features.md) - Disallow unsupported ECMAScript features on the specified version.
- [shebang](docs/rules/shebang.md) - Suggest correct usage of shebang. (fixable)

## FAQ

Q: The `no-missing-import` / `no-missing-require` rules don't work with nested folders in SublimeLinter-eslint

A: See [context.getFilename() in rule returns relative path](https://github.com/roadhump/SublimeLinter-eslint#contextgetfilename-in-rule-returns-relative-path) in the SublimeLinter-eslint FAQ.
