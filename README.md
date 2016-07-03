# eslint-plugin-node

[![npm version](https://img.shields.io/npm/v/eslint-plugin-node.svg)](https://www.npmjs.com/package/eslint-plugin-node)
[![Downloads/month](https://img.shields.io/npm/dm/eslint-plugin-node.svg)](http://www.npmtrends.com/eslint-plugin-node)
[![Build Status](https://travis-ci.org/mysticatea/eslint-plugin-node.svg?branch=master)](https://travis-ci.org/mysticatea/eslint-plugin-node)
[![Coverage Status](https://coveralls.io/repos/mysticatea/eslint-plugin-node/badge.svg?branch=master)](https://coveralls.io/r/mysticatea/eslint-plugin-node?branch=master)
[![Dependency Status](https://david-dm.org/mysticatea/eslint-plugin-node.svg)](https://david-dm.org/mysticatea/eslint-plugin-node)

Additional ESLint's rules for Node.js

## Install & Usage

```
> npm install --save-dev eslint eslint-plugin-node
```

- Requires Node.js `^0.10.0 || ^0.12.0 || ^4.0.0 || >=6.0.0`
- Requires ESLint `>=2.0.0`

**.eslintrc**

```json
{
    "plugins": ["node"],
    "extends": ["eslint:recommended", "plugin:node/recommended"]
}
```

## Configs

This plugin provides `plugin:node/recommended` preset config.
This preset config:

- enables the environment of ES2015 (ES6) and Node.js.
- enables rules which are given :star: in the following table.

**Note:** It recommends a use of [the "engines" field of package.json](https://docs.npmjs.com/files/package.json#engines). The "engines" field is used by [no-unsupported-features](docs/rules/no-unsupported-features.md) rule.

## Rules

|        |          | Rule ID                                                          | Description |
|:------:|:--------:|:-----------------------------------------------------------------|:------------|
| :star: |          | [no-deprecated-api](docs/rules/no-deprecated-api.md)             | Disallow deprecated API.
|        |          | [no-missing-import](docs/rules/no-missing-import.md)             | Disallow `import` and `export` declarations for files that don't exist.
| :star: |          | [no-missing-require](docs/rules/no-missing-require.md)           | Disallow `require()`s for files that don't exist.
|        |          | [no-unpublished-import](docs/rules/no-unpublished-import.md)     | Disallow `import` and `export` declarations for files that are not published.
| :star: |          | [no-unpublished-require](docs/rules/no-unpublished-require.md)   | Disallow `require()`s for files that are not published.
| :star: |          | [no-unsupported-features](docs/rules/no-unsupported-features.md) | Disallow unsupported ECMAScript features on the specified version.
|        |          | [process-exit-as-throw](docs/rules/process-exit-as-throw.md)     | Make the same code path as throw at `process.exit()`. (⚠ Experimental)
| :star: | :pencil: | [shebang](docs/rules/shebang.md)                                 | Suggest correct usage of shebang.

- :star: - the mark of a recommended rule.
- :pencil: - the mark of a fixable rule.

## Semantic Versioning Policy

`eslint-plugin-node` follows [semantic versioning](http://semver.org/) and [ESLint's Semantic Versioning Policy](https://github.com/eslint/eslint#semantic-versioning-policy).

- Patch release (intended to not break your lint build)
    - A bug fix in a rule that results in `eslint-plugin-node` reporting fewer errors.
    - Improvements to documentation.
    - Non-user-facing changes such as refactoring code, adding, deleting, or modifying tests, and increasing test coverage.
    - Re-releasing after a failed release (i.e., publishing a release that doesn't work for anyone).
- Minor release (might break your lint build)
    - A bug fix in a rule that results in `eslint-plugin-node` reporting more errors.
    - A new rule is created.
    - A new option to an existing rule is created.
    - An existing rule is deprecated.
- Major release (likely to break your lint build)
    - A support for old Node version is dropped.
    - A support for old ESLint version is dropped.
    - An existing rule is removed.
    - An existing option of a rule is removed.
    - An existing config is updated.

## FAQ

Q: The `no-missing-import` / `no-missing-require` rules don't work with nested folders in SublimeLinter-eslint

A: See [context.getFilename() in rule returns relative path](https://github.com/roadhump/SublimeLinter-eslint#contextgetfilename-in-rule-returns-relative-path) in the SublimeLinter-eslint FAQ.
