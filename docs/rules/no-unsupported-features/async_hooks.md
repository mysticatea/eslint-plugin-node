# Disallow unsupported `async_hooks` APIs on the specified version (no-unsupported-features/async_hooks)

Node.js community is improving built-in modules continuously.
You can check [Node.js Documentation](https://nodejs.org/api/) to know which Node.js version supports each Node.js API.

This rule reports unsupported `async_hooks` module's APIs on the configured Node.js version as lint errors.
Editor integrations of ESLint would be useful to know it in real-time.

## Rule Details

This rule reports APIs of the `async_hooks` module on the basis of [Node.js v10.6.0 Documentation](https://nodejs.org/docs/v10.6.0/api/async_hooks.html).

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

### Options

```json
{
    "node/no-unsupported-features/async_hooks": ["error", {
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

- `"async_hooks"`
- `"async_hooks.createHook"`

### Known limitations

This rule cannot find non-static things.
E.g., the use of instance methods.

This means the following methods are not reported:

- [asyncResource.runInAsyncScope(fn[, thisArg, ...args])](https://nodejs.org/docs/v10.6.0/api/async_hooks.html#async_hooks_asyncresource_runinasyncscope_fn_thisarg_args) (Added in v9.6.0)

[engines]: https://docs.npmjs.com/files/package.json#engines
