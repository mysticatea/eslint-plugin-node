# node/no-deprecated-api
> disallow deprecated APIs
> - ⭐️ This rule is included in `plugin:node/recommended` preset.

Node has many deprecated API.
The community is going to remove those API from Node in future, so we should not use those.

## 📖 Rule Details

Examples of :-1: **incorrect** code for this rule:

```js
/*eslint node/no-deprecated-api: "error" */

var fs = require("fs");
fs.exists("./foo.js", function() {}); /*ERROR: 'fs.exists' was deprecated since v4. Use 'fs.stat()' or 'fs.access()' instead.*/

// Also, it can report the following patterns.
var exists = require("fs").exists;    /*ERROR: 'fs.exists' was deprecated since v4. Use 'fs.stat()' or 'fs.access()' instead.*/
const {exists} = require("fs");       /*ERROR: 'fs.exists' was deprecated since v4. Use 'fs.stat()' or 'fs.access()' instead.*/


// And other deprecated API below.
```

This rule reports the following deprecated API.

- [_linklist](https://nodejs.org/docs/v8.0.0/api/deprecations.html#deprecations_dep0002_require_linklist)
- [_stream_wrap](https://nodejs.org/docs/v12.0.0/api/deprecations.html#deprecations_dep0125_require_stream_wrap)
- assert
    - [deepEqual](https://nodejs.org/dist/v10.0.0/docs/api/assert.html#assert_assert_deepequal_actual_expected_message)
    - [equal](https://nodejs.org/dist/v10.0.0/docs/api/assert.html#assert_assert_equal_actual_expected_message)
    - [notDeepEqual](https://nodejs.org/dist/v10.0.0/docs/api/assert.html#assert_assert_notdeepequal_actual_expected_message)
    - [notEqual](https://nodejs.org/dist/v10.0.0/docs/api/assert.html#assert_assert_notequal_actual_expected_message)
- async_hooks
    - [currentId](https://nodejs.org/dist/v8.2.0/docs/api/deprecations.html#deprecations_dep0070_async_hooks_currentid)
    - [triggerId](https://nodejs.org/dist/v8.2.0/docs/api/deprecations.html#deprecations_dep0071_async_hooks_triggerid)
- buffer
    - [Buffer constructors](https://nodejs.org/dist/v6.0.0/docs/api/buffer.html#buffer_class_buffer) (Use [safe-buffer](https://www.npmjs.com/package/safe-buffer) module for `Node@<4.5.0`)
    - [SlowBuffer class](https://nodejs.org/dist/v6.0.0/docs/api/buffer.html#buffer_class_slowbuffer)
- constants (undocumented)
- crypto
    - [_toBuf](https://nodejs.org/dist/v11.0.0/docs/api/deprecations.html#deprecations_dep0114_crypto_tobuf)
    - `Credentials` (undocumented)
    - [DEFAULT_ENCODING](https://nodejs.org/dist/v10.0.0/docs/api/crypto.html#crypto_crypto_default_encoding)
    - [createCredentials](https://nodejs.org/dist/v0.12.0/docs/api/crypto.html#crypto_crypto_createcredentials_details)
    - [createCipher](https://nodejs.org/dist/v10.0.0/docs/api/crypto.html#crypto_crypto_createcipher_algorithm_password_options)
    - [createDecipher](https://nodejs.org/dist/v10.0.0/docs/api/crypto.html#crypto_crypto_createdecipher_algorithm_password_options)
    - [fips](https://nodejs.org/dist/v10.0.0/docs/api/crypto.html#crypto_crypto_fips)
    - [prng](https://nodejs.org/dist/v11.0.0/docs/api/deprecations.html#deprecations_dep0115_crypto_prng_crypto_pseudorandombytes_crypto_rng)
    - [pseudoRandomBytes](https://nodejs.org/dist/v11.0.0/docs/api/deprecations.html#deprecations_dep0115_crypto_prng_crypto_pseudorandombytes_crypto_rng)
    - [rng](https://nodejs.org/dist/v11.0.0/docs/api/deprecations.html#deprecations_dep0115_crypto_prng_crypto_pseudorandombytes_crypto_rng)
- [domain](https://nodejs.org/dist/v4.0.0/docs/api/domain.html#domain_domain)
- events
    - [EventEmitter.listenerCount](https://nodejs.org/dist/v4.0.0/docs/api/events.html#events_class_method_eventemitter_listenercount_emitter_event)
- freelist (undocumented)
- fs
    - `SyncWriteStream` (undocumented)
    - [exists](https://nodejs.org/dist/v4.0.0/docs/api/fs.html#fs_fs_exists_path_callback)
    - [lchmod](https://nodejs.org/dist/v8.0.0/docs/api/fs.html#fs_fs_lchmod_path_mode_callback)
    - [lchmodSync](https://nodejs.org/dist/v8.0.0/docs/api/fs.html#fs_fs_lchmodsync_path_mode)
    - [lchown](https://nodejs.org/dist/v8.0.0/docs/api/fs.html#fs_fs_lchown_path_uid_gid_callback)
    - [lchownSync](https://nodejs.org/dist/v8.0.0/docs/api/fs.html#fs_fs_lchownsync_path_uid_gid)
- globals
    - [require.extensions](https://nodejs.org/dist/v0.12.0/docs/api/globals.html#globals_require_extensions)
    - [GLOBAL](https://nodejs.org/api/deprecations.html#deprecations_dep0016_global_root)
    - [root](https://nodejs.org/api/deprecations.html#deprecations_dep0016_global_root)
    - [Intl.v8BreakIterator](https://nodejs.org/api/deprecations.html#deprecations_dep0017_intl_v8breakiterator)
    - [COUNTER_NET_SERVER_CONNECTION](https://nodejs.org/dist/v11.0.0/docs/api/deprecations.html#deprecations_dep0120_windows_performance_counter_support)
    - [COUNTER_NET_SERVER_CONNECTION_CLOSE](https://nodejs.org/dist/v11.0.0/docs/api/deprecations.html#deprecations_dep0120_windows_performance_counter_support)
    - [COUNTER_HTTP_SERVER_REQUEST](https://nodejs.org/dist/v11.0.0/docs/api/deprecations.html#deprecations_dep0120_windows_performance_counter_support)
    - [COUNTER_HTTP_SERVER_RESPONSE](https://nodejs.org/dist/v11.0.0/docs/api/deprecations.html#deprecations_dep0120_windows_performance_counter_support)
    - [COUNTER_HTTP_CLIENT_REQUEST](https://nodejs.org/dist/v11.0.0/docs/api/deprecations.html#deprecations_dep0120_windows_performance_counter_support)
    - [COUNTER_HTTP_CLIENT_RESPONSE](https://nodejs.org/dist/v11.0.0/docs/api/deprecations.html#deprecations_dep0120_windows_performance_counter_support)
- http
    - [createClient](https://nodejs.org/dist/v0.10.0/docs/api/http.html#http_http_createclient_port_host)
- module
    - [createRequireFromPath](https://nodejs.org/dist/v12.2.0/docs/api/deprecations.html#deprecations_dep0130_module_createrequirefrompath)
    - `requireRepl` (undocumented)
    - [_debug](https://nodejs.org/dist/v9.0.0/docs/api/deprecations.html#deprecations_dep0077_module_debug)
- net
    - [_setSimultaneousAccepts](https://nodejs.org/docs/v12.0.0/api/deprecations.html#deprecations_dep0121_net_setsimultaneousaccepts)
- os
    - `tmpDir` (undocumented)
    - `getNetworkInterfaces` (undocumented)
- path
    - [_makeLong](https://nodejs.org/dist/v9.0.0/docs/api/deprecations.html#deprecations_dep0080_path_makelong)
- process
    - `EventEmitter` (undocumented)
    - `assert` (undocumented)
    - [binding](https://nodejs.org/dist/v10.9.0/docs/api/deprecations.html#deprecations_dep0111_process_binding)
- [punycode](https://nodejs.org/dist/v7.0.0/docs/api/punycode.html)
- readline
    - `codePointAt` (undocumented)
    - `getStringWidth` (undocumented)
    - `isFullWidthCodePoint` (undocumented)
    - `stripVTControlCharacters` (undocumented)
- repl
    - [process.env.NODE_REPL_HISTORY_FILE](https://nodejs.org/dist/v4.0.0/docs/api/repl.html#repl_node_repl_history_file)
- [sys](https://nodejs.org/api/deprecations.html#deprecations_dep0025_require_sys)
- timers
    - `enroll` (undocumented)
    - `unenroll` (undocumented)
- tls
    - [CleartextStream](https://nodejs.org/dist/v0.10.0/docs/api/tls.html#tls_class_tls_cleartextstream)
      (this class was removed on v0.11.3, but never deprecated in documents)
    - [CryptoStream](https://nodejs.org/dist/v0.12.0/docs/api/tls.html#tls_class_cryptostream)
    - [SecurePair](https://nodejs.org/dist/v6.0.0/docs/api/tls.html#tls_class_securepair)
    - `convertNPNProtocols` (undocumented)
    - [createSecurePair](https://nodejs.org/dist/v6.0.0/docs/api/tls.html#tls_tls_createsecurepair_context_isserver_requestcert_rejectunauthorized_options)
    - [parseCertString](https://nodejs.org/dist/v8.6.0/docs/api/deprecations.html#deprecations_dep0076_tls_parsecertstring)
- tty
    - [setRawMode](https://nodejs.org/dist/v0.10.0/docs/api/tty.html#tty_tty_setrawmode_mode)
- url
    - [parse](https://nodejs.org/dist/v11.0.0/docs/api/deprecations.html#deprecations_dep0116_legacy_url_api)
    - [resolve](https://nodejs.org/dist/v11.0.0/docs/api/deprecations.html#deprecations_dep0116_legacy_url_api)
- util
    - [debug](https://nodejs.org/dist/v0.12.0/docs/api/util.html#util_util_debug_string)
    - [error](https://nodejs.org/dist/v0.12.0/docs/api/util.html#util_util_error)
    - [isArray](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_isarray_object)
    - [isBoolean](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_isboolean_object)
    - [isBuffer](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_isbuffer_object)
    - [isDate](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_isdate_object)
    - [isError](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_iserror_object)
    - [isFunction](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_isfunction_object)
    - [isNull](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_isnull_object)
    - [isNullOrUndefined](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_isnullorundefined_object)
    - [isNumber](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_isnumber_object)
    - [isObject](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_isobject_object)
    - [isPrimitive](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_isprimitive_object)
    - [isRegExp](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_isregexp_object)
    - [isString](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_isstring_object)
    - [isSymbol](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_issymbol_object)
    - [isUndefined](https://nodejs.org/dist/v4.0.0/docs/api/util.html#util_util_isundefined_object)
    - [log](https://nodejs.org/dist/v6.0.0/docs/api/util.html#util_util_log_string)
    - [print](https://nodejs.org/dist/v0.12.0/docs/api/util.html#util_util_print)
    - [pump](https://nodejs.org/dist/v0.10.0/docs/api/util.html#util_util_pump_readablestream_writablestream_callback)
    - [puts](https://nodejs.org/dist/v0.12.0/docs/api/util.html#util_util_puts)
    - [_extend](https://nodejs.org/dist/v6.0.0/docs/api/util.html#util_util_extend_obj)
- vm
    - [runInDebugContext](https://nodejs.org/dist/v8.0.0/docs/api/vm.html#vm_vm_runindebugcontext_code)

> ⚠️ Note that userland modules don't hide core modules.
> For example, `require("punycode")` still imports the deprecated core module even if you executed `npm install punycode`.
> Use `require("punycode/")` to import userland modules rather than core modules.

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

This rule has 3 options.

```json
{
    "rules": {
        "node/no-deprecated-api": ["error", {
            "version": ">=8.0.0",
            "ignoreModuleItems": [],
            "ignoreGlobalItems": []
        }]
    }
}
```

#### version

As mentioned above, this rule reads the [engines] field of `package.json`.
But, you can overwrite the version by `version` option.

The `version` option accepts [the valid version range of `node-semver`](https://github.com/npm/node-semver#range-grammar).

#### ignoreModuleItems

This is the array of module names and module's member names.
Default is an empty array.

This rule ignores APIs that `ignoreModuleItems` includes.
This option can include the following values:

- `_linklist`
- `_stream_wrap`
- `assert.deepEqual`
- `assert.equal`
- `assert.notDeepEqual`
- `assert.notEqual`
- `async_hooks.currentId`
- `async_hooks.triggerId`
- `buffer.Buffer()`
- `new buffer.Buffer()`
- `buffer.SlowBuffer`
- `constants`
- `crypto._toBuf`
- `crypto.Credentials`
- `crypto.DEFAULT_ENCODING`
- `crypto.createCipher`
- `crypto.createCredentials`
- `crypto.createDecipher`
- `crypto.fips`
- `crypto.prng`
- `crypto.pseudoRandomBytes`
- `crypto.rng`
- `domain`
- `events.EventEmitter.listenerCount`
- `events.listenerCount`
- `freelist`
- `fs.SyncWriteStream`
- `fs.exists`
- `fs.lchmod`
- `fs.lchmodSync`
- `fs.lchown`
- `fs.lchownSync`
- `http.createClient`
- `module.Module.createRequireFromPath`
- `module.createRequireFromPath`
- `module.Module.requireRepl`
- `module.requireRepl`
- `module.Module._debug`
- `module._debug`
- `net._setSimultaneousAccepts`
- `os.tmpDir`
- `path._makeLong`
- `process.EventEmitter`
- `process.assert`
- `process.binding`
- `process.env.NODE_REPL_HISTORY_FILE`
- `process.report.triggerReport`
- `punycode`
- `readline.codePointAt`
- `readline.getStringWidth`
- `readline.isFullWidthCodePoint`
- `readline.stripVTControlCharacters`
- `sys`
- `timers.enroll`
- `timers.unenroll`
- `tls.CleartextStream`
- `tls.CryptoStream`
- `tls.SecurePair`
- `tls.convertNPNProtocols`
- `tls.createSecurePair`
- `tls.parseCertString`
- `tty.setRawMode`
- `url.parse`
- `url.resolve`
- `util.debug`
- `util.error`
- `util.isArray`
- `util.isBoolean`
- `util.isBuffer`
- `util.isDate`
- `util.isError`
- `util.isFunction`
- `util.isNull`
- `util.isNullOrUndefined`
- `util.isNumber`
- `util.isObject`
- `util.isPrimitive`
- `util.isRegExp`
- `util.isString`
- `util.isSymbol`
- `util.isUndefined`
- `util.log`
- `util.print`
- `util.pump`
- `util.puts`
- `util._extend`
- `vm.runInDebugContext`

Examples of :+1: **correct** code for the `{"ignoreModuleItems": ["new buffer.Buffer()"]}`:

```js
/*eslint node/no-deprecated-api: [error, {ignoreModuleItems: ["new buffer.Buffer()"]}] */

const buffer = require("buffer")
const data = new buffer.Buffer(10) // OK since it's in ignoreModuleItems.
```

#### ignoreGlobalItems

This is the array of global variable names and global variable's member names.
Default is an empty array.

This rule ignores APIs that `ignoreGlobalItems` includes.
This option can include the following values:

- `Buffer()`
- `new Buffer()`
- `COUNTER_NET_SERVER_CONNECTION`
- `COUNTER_NET_SERVER_CONNECTION_CLOSE`
- `COUNTER_HTTP_SERVER_REQUEST`
- `COUNTER_HTTP_SERVER_RESPONSE`
- `COUNTER_HTTP_CLIENT_REQUEST`
- `COUNTER_HTTP_CLIENT_RESPONSE`
- `Intl.v8BreakIterator`
- `require.extensions`
- `process.EventEmitter`
- `process.assert`
- `process.binding`
- `process.env.NODE_REPL_HISTORY_FILE`

Examples of :+1: **correct** code for the `{"ignoreGlobalItems": ["new Buffer()"]}`:

```js
/*eslint node/no-deprecated-api: [error, {ignoreGlobalItems: ["new Buffer()"]}] */

const data = new Buffer(10) // OK since it's in ignoreGlobalItems.
```

## ⚠️ Known Limitations

This rule cannot report the following cases:

### non-static properties

- async_hooks
    - [asyncResource.triggerId](https://nodejs.org/dist/v8.2.0/docs/api/deprecations.html#deprecations_dep0072_async_hooks_asyncresource_triggerid)
- buffer
    - [buf.parent](https://nodejs.org/dist/v8.0.0/docs/api/buffer.html#buffer_buf_parent)
- cluster
    - [worker.suicide](https://nodejs.org/dist/v6.0.0/docs/api/cluster.html#cluster_worker_suicide)
- crypto
    - [ecdh.setPublicKey](https://nodejs.org/dist/v6.0.0/docs/api/crypto.html#crypto_ecdh_setpublickey_public_key_encoding)
- http
    - [res.writeHeader()](https://nodejs.org/dist/v8.0.0/docs/api/deprecations.html#deprecations_dep0063_serverresponse_prototype_writeheader)
- net
    - [server.connections](https://nodejs.org/dist/v0.10.0/docs/api/net.html#net_server_connections)
- repl
    - `replServer.convertToContext` (undocumented)
    - [replServer.turnOffEditorMode](https://nodejs.org/dist/v9.0.0/docs/api/deprecations.html#deprecations_dep0078_replserver_turnoffeditormode)
    - [replServer.memory](https://nodejs.org/dist/v9.0.0/docs/api/deprecations.html#deprecations_dep0082_replserver_prototype_memory)

### types of arguments

- fs
    - `fs.truncate()` and `fs.truncateSync()` usage with a file descriptor has been deprecated.
- url
    - `url.format()` with legacy `urlObject` has been deprecated.

### dynamic things

```js
require(foo).aDeprecatedProperty;
require("http")[A_DEPRECATED_PROPERTY]();
```

### assignments to properties

```js
var obj = {
    Buffer: require("buffer").Buffer
};
new obj.Buffer(); /* missing. */
```

```js
var obj = {};
obj.Buffer = require("buffer").Buffer
new obj.Buffer(); /* missing. */
```

### giving arguments

```js
(function(Buffer) {
    new Buffer(); /* missing. */
})(require("buffer").Buffer);
```

### reassignments

```js
var Buffer = require("buffer").Buffer;
Buffer = require("another-buffer");
new Buffer(); /*ERROR: 'buffer.Buffer' constructor was deprecated.*/
```

## 🔎 Implementation

- [Rule source](../../lib/rules/no-deprecated-api.js)
- [Test source](../../tests/lib/rules/no-deprecated-api.js)
