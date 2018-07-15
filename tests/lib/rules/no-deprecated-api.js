/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint/lib/testers/rule-tester")
const rule = require("../../../lib/rules/no-deprecated-api")

const ruleTester = new RuleTester()
ruleTester.run("no-deprecated-api", rule, {
    valid: [
        {
            code: "require('buffer').Buffer",
            env: { node: true },
        },
        {
            code: "foo(require('buffer').Buffer)",
            env: { node: true },
        },
        {
            code: "new (require('another-buffer').Buffer)()",
            env: { node: true },
        },
        {
            code: "var http = require('http'); http.request()",
            env: { node: true },
        },
        {
            code: "var {request} = require('http'); request()",
            env: { node: true, es6: true },
        },
        {
            code: "(s ? require('https') : require('http')).request()",
            env: { node: true },
        },
        {
            code: "require(HTTP).createClient",
            env: { node: true },
        },
        {
            code: "import {Buffer} from 'another-buffer'; new Buffer()",
            parserOptions: { sourceType: "module" },
            env: { es6: true },
        },
        {
            code: "import {request} from 'http'; request()",
            parserOptions: { sourceType: "module" },
            env: { es6: true },
        },

        // On Node v6.8.0, fs.existsSync revived.
        {
            code: "require('fs').existsSync;",
            env: { node: true },
        },

        // use third parties.
        {
            code: "require('domain/');",
            env: { node: true },
        },
        {
            code: "import domain from 'domain/';",
            parserOptions: { sourceType: "module" },
        },

        // https://github.com/mysticatea/eslint-plugin-node/issues/55
        {
            code: "undefinedVar = require('fs')",
            env: { node: true },
        },

        // ignore options
        {
            code: "new (require('buffer').Buffer)()",
            options: [
                {
                    //
                    ignoreModuleItems: ["new buffer.Buffer()"],
                },
            ],
            env: { node: true },
        },
        {
            code: "require('buffer').Buffer()",
            options: [
                {
                    //
                    ignoreModuleItems: ["buffer.Buffer()"],
                },
            ],
            env: { node: true },
        },
        {
            code: "require('domain');",
            options: [
                {
                    //
                    ignoreModuleItems: ["domain"],
                },
            ],
            env: { node: true },
        },
        {
            code: "require('events').EventEmitter.listenerCount;",
            options: [
                {
                    //
                    ignoreModuleItems: ["events.EventEmitter.listenerCount"],
                },
            ],
            env: { node: true },
        },
        {
            code: "require('events').listenerCount;",
            options: [
                {
                    //
                    ignoreModuleItems: ["events.listenerCount"],
                },
            ],
            env: { node: true },
        },
        {
            code: "new Buffer;",
            options: [
                {
                    //
                    ignoreGlobalItems: ["new Buffer()"],
                },
            ],
            env: { node: true },
        },
        {
            code: "Buffer();",
            options: [
                {
                    //
                    ignoreGlobalItems: ["Buffer()"],
                },
            ],
            env: { node: true },
        },
        {
            code: "Intl.v8BreakIterator;",
            options: [
                {
                    //
                    ignoreGlobalItems: ["Intl.v8BreakIterator"],
                },
            ],
            env: { node: true },
        },
        {
            code: "let {env: {NODE_REPL_HISTORY_FILE}} = process;",
            options: [
                {
                    //
                    ignoreGlobalItems: ["process.env.NODE_REPL_HISTORY_FILE"],
                },
            ],
            env: { node: true, es6: true },
        },

        // https://github.com/mysticatea/eslint-plugin-node/issues/65
        {
            code: 'require("domain/")',
            options: [{ ignoreIndirectDependencies: true }],
            env: { node: true },
        },

        // https://github.com/mysticatea/eslint-plugin-node/issues/87
        {
            code: 'let fs = fs || require("fs")',
            env: { node: true, es6: true },
        },
    ],
    invalid: [
        //----------------------------------------------------------------------
        // Modules
        //----------------------------------------------------------------------
        {
            code: "new (require('buffer').Buffer)()",
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('buffer').Buffer()",
            errors: [
                "'buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true },
        },
        {
            code: "var b = require('buffer'); new b.Buffer()",
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true },
        },
        {
            code: "var b = require('buffer'); new b['Buffer']()",
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true },
        },
        {
            code: "var b = require('buffer'); new b[`Buffer`]()",
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true, es6: true },
        },
        {
            code: "var b = require('buffer').Buffer; new b()",
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true },
        },
        {
            code:
                "var b; new ((b = require('buffer')).Buffer)(); new b.Buffer()",
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true },
        },
        {
            code: "var {Buffer: b} = require('buffer'); new b()",
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true, es6: true },
        },
        {
            code: "var {['Buffer']: b = null} = require('buffer'); new b()",
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true, es6: true },
        },
        {
            code: "var {'Buffer': b = null} = require('buffer'); new b()",
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true, es6: true },
        },
        {
            code: "var {Buffer: b = require('buffer').Buffer} = {}; new b()",
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true, es6: true },
        },
        {
            code: "require('buffer').SlowBuffer",
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "var b = require('buffer'); b.SlowBuffer",
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "var {SlowBuffer: b} = require('buffer');",
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
            env: { node: true, es6: true },
        },

        //----------------------------------------------------------------------
        {
            code: "require('_linklist');",
            errors: ["'_linklist' module was deprecated since v5."],
            env: { node: true },
        },
        {
            code: "require('async_hooks').currentId;",
            errors: [
                "'async_hooks.currentId' was deprecated since v8.2. Use 'async_hooks.executionAsyncId()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('async_hooks').triggerId;",
            errors: [
                "'async_hooks.triggerId' was deprecated since v8.2. Use 'async_hooks.triggerAsyncId()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('constants');",
            errors: [
                "'constants' module was deprecated since v6.3. Use 'constants' property of each module instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('crypto').Credentials;",
            errors: [
                "'crypto.Credentials' was deprecated since v0.12. Use 'tls.SecureContext' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('crypto').createCredentials;",
            errors: [
                "'crypto.createCredentials' was deprecated since v0.12. Use 'tls.createSecureContext()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('domain');",
            errors: ["'domain' module was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('events').EventEmitter.listenerCount;",
            errors: [
                "'events.EventEmitter.listenerCount' was deprecated since v4. Use 'events.EventEmitter#listenerCount()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('events').listenerCount;",
            errors: [
                "'events.listenerCount' was deprecated since v4. Use 'events.EventEmitter#listenerCount()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('freelist');",
            errors: ["'freelist' module was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('fs').SyncWriteStream;",
            errors: ["'fs.SyncWriteStream' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('fs').exists;",
            errors: [
                "'fs.exists' was deprecated since v4. Use 'fs.stat()' or 'fs.access()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('fs').lchmod;",
            errors: ["'fs.lchmod' was deprecated since v0.4."],
            env: { node: true },
        },
        {
            code: "require('fs').lchmodSync;",
            errors: ["'fs.lchmodSync' was deprecated since v0.4."],
            env: { node: true },
        },
        {
            code: "require('fs').lchown;",
            errors: ["'fs.lchown' was deprecated since v0.4."],
            env: { node: true },
        },
        {
            code: "require('fs').lchownSync;",
            errors: ["'fs.lchownSync' was deprecated since v0.4."],
            env: { node: true },
        },
        {
            code: "require('http').createClient;",
            errors: [
                "'http.createClient' was deprecated since v0.10. Use 'http.request()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('module').requireRepl;",
            errors: [
                "'module.requireRepl' was deprecated since v6. Use 'require(\"repl\")' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('module').Module.requireRepl;",
            errors: [
                "'module.Module.requireRepl' was deprecated since v6. Use 'require(\"repl\")' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('module')._debug;",
            errors: ["'module._debug' was deprecated since v9."],
            env: { node: true },
        },
        {
            code: "require('module').Module._debug;",
            errors: ["'module.Module._debug' was deprecated since v9."],
            env: { node: true },
        },
        {
            code: "require('os').getNetworkInterfaces;",
            errors: [
                "'os.getNetworkInterfaces' was deprecated since v0.6. Use 'os.networkInterfaces()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('os').tmpDir;",
            errors: [
                "'os.tmpDir' was deprecated since v7. Use 'os.tmpdir()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('path')._makeLong;",
            errors: [
                "'path._makeLong' was deprecated since v9. Use 'path.toNamespacedPath()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('punycode');",
            errors: [
                "'punycode' module was deprecated since v7. Use 'https://www.npmjs.com/package/punycode' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('readline').codePointAt;",
            errors: ["'readline.codePointAt' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('readline').getStringWidth;",
            errors: ["'readline.getStringWidth' was deprecated since v6."],
            env: { node: true },
        },
        {
            code: "require('readline').isFullWidthCodePoint;",
            errors: [
                "'readline.isFullWidthCodePoint' was deprecated since v6.",
            ],
            env: { node: true },
        },
        {
            code: "require('readline').stripVTControlCharacters;",
            errors: [
                "'readline.stripVTControlCharacters' was deprecated since v6.",
            ],
            env: { node: true },
        },
        {
            code: "require('sys');",
            errors: [
                "'sys' module was deprecated since v0.3. Use 'util' module instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('tls').CleartextStream;",
            errors: ["'tls.CleartextStream' was deprecated since v0.10."],
            env: { node: true },
        },
        {
            code: "require('tls').CryptoStream;",
            errors: [
                "'tls.CryptoStream' was deprecated since v0.12. Use 'tls.TLSSocket' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('tls').SecurePair;",
            errors: [
                "'tls.SecurePair' was deprecated since v6. Use 'tls.TLSSocket' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('tls').createSecurePair;",
            errors: [
                "'tls.createSecurePair' was deprecated since v6. Use 'tls.TLSSocket' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('tls').parseCertString;",
            errors: [
                "'tls.parseCertString' was deprecated since v8.6. Use 'querystring.parse()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('tty').setRawMode;",
            errors: [
                "'tty.setRawMode' was deprecated since v0.10. Use 'tty.ReadStream#setRawMode()' (e.g. 'process.stdin.setRawMode()') instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('util').debug;",
            errors: [
                "'util.debug' was deprecated since v0.12. Use 'console.error()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('util').error;",
            errors: [
                "'util.error' was deprecated since v0.12. Use 'console.error()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('util').isArray;",
            errors: [
                "'util.isArray' was deprecated since v4. Use 'Array.isArray()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('util').isBoolean;",
            errors: ["'util.isBoolean' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('util').isBuffer;",
            errors: [
                "'util.isBuffer' was deprecated since v4. Use 'Buffer.isBuffer()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('util').isDate;",
            errors: ["'util.isDate' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('util').isError;",
            errors: ["'util.isError' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('util').isFunction;",
            errors: ["'util.isFunction' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('util').isNull;",
            errors: ["'util.isNull' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('util').isNullOrUndefined;",
            errors: ["'util.isNullOrUndefined' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('util').isNumber;",
            errors: ["'util.isNumber' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('util').isObject;",
            errors: ["'util.isObject' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('util').isPrimitive;",
            errors: ["'util.isPrimitive' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('util').isRegExp;",
            errors: ["'util.isRegExp' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('util').isString;",
            errors: ["'util.isString' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('util').isSymbol;",
            errors: ["'util.isSymbol' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('util').isUndefined;",
            errors: ["'util.isUndefined' was deprecated since v4."],
            env: { node: true },
        },
        {
            code: "require('util').log;",
            errors: [
                "'util.log' was deprecated since v6. Use a third party module instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('util').print;",
            errors: [
                "'util.print' was deprecated since v0.12. Use 'console.log()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('util').pump;",
            errors: [
                "'util.pump' was deprecated since v0.10. Use 'stream.Readable#pipe()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('util').puts;",
            errors: [
                "'util.puts' was deprecated since v0.12. Use 'console.log()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('util')._extend;",
            errors: [
                "'util._extend' was deprecated since v6. Use 'Object.assign()' instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('vm').runInDebugContext;",
            errors: ["'vm.runInDebugContext' was deprecated since v8."],
            env: { node: true },
        },

        // ES2015 Modules
        {
            code: "import b from 'buffer'; new b.Buffer()",
            parserOptions: { sourceType: "module" },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { es6: true },
        },
        {
            code: "import * as b from 'buffer'; new b.Buffer()",
            parserOptions: { sourceType: "module" },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { es6: true },
        },
        {
            code: "import * as b from 'buffer'; new b.default.Buffer()",
            parserOptions: { sourceType: "module" },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { es6: true },
        },
        {
            code: "import {Buffer as b} from 'buffer'; new b()",
            parserOptions: { sourceType: "module" },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { es6: true },
        },
        {
            code: "import b from 'buffer'; b.SlowBuffer",
            parserOptions: { sourceType: "module" },
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
            env: { es6: true },
        },
        {
            code: "import * as b from 'buffer'; b.SlowBuffer",
            parserOptions: { sourceType: "module" },
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
            env: { es6: true },
        },
        {
            code: "import * as b from 'buffer'; b.default.SlowBuffer",
            parserOptions: { sourceType: "module" },
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
            env: { es6: true },
        },
        {
            code: "import {SlowBuffer as b} from 'buffer';",
            parserOptions: { sourceType: "module" },
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
            env: { es6: true },
        },
        {
            code: "import domain from 'domain';",
            parserOptions: { sourceType: "module" },
            errors: ["'domain' module was deprecated since v4."],
            env: { es6: true },
        },

        {
            code: "new (require('buffer').Buffer)()",
            options: [
                {
                    //
                    ignoreModuleItems: ["buffer.Buffer()"],
                    ignoreGlobalItems: ["Buffer()", "new Buffer()"],
                },
            ],
            errors: [
                "'new buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true },
        },
        {
            code: "require('buffer').Buffer()",
            options: [
                {
                    //
                    ignoreModuleItems: ["new buffer.Buffer()"],
                    ignoreGlobalItems: ["Buffer()", "new Buffer()"],
                },
            ],
            errors: [
                "'buffer.Buffer()' was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true },
        },

        //----------------------------------------------------------------------
        // Global Variables
        //----------------------------------------------------------------------
        {
            code: "new Buffer;",
            errors: [
                "'new Buffer()' was deprecated since v6. Use 'Buffer.alloc()' or 'Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true },
        },
        {
            code: "Buffer();",
            errors: [
                "'Buffer()' was deprecated since v6. Use 'Buffer.alloc()' or 'Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true },
        },
        {
            code: "GLOBAL; /*globals GLOBAL*/",
            errors: ["'GLOBAL' was deprecated since v6. Use 'global' instead."],
            env: { node: true },
        },
        {
            code: "Intl.v8BreakIterator;",
            errors: ["'Intl.v8BreakIterator' was deprecated since v7."],
            env: { node: true },
        },
        {
            code: "require.extensions;",
            errors: [
                "'require.extensions' was deprecated since v0.12. Use compiling them ahead of time instead.",
            ],
            env: { node: true },
        },
        {
            code: "root;",
            errors: ["'root' was deprecated since v6. Use 'global' instead."],
            env: { node: true },
            globals: { root: false },
        },
        {
            code: "process.EventEmitter;",
            errors: [
                "'process.EventEmitter' was deprecated since v0.6. Use 'require(\"events\")' instead.",
            ],
            env: { node: true },
        },
        {
            code: "process.env.NODE_REPL_HISTORY_FILE;",
            errors: [
                "'process.env.NODE_REPL_HISTORY_FILE' was deprecated since v4. Use 'NODE_REPL_HISTORY' instead.",
            ],
            env: { node: true },
        },
        {
            code: "let {env: {NODE_REPL_HISTORY_FILE}} = process;",
            errors: [
                "'process.env.NODE_REPL_HISTORY_FILE' was deprecated since v4. Use 'NODE_REPL_HISTORY' instead.",
            ],
            env: { node: true, es6: true },
        },
        {
            code: "import domain from 'domain';",
            parserOptions: { sourceType: "module" },
            errors: ["'domain' module was deprecated since v4."],
        },

        {
            code: "new Buffer()",
            options: [
                {
                    //
                    ignoreModuleItems: [
                        "buffer.Buffer()",
                        "new buffer.Buffer()",
                    ],
                    ignoreGlobalItems: ["Buffer()"],
                },
            ],
            errors: [
                "'new Buffer()' was deprecated since v6. Use 'Buffer.alloc()' or 'Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true },
        },
        {
            code: "Buffer()",
            options: [
                {
                    //
                    ignoreModuleItems: [
                        "buffer.Buffer()",
                        "new buffer.Buffer()",
                    ],
                    ignoreGlobalItems: ["new Buffer()"],
                },
            ],
            errors: [
                "'Buffer()' was deprecated since v6. Use 'Buffer.alloc()' or 'Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0') instead.",
            ],
            env: { node: true },
        },
    ],
})
