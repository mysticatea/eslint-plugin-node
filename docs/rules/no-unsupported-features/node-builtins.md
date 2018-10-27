# Disallow unsupported Node.js built-in APIs on the specified version (no-unsupported-features/node-builtins)

Node.js community is improving built-in APIs continuously.
You can check [Node.js Documentation](https://nodejs.org/api/) to know which Node.js version supports each Node.js API.

This rule reports unsupported Node.js built-in APIs on the configured Node.js version as lint errors.
Editor integrations of ESLint would be useful to know it in real-time.

## Rule Details

This rule reports APIs of Node.js built-in APIs on the basis of [Node.js v11.0.0 Documentation](https://nodejs.org/docs/v11.0.0/api/).

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
    "node/no-unsupported-features/node-builtins": ["error", {
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

**Globals:**

- `"Buffer.alloc"`
- `"Buffer.allocUnsafe"`
- `"Buffer.allocUnsafeSlow"`
- `"Buffer.from"`
- `"TextDecoder"`
- `"TextEncoder"`
- `"URL"`
- `"URLSearchParams"`
- `"console.clear"`
- `"console.count"`
- `"console.countReset"`
- `"console.debug"`
- `"console.dirxml"`
- `"console.group"`
- `"console.groupCollapsed"`
- `"console.groupEnd"`
- `"console.table"`
- `"console.markTimeline"`
- `"console.profile"`
- `"console.profileEnd"`
- `"console.timeLog"`
- `"console.timeStamp"`
- `"console.timeline"`
- `"console.timelineEnd"`
- `"process.argv0"`
- `"process.channel"`
- `"process.cpuUsage"`
- `"process.emitWarning"`
- `"process.getegid"`
- `"process.geteuid"`
- `"process.hasUncaughtExceptionCaptureCallback"`
- `"process.hrtime.bigint"`
- `"process.ppid"`
- `"process.release"`
- `"process.setegid"`
- `"process.seteuid"`
- `"process.setUncaughtExceptionCaptureCallback"`
- `"queueMicrotask"`
- `"require.resolve.paths"`

**`assert` module:**

- `"assert.deepStrictEqual"`
- `"assert.doesNotReject"`
- `"assert.notDeepStrictEqual"`
- `"assert.rejects"`
- `"assert.strict"`
- `"assert.strict.doesNotReject"`
- `"assert.strict.rejects"`

**`async_hooks` module:**

- `"async_hooks"`
- `"async_hooks.createHook"`

**`buffer` module:**

- `"buffer.Buffer.alloc"`
- `"buffer.Buffer.allocUnsafe"`
- `"buffer.Buffer.allocUnsafeSlow"`
- `"buffer.Buffer.from"`
- `"buffer.constants"`
- `"buffer.kMaxLength"`
- `"buffer.transcode"`

**`child_process` module:**

- `"child_process.ChildProcess"`

**`console` module:**

- `"console.clear"`
- `"console.count"`
- `"console.countReset"`
- `"console.debug"`
- `"console.dirxml"`
- `"console.group"`
- `"console.groupCollapsed"`
- `"console.groupEnd"`
- `"console.table"`
- `"console.markTimeline"`
- `"console.profile"`
- `"console.profileEnd"`
- `"console.timeLog"`
- `"console.timeStamp"`
- `"console.timeline"`
- `"console.timelineEnd"`

**`crypto` module:**

- `"crypto.Certificate.exportChallenge"`
- `"crypto.Certificate.exportPublicKey"`
- `"crypto.Certificate.verifySpkac"`
- `"crypto.constants"`
- `"crypto.fips"`
- `"crypto.generateKeyPair"`
- `"crypto.generateKeyPairSync"`
- `"crypto.getCurves"`
- `"crypto.getFips"`
- `"crypto.privateEncrypt"`
- `"crypto.publicDecrypt"`
- `"crypto.randomFillSync"`
- `"crypto.randomFill"`
- `"crypto.scrypt"`
- `"crypto.scryptSync"`
- `"crypto.setFips"`
- `"crypto.timingSafeEqual"`

**`dns` module:**

- `"dns.Resolver"`
- `"dns.resolvePtr"`
- `"dns.promises"`

**`fs` module:**

- `"fs.Dirent"`
- `"fs.copyFile"`
- `"fs.copyFileSync"`
- `"fs.mkdtemp"`
- `"fs.mkdtempSync"`
- `"fs.realpath.native"`
- `"fs.realpathSync.native"`
- `"fs.promises"`

**`http2` module:**

- `"http2"`

**`inspector` module:**

- `"inspector"`

**`module` module:**

- `"module.builtinModules"`

**`os` module:**

- `"os.constants"`
- `"os.constants.priority"`
- `"os.getPriority"`
- `"os.homedir"`
- `"os.setPriority"`
- `"os.userInfo"`

**`path` module:**

- `"path.toNamespacedPath"`

**`perf_hooks` module:**

- `"perf_hooks"`

**`process` module:**

- `"process.allowedNodeEnvironmentFlags"`
- `"process.argv0"`
- `"process.channel"`
- `"process.cpuUsage"`
- `"process.emitWarning"`
- `"process.getegid"`
- `"process.geteuid"`
- `"process.hasUncaughtExceptionCaptureCallback"`
- `"process.hrtime.bigint"`
- `"process.ppid"`
- `"process.release"`
- `"process.setegid"`
- `"process.seteuid"`
- `"process.setUncaughtExceptionCaptureCallback"`

**`stream` module:**

- `"stream.finished"`
- `"stream.pipeline"`

**`trace_events` module:**

- `"trace_events"`

**`url` module:**

- `"url.URL"`
- `"url.URLSearchParams"`
- `"url.domainToASCII"`
- `"url.domainToUnicode"`

**`util` module:**

- `"util.callbackify"`
- `"util.formatWithOptions"`
- `"util.getSystemErrorName"`
- `"util.inspect.custom"`
- `"util.inspect.defaultOptions"`
- `"util.isDeepStrictEqual"`
- `"util.promisify"`
- `"util.TextDecoder"`
- `"util.TextEncoder"`
- `"util.types"`
- `"util.types.isBoxedPrimitive"`

**`v8` module:**

- `"v8"`
- `"v8.cachedDataVersionTag"`
- `"v8.getHeapSpaceStatistics"`
- `"v8.serialize"`
- `"v8.deserialize"`
- `"v8.Serializer"`
- `"v8.Deserializer"`
- `"v8.DefaultSerializer"`
- `"v8.DefaultDeserializer"`

**`vm` module:**

- `"vm.Module"`
- `"vm.compileFunction"`

**`worker_threads` module:**

- `"worker_threads"`

</details>

### Known limitations

This rule cannot find non-static things.
For example:

- New properties and methods of instances.
- New parameters of functions.
- New `options` properties of function parameters.
- New events.

[engines]: https://docs.npmjs.com/files/package.json#engines
