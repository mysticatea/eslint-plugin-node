# node/no-unsupported-features/es-syntax
> disallow unsupported ECMAScript syntax on the specified version
> - ⭐️ This rule is included in `plugin:node/recommended` preset.

ECMAScript standard is updating every two months.
You can check [node.green](https://node.green/) to know which Node.js version supports each ECMAScript feature.

This rule reports unsupported ECMAScript syntax on the configured Node.js version as lint errors.
Editor integrations of ESLint would be useful to know it in real-time.

## 📖 Rule Details

### Supported ECMAScript features

This rule supports ECMAScript 2019 and proposals that have been approved as Stage 4 by August 2019.
See also [TC39 finished proposals](https://github.com/tc39/proposals/blob/master/finished-proposals.md).

Please configure your `.eslintrc` file to succeed to succeed in parsing the syntax.
For example, set `2020` to `parserOptions.ecmaVersion`.

### Configured Node.js version range

This rule reads the [engines] field of `package.json` to detect which Node.js versions your module is supporting.

I recommend the use of the [engines] field because it's the official way that indicates which Node.js versions your module is supporting.
For example of `package.json`:

```json
{
    "name": "your-module",
    "version": "1.0.0",
    "engines": {
        "node": ">=8.0.0"
    }
}
```

If you omit the [engines] field, this rule chooses `>=8.0.0` as the configured Node.js version since `8` is the minimum version the community is maintaining (see also [Node.js Release Working Group](https://github.com/nodejs/Release#readme)).

### Options

```json
{
    "node/no-unsupported-features/es-syntax": ["error", {
        "version": ">=8.0.0",
        "ignores": []
    }]
}
```

#### version

As mentioned above, this rule reads the [engines] field of `package.json`.
But, you can overwrite the version by `version` option.

The `version` option accepts [the valid version range of `node-semver`](https://github.com/npm/node-semver#range-grammar).

#### ignores

If you are using transpilers, maybe you want to ignore the warnings about some features.
You can use this `ignores` option to ignore the given features.

The `"ignores"` option accepts an array of the following strings.

<details>

**ES2020:**

- `"bigint"`
- `"dynamicImport"`

**ES2019:**

- `"jsonSuperset"`
- `"optionalCatchBinding"`

**ES2018:**

- `"asyncIteration"`
- `"malformedTemplateLiterals"`
- `"regexpLookbehind"`
- `"regexpNamedCaptureGroups"`
- `"regexpS"`
- `"regexpUnicodeProperties"`
- `"restSpreadProperties"`

**ES2017:**

- `"asyncFunctions"`
- `"trailingCommasInFunctions"`

**ES2016:**

- `"exponentialOperators"`

**ES2015:**

- `"arrowFunctions"`
- `"binaryNumericLiterals"`
- `"blockScopedFunctions"`
- `"blockScopedVariables"`
- `"classes"`
- `"computedProperties"`
- `"defaultParameters"`
- `"destructuring"`
- `"forOfLoops"`
- `"generators"`
- `"modules"`
- `"new.target"`
- `"objectSuperProperties"`
- `"octalNumericLiterals"`
- `"propertyShorthands"`
- `"regexpU"`
- `"regexpY"`
- `"restParameters"`
- `"spreadElements"`
- `"templateLiterals"`
- `"unicodeCodePointEscapes"`

</details>

[engines]: https://docs.npmjs.com/files/package.json#engines

## 🔎 Implementation

- [Rule source](../../../lib/rules/no-unsupported-features/es-syntax.js)
- [Test source](../../../tests/lib/rules/no-unsupported-features/es-syntax.js)
