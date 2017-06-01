# Disallow deprecated API (no-deprecated-api)

Node has many deprecated API.
The community is going to remove those API from Node in future, so we should not use those.

## Rule Details

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

- _linklist (undocumented)
- buffer
    - [Buffer constructors](https://nodejs.org/dist/v6.0.0/docs/api/buffer.html#buffer_class_buffer) (Use [safe-buffer](https://www.npmjs.com/package/safe-buffer) module for `Node@<4.5.0`)
    - [SlowBuffer class](https://nodejs.org/dist/v6.0.0/docs/api/buffer.html#buffer_class_slowbuffer)
- constants (undocumented)
- crypto
    - `Credentials` (undocumented)
    - [createCredentials](https://nodejs.org/dist/v0.12.0/docs/api/crypto.html#crypto_crypto_createcredentials_details)
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
    - `Intl.v8BreakIterator` (undocumented)
- http
    - [createClient](https://nodejs.org/dist/v0.10.0/docs/api/http.html#http_http_createclient_port_host)
- module
    - `requireRepl` (undocumented)
- os
    - `tmpDir` (undocumented)
    - `getNetworkInterfaces` (undocumented)
- process
    - `EventEmitter` (undocumented)
- [punycode](https://nodejs.org/dist/v7.0.0/docs/api/punycode.html)
- readline
    - `codePointAt` (undocumented)
    - `getStringWidth` (undocumented)
    - `isFullWidthCodePoint` (undocumented)
    - `stripVTControlCharacters` (undocumented)
- repl
    - [process.env.NODE_REPL_HISTORY_FILE](https://nodejs.org/dist/v4.0.0/docs/api/repl.html#repl_node_repl_history_file)
- sys (undocumented)
- tls
    - [CleartextStream](https://nodejs.org/dist/v0.10.0/docs/api/tls.html#tls_class_tls_cleartextstream)
      (this class was removed on v0.11.3, but never deprecated in documents)
    - [CryptoStream](https://nodejs.org/dist/v0.12.0/docs/api/tls.html#tls_class_cryptostream)
    - [SecurePair](https://nodejs.org/dist/v6.0.0/docs/api/tls.html#tls_class_securepair)
    - [createSecurePair](https://nodejs.org/dist/v6.0.0/docs/api/tls.html#tls_tls_createsecurepair_context_isserver_requestcert_rejectunauthorized_options)
- tty
    - [setRawMode](https://nodejs.org/dist/v0.10.0/docs/api/tty.html#tty_tty_setrawmode_mode)
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

## Options

This rule has 2 options.

```json
{
    "rules": {
        "node/no-deprecated-api": ["error", {
            "ignoreModuleItems": [],
            "ignoreGlobalItems": []
        }]
    }
}
```

### ignoreModuleItems

This is the array of module names and module's member names.
Default is an empty array.

This rule ignores APIs that `ignoreModuleItems` includes.
This option can include the following values:

- `_linklist`
- `buffer.Buffer()`
- `new buffer.Buffer()`
- `buffer.SlowBuffer`
- `constants`
- `crypto.Credentials`
- `crypto.createCredentials`
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
- `module.Module.requireRepl`
- `module.requireRepl`
- `os.tmpDir`
- `punycode`
- `readline.codePointAt`
- `readline.getStringWidth`
- `readline.isFullWidthCodePoint`
- `readline.stripVTControlCharacters`
- `sys`
- `tls.CleartextStream`
- `tls.CryptoStream`
- `tls.SecurePair`
- `tls.createSecurePair`
- `tty.setRawMode`
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

### ignoreGlobalItems

This is the array of global variable names and global variable's member names.
Default is an empty array.

This rule ignores APIs that `ignoreGlobalItems` includes.
This option can include the following values:

- `Buffer()`
- `new Buffer()`
- `Intl.v8BreakIterator`
- `require.extensions`
- `process.EventEmitter`
- `process.env.NODE_REPL_HISTORY_FILE`

Examples of :+1: **correct** code for the `{"ignoreGlobalItems": ["new Buffer()"]}`:

```js
/*eslint node/no-deprecated-api: [error, {ignoreGlobalItems: ["new Buffer()"]}] */

const data = new Buffer(10) // OK since it's in ignoreGlobalItems.
```

## Known Limitations

This rule cannot report the following cases:

### non-static properties

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
