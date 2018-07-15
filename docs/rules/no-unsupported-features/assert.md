# Disallow unsupported `assert` APIs on the specified version (no-unsupported-features/assert)

Node.js community is improving built-in modules continuously.
You can check [Node.js Documentation](https://nodejs.org/api/) to know which Node.js version supports each Node.js API.

This rule reports unsupported `assert` module's APIs on the configured Node.js version as lint errors.
Editor integrations of ESLint would be useful to know it in real-time.

## Rule Details

This rule reports APIs of the `assert` module on the basis of [Node.js v10.6.0 Documentation](https://nodejs.org/docs/v10.6.0/api/assert.html).

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

If you omit the [engines] field, this rule chooses `>=6.0.0` as the configured Node.js version since `6.0.0` is the minimum version the community is maintaining (see also [Node.js Release Working Group](https://github.com/nodejs/Release#readme)).

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

- `"assert.strict"`
- `"assert.strict.doesNotReject"`
- `"assert.strict.rejects"`
- `"assert.deepStrictEqual"`
- `"assert.doesNotReject"`
- `"assert.notDeepStrictEqual"`
- `"assert.rejects"`

### Known limitations

This rule cannot find non-static things.
E.g., the use of instance methods.

[engines]: https://docs.npmjs.com/files/package.json#engines
