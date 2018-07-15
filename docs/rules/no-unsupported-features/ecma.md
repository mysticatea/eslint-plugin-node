# Disallow unsupported ECMAScript features on the specified version (no-unsupported-features/ecma)

ECMAScript standard is updating every two months.
You can check [node.green](https://node.green/) to know which Node.js version supports each ECMAScript feature.

This rule reports unsupported ECMAScript features on the configured Node.js version as lint errors.
Editor integrations of ESLint would be useful to know it in real-time.

## Rule Details

### Configured Node.js version range

This rule reads the [engines] field of `package.json` to detect which Node.js versions your module is supporting.

I recommend the use of the [engines] field because it's the official way that indicates which Node.js versions your module is supporting.
For example of `package.json`:

```json
{
    "name": "your-module",
    "version": "1.0.0",
    "engines": {
        "node": ">=6.0.0"
    }
}
```

If you omit the [engines] field, this rule chooses `>=6.0.0` as the configured Node.js version since `6` is the minimum version the community is maintaining (see also [Node.js Release Working Group](https://github.com/nodejs/Release#readme)).

### Supported ECMAScript features

This rule supports ECMAScript 2018 and the features which are arrived at Stage 4 by May 2018.
See also [TC39 finished proposals](https://github.com/tc39/proposals/blob/master/finished-proposals.md).

Please configure your `.eslintrc` file to succeed to succeed in parsing those features.
For example of `.eslintrc.json`:

```json
{
    "env": {
        "es6": true
    },
    "parserOptions": {
        "ecmaVersion": 2019
    },
    "globals": {
        "Atomics": false,
        "SharedArrayBuffer": false
    }
}
```

### Options

```json
{
    "node/no-unsupported-features/ecma": ["error", {
        "version": ">=6.0.0",
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

**ES2019:**

- `"syntax"`
    - (nothing)
- `"runtime"`
    - (nothing)

**ES2018:**

- `"syntax"`
    - `"asyncIteration"`
    - `"malformedTemplateLiterals"`
    - `"regexpLookbehind"`
    - `"regexpNamedCaptureGroups"`
    - `"regexpS"`
    - `"regexpUnicodeProperties"`
    - `"restSpreadProperties"`
- `"runtime"`
    - (nothing)

**ES2017:**

- `"syntax"`
    - `"asyncFunctions"`
    - `"trailingCommasInFunctions"`
- `"runtime"`
    - `"Atomics"`
    - `"Object.values"`
    - `"Object.entries"`
    - `"Object.getOwnPropertyDescriptors"`
    - `"SharedArrayBuffer"`

**ES2016:**

- `"syntax"`
    - `"exponentialOperators"`
- `"runtime"`
    - (nothing)

**ES2015:**

- `"syntax"`
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
- `"runtime"`
    - `"Array.from"`
    - `"Array.of"`
    - `"Map"`
    - `"Math.acosh"`
    - `"Math.asinh"`
    - `"Math.atanh"`
    - `"Math.cbrt"`
    - `"Math.clz32"`
    - `"Math.cosh"`
    - `"Math.expm1"`
    - `"Math.fround"`
    - `"Math.hypot"`
    - `"Math.imul"`
    - `"Math.log10"`
    - `"Math.log1p"`
    - `"Math.log2"`
    - `"Math.sign"`
    - `"Math.sinh"`
    - `"Math.tanh"`
    - `"Math.trunc"`
    - `"Number.EPSILON"`
    - `"Number.isFinite"`
    - `"Number.isInteger"`
    - `"Number.isNaN"`
    - `"Number.isSafeInteger"`
    - `"Number.MAX_SAFE_INTEGER"`
    - `"Number.MIN_SAFE_INTEGER"`
    - `"Number.parseFloat"`
    - `"Number.parseInt"`
    - `"Object.assign"`
    - `"Object.getOwnPropertySymbols"`
    - `"Object.is"`
    - `"Object.setPrototypeOf"`
    - `"Promise"`
    - `"Proxy"`
    - `"Reflect"`
    - `"Set"`
    - `"String.fromCodePoint"`
    - `"String.raw"`
    - `"subclassingBuiltins"`
    - `"Symbol"`
    - `"TypedArrays"`
    - `"WeakMap"`
    - `"WeakSet"`

</details>

### Known limitations

This rule cannot find non-static things.
E.g., the use of instance methods.

[engines]: https://docs.npmjs.com/files/package.json#engines
