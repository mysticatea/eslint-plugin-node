# Disallow unsupported `child_process` APIs on the specified version (no-unsupported-features/child_process)

Node.js community is improving built-in modules continuously.
You can check [Node.js Documentation](https://nodejs.org/api/) to know which Node.js version supports each Node.js API.

This rule reports unsupported `child_process` module's APIs on the configured Node.js version as lint errors.
Editor integrations of ESLint would be useful to know it in real-time.

## Rule Details

This rule reports APIs of the `child_process` module on the basis of [Node.js v10.6.0 Documentation](https://nodejs.org/docs/v10.6.0/api/child_process.html).

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
    "node/no-unsupported-features/child_process": ["error", {
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

- `"child_process.ChildProcess"`

### Known limitations

This rule cannot find non-static things.
E.g., the use of instance methods.

This means the following methods are not reported:

- [child_process.exec(command[, options][, callback])](https://nodejs.org/docs/v10.6.0/api/child_process.html#child_process_child_process_exec_command_options_callback)
    - `options.windowsHide` (Added in v8.8.0)
- [child_process.execFile(file[, args][, options][, callback])](https://nodejs.org/docs/v10.6.0/api/child_process.html#child_process_child_process_execfile_file_args_options_callback)
    - `options.windowsHide` (Added in v8.8.0)
- [child_process.fork(modulePath[, args][, options])](https://nodejs.org/docs/v10.6.0/api/child_process.html#child_process_child_process_fork_modulepath_args_options)
    - `options.stdio` (Added in v6.4.0. Can be a string in v8.0.0)
- [child_process.spawn(command[, args][, options])](https://nodejs.org/docs/v10.6.0/api/child_process.html#child_process_child_process_spawn_command_args_options)
    - `options.shell` (Added in v5.7.0)
    - `options.argv0` (Added in v6.4.0)
    - `options.windowsHide` (Added in v8.8.0)
- [child_process.execFileSync(file[, args][, options])](https://nodejs.org/docs/v10.6.0/api/child_process.html#child_process_child_process_execfilesync_file_args_options)
    - `options.windowsHide` (Added in v8.8.0)
- [child_process.execSync(command[, options])](https://nodejs.org/docs/v10.6.0/api/child_process.html#child_process_child_process_execsync_command_options)
    - `options.windowsHide` (Added in v8.8.0)
- [child_process.spawnSync(command[, args][, options])](https://nodejs.org/docs/v10.6.0/api/child_process.html#child_process_child_process_spawnsync_command_args_options)
    - `options.shell` (Added in v5.7.0)
    - `options.windowsHide` (Added in v8.8.0)
- [subprocess.send(message[, sendHandle[, options]][, callback])](https://nodejs.org/docs/v10.6.0/api/child_process.html#child_process_subprocess_send_message_sendhandle_options_callback)
    - `callback` (Added in v4.0.0)
    - `options` (Added in v5.8.0)

[engines]: https://docs.npmjs.com/files/package.json#engines
