# eslint-plugin-n

> forked from [eslint-plugin-node](https://www.npmjs.com/package/eslint-plugin-node) v11.1.0. as the original repository seems [no longer maintained](https://github.com/mysticatea/eslint-plugin-node/issues/300).

[![npm version](https://img.shields.io/npm/v/eslint-plugin-n.svg)](https://www.npmjs.com/package/eslint-plugin-n) [![Downloads/month](https://img.shields.io/npm/dm/eslint-plugin-n.svg)](http://www.npmtrends.com/eslint-plugin-n) [![Build Status](https://github.com/weiran-zsd/eslint-plugin-node/workflows/CI/badge.svg)](https://github.com/weiran-zsd/eslint-plugin-node/actions) [![Coverage Status](https://codecov.io/gh/weiran-zsd/eslint-plugin-node/branch/master/graph/badge.svg)](https://codecov.io/gh/weiran-zsd/eslint-plugin-node) [![Dependency Status](https://david-dm.org/weiran-zsd/eslint-plugin-node.svg)](https://david-dm.org/weiran-zsd/eslint-plugin-node)

Additional ESLint's rules for Node.js

## 💿 Install & Usage

```
$ npm install --save-dev eslint eslint-plugin-n
```

-   Requires Node.js `>=12.22.0`
-   Requires ESLint `>=7.0.0`

**Note:** It recommends a use of [the "engines" field of package.json](https://docs.npmjs.com/files/package.json#engines). The "engines" field is used by `n/no-unsupported-features/*` rules.

**.eslintrc.json** (An example)

```jsonc
{
    "extends": ["eslint:recommended", "plugin:n/recommended"],
    "parserOptions": {
        // Only ESLint 6.2.0 and later support ES2020.
        "ecmaVersion": 2020
    },
    "rules": {
        "n/exports-style": ["error", "module.exports"],
        "n/file-extension-in-import": ["error", "always"],
        "n/prefer-global/buffer": ["error", "always"],
        "n/prefer-global/console": ["error", "always"],
        "n/prefer-global/process": ["error", "always"],
        "n/prefer-global/url-search-params": ["error", "always"],
        "n/prefer-global/url": ["error", "always"],
        "n/prefer-promises/dns": "error",
        "n/prefer-promises/fs": "error"
    }
}
```

**package.json** (An example)

```json
{
    "name": "your-module",
    "version": "1.0.0",
    "type": "commonjs",
    "engines": {
        "node": ">=8.10.0"
    }
}
```

## 📖 Rules

-   ⭐️ - the mark of recommended rules.
-   ✒️ - the mark of fixable rules.

<!--RULES_TABLE_START-->
### Possible Errors

| Rule ID | Description |    |
|:--------|:------------|:--:|
| [n/handle-callback-err](./docs/rules/handle-callback-err.md) | require error handling in callbacks |  |
| [n/no-callback-literal](./docs/rules/no-callback-literal.md) | ensure Node.js-style error-first callback pattern is followed |  |
| [n/no-exports-assign](./docs/rules/no-exports-assign.md) | disallow the assignment to `exports` | ⭐️ |
| [n/no-extraneous-import](./docs/rules/no-extraneous-import.md) | disallow `import` declarations which import extraneous modules | ⭐️ |
| [n/no-extraneous-require](./docs/rules/no-extraneous-require.md) | disallow `require()` expressions which import extraneous modules | ⭐️ |
| [n/no-missing-import](./docs/rules/no-missing-import.md) | disallow `import` declarations which import non-existence modules | ⭐️ |
| [n/no-missing-require](./docs/rules/no-missing-require.md) | disallow `require()` expressions which import non-existence modules | ⭐️ |
| [n/no-new-require](./docs/rules/no-new-require.md) | disallow `new` operators with calls to `require` |  |
| [n/no-path-concat](./docs/rules/no-path-concat.md) | disallow string concatenation with `__dirname` and `__filename` |  |
| [n/no-process-exit](./docs/rules/no-process-exit.md) | disallow the use of `process.exit()` |  |
| [n/no-unpublished-bin](./docs/rules/no-unpublished-bin.md) | disallow `bin` files that npm ignores | ⭐️ |
| [n/no-unpublished-import](./docs/rules/no-unpublished-import.md) | disallow `import` declarations which import private modules | ⭐️ |
| [n/no-unpublished-require](./docs/rules/no-unpublished-require.md) | disallow `require()` expressions which import private modules | ⭐️ |
| [n/no-unsupported-features/es-builtins](./docs/rules/no-unsupported-features/es-builtins.md) | disallow unsupported ECMAScript built-ins on the specified version | ⭐️ |
| [n/no-unsupported-features/es-syntax](./docs/rules/no-unsupported-features/es-syntax.md) | disallow unsupported ECMAScript syntax on the specified version | ⭐️ |
| [n/no-unsupported-features/node-builtins](./docs/rules/no-unsupported-features/node-builtins.md) | disallow unsupported Node.js built-in APIs on the specified version | ⭐️ |
| [n/process-exit-as-throw](./docs/rules/process-exit-as-throw.md) | make `process.exit()` expressions the same code path as `throw` | ⭐️ |
| [n/shebang](./docs/rules/shebang.md) | suggest correct usage of shebang | ⭐️✒️ |

### Best Practices

| Rule ID | Description |    |
|:--------|:------------|:--:|
| [n/no-deprecated-api](./docs/rules/no-deprecated-api.md) | disallow deprecated APIs | ⭐️ |

### Stylistic Issues

| Rule ID | Description |    |
|:--------|:------------|:--:|
| [n/callback-return](./docs/rules/callback-return.md) | require `return` statements after callbacks |  |
| [n/exports-style](./docs/rules/exports-style.md) | enforce either `module.exports` or `exports` | ✒️ |
| [n/file-extension-in-import](./docs/rules/file-extension-in-import.md) | enforce the style of file extensions in `import` declarations | ✒️ |
| [n/global-require](./docs/rules/global-require.md) | require `require()` calls to be placed at top-level module scope |  |
| [n/no-mixed-requires](./docs/rules/no-mixed-requires.md) | disallow `require` calls to be mixed with regular variable declarations |  |
| [n/no-process-env](./docs/rules/no-process-env.md) | disallow the use of `process.env` |  |
| [n/no-restricted-import](./docs/rules/no-restricted-import.md) | disallow specified modules when loaded by `import` declarations |  |
| [n/no-restricted-require](./docs/rules/no-restricted-require.md) | disallow specified modules when loaded by `require` |  |
| [n/no-sync](./docs/rules/no-sync.md) | disallow synchronous methods |  |
| [n/prefer-global/buffer](./docs/rules/prefer-global/buffer.md) | enforce either `Buffer` or `require("buffer").Buffer` |  |
| [n/prefer-global/console](./docs/rules/prefer-global/console.md) | enforce either `console` or `require("console")` |  |
| [n/prefer-global/process](./docs/rules/prefer-global/process.md) | enforce either `process` or `require("process")` |  |
| [n/prefer-global/text-decoder](./docs/rules/prefer-global/text-decoder.md) | enforce either `TextDecoder` or `require("util").TextDecoder` |  |
| [n/prefer-global/text-encoder](./docs/rules/prefer-global/text-encoder.md) | enforce either `TextEncoder` or `require("util").TextEncoder` |  |
| [n/prefer-global/url-search-params](./docs/rules/prefer-global/url-search-params.md) | enforce either `URLSearchParams` or `require("url").URLSearchParams` |  |
| [n/prefer-global/url](./docs/rules/prefer-global/url.md) | enforce either `URL` or `require("url").URL` |  |
| [n/prefer-promises/dns](./docs/rules/prefer-promises/dns.md) | enforce `require("dns").promises` |  |
| [n/prefer-promises/fs](./docs/rules/prefer-promises/fs.md) | enforce `require("fs").promises` |  |

### Deprecated rules

These rules have been deprecated in accordance with the [deprecation policy](https://eslint.org/docs/user-guide/rule-deprecation), and replaced by newer rules:

| Rule ID | Replaced by |
|:--------|:------------|
| [n/no-hide-core-modules](./docs/rules/no-hide-core-modules.md) | (nothing) |
| [n/no-unsupported-features](./docs/rules/no-unsupported-features.md) | [n/no-unsupported-features/es-syntax](./docs/rules/no-unsupported-features/es-syntax.md) and [n/no-unsupported-features/es-builtins](./docs/rules/no-unsupported-features/es-builtins.md) |

<!--RULES_TABLE_END-->

## 🔧 Configs

This plugin provides three configs:

-   `plugin:n/recommended` considers both CommonJS and ES Modules. If [`"type":"module"` field](https://medium.com/@nodejs/announcing-a-new-experimental-modules-1be8d2d6c2ff#b023) existed in package.json then it considers files as ES Modules. Otherwise it considers files as CommonJS. In addition, it considers `*.mjs` files as ES Modules and `*.cjs` files as CommonJS.
-   `plugin:n/recommended-module` considers all files as ES Modules.
-   `plugin:n/recommended-script` considers all files as CommonJS.

Those preset config:

-   enable [no-process-exit](http://eslint.org/docs/rules/no-process-exit) rule because [the official document](https://nodejs.org/api/process.html#process_process_exit_code) does not recommend a use of `process.exit()`.
-   enable plugin rules which are given :star: in the above table.
-   add `{ecmaVersion: 2019}` and etc into `parserOptions`.
-   add proper globals into `globals`.
-   add this plugin into `plugins`.

## 👫 FAQ

-   Q: The `no-missing-import` / `no-missing-require` rules don't work with nested folders in SublimeLinter-eslint
-   A: See [context.getFilename() in rule returns relative path](https://github.com/roadhump/SublimeLinter-eslint#contextgetfilename-in-rule-returns-relative-path) in the SublimeLinter-eslint FAQ.

## 🚥 Semantic Versioning Policy

`eslint-plugin-n` follows [semantic versioning](http://semver.org/) and [ESLint's Semantic Versioning Policy](https://github.com/eslint/eslint#semantic-versioning-policy).

-   Patch release (intended to not break your lint build)
    -   A bug fix in a rule that results in it reporting fewer errors.
    -   Improvements to documentation.
    -   Non-user-facing changes such as refactoring code, adding, deleting, or modifying tests, and increasing test coverage.
    -   Re-releasing after a failed release (i.e., publishing a release that doesn't work for anyone).
-   Minor release (might break your lint build)
    -   A bug fix in a rule that results in it reporting more errors.
    -   A new rule is created.
    -   A new option to an existing rule is created.
    -   An existing rule is deprecated.
-   Major release (likely to break your lint build)
    -   A support for old Node version is dropped.
    -   A support for old ESLint version is dropped.
    -   An existing rule is changed in it reporting more errors.
    -   An existing rule is removed.
    -   An existing option of a rule is removed.
    -   An existing config is updated.

## 📰 Changelog

-   [GitHub Releases](https://github.com/weiran-zsd/eslint-plugin-node/releases)

## ❤️ Contributing

Welcome contributing!

Please use GitHub's Issues/PRs.

### Development Tools

-   `npm test` runs tests and measures coverage.
-   `npm run coverage` shows the coverage result of `npm test` command.
-   `npm run clean` removes the coverage result of `npm test` command.
