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
            env: { node: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "require('buffer').Buffer()",
            env: { node: true },
            errors: [
                "'buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "var b = require('buffer'); new b.Buffer()",
            env: { node: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "var b = require('buffer'); new b['Buffer']()",
            env: { node: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "var b = require('buffer'); new b[`Buffer`]()",
            env: { node: true, es6: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "var b = require('buffer').Buffer; new b()",
            env: { node: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code:
                "var b; new ((b = require('buffer')).Buffer)(); new b.Buffer()",
            env: { node: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "var {Buffer: b} = require('buffer'); new b()",
            env: { node: true, es6: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "var {['Buffer']: b = null} = require('buffer'); new b()",
            env: { node: true, es6: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "var {'Buffer': b = null} = require('buffer'); new b()",
            env: { node: true, es6: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "var {Buffer: b = require('buffer').Buffer} = {}; new b()",
            env: { node: true, es6: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "require('buffer').SlowBuffer",
            env: { node: true },
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6.0.0. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
        },
        {
            code: "var b = require('buffer'); b.SlowBuffer",
            env: { node: true },
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6.0.0. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
        },
        {
            code: "var {SlowBuffer: b} = require('buffer');",
            env: { node: true, es6: true },
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6.0.0. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
        },

        //----------------------------------------------------------------------
        {
            code: "require('_linklist');",
            env: { node: true },
            errors: ["'_linklist' module was deprecated since v5.0.0."],
        },
        {
            code: "require('async_hooks').currentId;",
            env: { node: true },
            errors: [
                "'async_hooks.currentId' was deprecated since v8.2.0. Use 'async_hooks.executionAsyncId()' instead.",
            ],
        },
        {
            code: "require('async_hooks').triggerId;",
            env: { node: true },
            errors: [
                "'async_hooks.triggerId' was deprecated since v8.2.0. Use 'async_hooks.triggerAsyncId()' instead.",
            ],
        },
        {
            code: "require('constants');",
            env: { node: true },
            errors: [
                "'constants' module was deprecated since v6.3.0. Use 'constants' property of each module instead.",
            ],
        },
        {
            code: "require('crypto').Credentials;",
            env: { node: true },
            errors: [
                "'crypto.Credentials' was deprecated since v0.12.0. Use 'tls.SecureContext' instead.",
            ],
        },
        {
            code: "require('crypto').createCredentials;",
            env: { node: true },
            errors: [
                "'crypto.createCredentials' was deprecated since v0.12.0. Use 'tls.createSecureContext()' instead.",
            ],
        },
        {
            code: "require('domain');",
            env: { node: true },
            errors: ["'domain' module was deprecated since v4.0.0."],
        },
        {
            code: "require('events').EventEmitter.listenerCount;",
            env: { node: true },
            errors: [
                "'events.EventEmitter.listenerCount' was deprecated since v4.0.0. Use 'events.EventEmitter#listenerCount()' instead.",
            ],
        },
        {
            code: "require('events').listenerCount;",
            env: { node: true },
            errors: [
                "'events.listenerCount' was deprecated since v4.0.0. Use 'events.EventEmitter#listenerCount()' instead.",
            ],
        },
        {
            code: "require('freelist');",
            env: { node: true },
            errors: ["'freelist' module was deprecated since v4.0.0."],
        },
        {
            code: "require('fs').SyncWriteStream;",
            env: { node: true },
            errors: ["'fs.SyncWriteStream' was deprecated since v4.0.0."],
        },
        {
            code: "require('fs').exists;",
            env: { node: true },
            errors: [
                "'fs.exists' was deprecated since v4.0.0. Use 'fs.stat()' or 'fs.access()' instead.",
            ],
        },
        {
            code: "require('fs').lchmod;",
            env: { node: true },
            errors: ["'fs.lchmod' was deprecated since v0.4.0."],
        },
        {
            code: "require('fs').lchmodSync;",
            env: { node: true },
            errors: ["'fs.lchmodSync' was deprecated since v0.4.0."],
        },
        {
            code: "require('fs').lchown;",
            env: { node: true },
            errors: ["'fs.lchown' was deprecated since v0.4.0."],
        },
        {
            code: "require('fs').lchownSync;",
            env: { node: true },
            errors: ["'fs.lchownSync' was deprecated since v0.4.0."],
        },
        {
            code: "require('http').createClient;",
            env: { node: true },
            errors: [
                "'http.createClient' was deprecated since v0.10.0. Use 'http.request()' instead.",
            ],
        },
        {
            code: "require('module').requireRepl;",
            env: { node: true },
            errors: [
                "'module.requireRepl' was deprecated since v6.0.0. Use 'require(\"repl\")' instead.",
            ],
        },
        {
            code: "require('module').Module.requireRepl;",
            env: { node: true },
            errors: [
                "'module.Module.requireRepl' was deprecated since v6.0.0. Use 'require(\"repl\")' instead.",
            ],
        },
        {
            code: "require('module')._debug;",
            env: { node: true },
            errors: ["'module._debug' was deprecated since v9.0.0."],
        },
        {
            code: "require('module').Module._debug;",
            env: { node: true },
            errors: ["'module.Module._debug' was deprecated since v9.0.0."],
        },
        {
            code: "require('os').getNetworkInterfaces;",
            env: { node: true },
            errors: [
                "'os.getNetworkInterfaces' was deprecated since v0.6.0. Use 'os.networkInterfaces()' instead.",
            ],
        },
        {
            code: "require('os').tmpDir;",
            env: { node: true },
            errors: [
                "'os.tmpDir' was deprecated since v7.0.0. Use 'os.tmpdir()' instead.",
            ],
        },
        {
            code: "require('path')._makeLong;",
            env: { node: true },
            errors: [
                "'path._makeLong' was deprecated since v9.0.0. Use 'path.toNamespacedPath()' instead.",
            ],
        },
        {
            code: "require('punycode');",
            env: { node: true },
            errors: [
                "'punycode' module was deprecated since v7.0.0. Use 'https://www.npmjs.com/package/punycode' instead.",
            ],
        },
        {
            code: "require('readline').codePointAt;",
            env: { node: true },
            errors: ["'readline.codePointAt' was deprecated since v4.0.0."],
        },
        {
            code: "require('readline').getStringWidth;",
            env: { node: true },
            errors: ["'readline.getStringWidth' was deprecated since v6.0.0."],
        },
        {
            code: "require('readline').isFullWidthCodePoint;",
            env: { node: true },
            errors: [
                "'readline.isFullWidthCodePoint' was deprecated since v6.0.0.",
            ],
        },
        {
            code: "require('readline').stripVTControlCharacters;",
            env: { node: true },
            errors: [
                "'readline.stripVTControlCharacters' was deprecated since v6.0.0.",
            ],
        },
        {
            code: "require('sys');",
            env: { node: true },
            errors: [
                "'sys' module was deprecated since v0.3.0. Use 'util' module instead.",
            ],
        },
        {
            code: "require('tls').CleartextStream;",
            env: { node: true },
            errors: ["'tls.CleartextStream' was deprecated since v0.10.0."],
        },
        {
            code: "require('tls').CryptoStream;",
            env: { node: true },
            errors: [
                "'tls.CryptoStream' was deprecated since v0.12.0. Use 'tls.TLSSocket' instead.",
            ],
        },
        {
            code: "require('tls').SecurePair;",
            env: { node: true },
            errors: [
                "'tls.SecurePair' was deprecated since v6.0.0. Use 'tls.TLSSocket' instead.",
            ],
        },
        {
            code: "require('tls').createSecurePair;",
            env: { node: true },
            errors: [
                "'tls.createSecurePair' was deprecated since v6.0.0. Use 'tls.TLSSocket' instead.",
            ],
        },
        {
            code: "require('tls').parseCertString;",
            env: { node: true },
            errors: [
                "'tls.parseCertString' was deprecated since v8.6.0. Use 'querystring.parse()' instead.",
            ],
        },
        {
            code: "require('tty').setRawMode;",
            env: { node: true },
            errors: [
                "'tty.setRawMode' was deprecated since v0.10.0. Use 'tty.ReadStream#setRawMode()' (e.g. 'process.stdin.setRawMode()') instead.",
            ],
        },
        {
            code: "require('util').debug;",
            env: { node: true },
            errors: [
                "'util.debug' was deprecated since v0.12.0. Use 'console.error()' instead.",
            ],
        },
        {
            code: "require('util').error;",
            env: { node: true },
            errors: [
                "'util.error' was deprecated since v0.12.0. Use 'console.error()' instead.",
            ],
        },
        {
            code: "require('util').isArray;",
            env: { node: true },
            errors: [
                "'util.isArray' was deprecated since v4.0.0. Use 'Array.isArray()' instead.",
            ],
        },
        {
            code: "require('util').isBoolean;",
            env: { node: true },
            errors: ["'util.isBoolean' was deprecated since v4.0.0."],
        },
        {
            code: "require('util').isBuffer;",
            env: { node: true },
            errors: [
                "'util.isBuffer' was deprecated since v4.0.0. Use 'Buffer.isBuffer()' instead.",
            ],
        },
        {
            code: "require('util').isDate;",
            env: { node: true },
            errors: ["'util.isDate' was deprecated since v4.0.0."],
        },
        {
            code: "require('util').isError;",
            env: { node: true },
            errors: ["'util.isError' was deprecated since v4.0.0."],
        },
        {
            code: "require('util').isFunction;",
            env: { node: true },
            errors: ["'util.isFunction' was deprecated since v4.0.0."],
        },
        {
            code: "require('util').isNull;",
            env: { node: true },
            errors: ["'util.isNull' was deprecated since v4.0.0."],
        },
        {
            code: "require('util').isNullOrUndefined;",
            env: { node: true },
            errors: ["'util.isNullOrUndefined' was deprecated since v4.0.0."],
        },
        {
            code: "require('util').isNumber;",
            env: { node: true },
            errors: ["'util.isNumber' was deprecated since v4.0.0."],
        },
        {
            code: "require('util').isObject;",
            env: { node: true },
            errors: ["'util.isObject' was deprecated since v4.0.0."],
        },
        {
            code: "require('util').isPrimitive;",
            env: { node: true },
            errors: ["'util.isPrimitive' was deprecated since v4.0.0."],
        },
        {
            code: "require('util').isRegExp;",
            env: { node: true },
            errors: ["'util.isRegExp' was deprecated since v4.0.0."],
        },
        {
            code: "require('util').isString;",
            env: { node: true },
            errors: ["'util.isString' was deprecated since v4.0.0."],
        },
        {
            code: "require('util').isSymbol;",
            env: { node: true },
            errors: ["'util.isSymbol' was deprecated since v4.0.0."],
        },
        {
            code: "require('util').isUndefined;",
            env: { node: true },
            errors: ["'util.isUndefined' was deprecated since v4.0.0."],
        },
        {
            code: "require('util').log;",
            env: { node: true },
            errors: [
                "'util.log' was deprecated since v6.0.0. Use a third party module instead.",
            ],
        },
        {
            code: "require('util').print;",
            env: { node: true },
            errors: [
                "'util.print' was deprecated since v0.12.0. Use 'console.log()' instead.",
            ],
        },
        {
            code: "require('util').pump;",
            env: { node: true },
            errors: [
                "'util.pump' was deprecated since v0.10.0. Use 'stream.Readable#pipe()' instead.",
            ],
        },
        {
            code: "require('util').puts;",
            env: { node: true },
            errors: [
                "'util.puts' was deprecated since v0.12.0. Use 'console.log()' instead.",
            ],
        },
        {
            code: "require('util')._extend;",
            env: { node: true },
            errors: [
                "'util._extend' was deprecated since v6.0.0. Use 'Object.assign()' instead.",
            ],
        },
        {
            code: "require('vm').runInDebugContext;",
            env: { node: true },
            errors: ["'vm.runInDebugContext' was deprecated since v8.0.0."],
        },

        // ES2015 Modules
        {
            code: "import b from 'buffer'; new b.Buffer()",
            parserOptions: { sourceType: "module" },
            env: { es6: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "import * as b from 'buffer'; new b.Buffer()",
            parserOptions: { sourceType: "module" },
            env: { es6: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "import * as b from 'buffer'; new b.default.Buffer()",
            parserOptions: { sourceType: "module" },
            env: { es6: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "import {Buffer as b} from 'buffer'; new b()",
            parserOptions: { sourceType: "module" },
            env: { es6: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },
        {
            code: "import b from 'buffer'; b.SlowBuffer",
            parserOptions: { sourceType: "module" },
            env: { es6: true },
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6.0.0. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
        },
        {
            code: "import * as b from 'buffer'; b.SlowBuffer",
            parserOptions: { sourceType: "module" },
            env: { es6: true },
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6.0.0. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
        },
        {
            code: "import * as b from 'buffer'; b.default.SlowBuffer",
            parserOptions: { sourceType: "module" },
            env: { es6: true },
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6.0.0. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
        },
        {
            code: "import {SlowBuffer as b} from 'buffer';",
            parserOptions: { sourceType: "module" },
            env: { es6: true },
            errors: [
                "'buffer.SlowBuffer' was deprecated since v6.0.0. Use 'buffer.Buffer.allocUnsafeSlow()' instead.",
            ],
        },
        {
            code: "import domain from 'domain';",
            parserOptions: { sourceType: "module" },
            env: { es6: true },
            errors: ["'domain' module was deprecated since v4.0.0."],
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
            env: { node: true },
            errors: [
                "'new buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
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
            env: { node: true },
            errors: [
                "'buffer.Buffer()' was deprecated since v6.0.0. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' instead.",
            ],
        },

        //----------------------------------------------------------------------
        // Global Variables
        //----------------------------------------------------------------------
        {
            code: "new Buffer;",
            env: { node: true },
            errors: [
                "'new Buffer()' was deprecated since v6.0.0. Use 'Buffer.alloc()' or 'Buffer.from()' instead.",
            ],
        },
        {
            code: "Buffer();",
            env: { node: true },
            errors: [
                "'Buffer()' was deprecated since v6.0.0. Use 'Buffer.alloc()' or 'Buffer.from()' instead.",
            ],
        },
        {
            code: "GLOBAL; /*globals GLOBAL*/",
            env: { node: true },
            errors: [
                "'GLOBAL' was deprecated since v6.0.0. Use 'global' instead.",
            ],
        },
        {
            code: "Intl.v8BreakIterator;",
            env: { node: true },
            errors: ["'Intl.v8BreakIterator' was deprecated since v7.0.0."],
        },
        {
            code: "require.extensions;",
            env: { node: true },
            errors: [
                "'require.extensions' was deprecated since v0.12.0. Use compiling them ahead of time instead.",
            ],
        },
        {
            code: "root;",
            globals: { root: false },
            env: { node: true },
            errors: [
                "'root' was deprecated since v6.0.0. Use 'global' instead.",
            ],
        },
        {
            code: "process.EventEmitter;",
            env: { node: true },
            errors: [
                "'process.EventEmitter' was deprecated since v0.6.0. Use 'require(\"events\")' instead.",
            ],
        },
        {
            code: "process.env.NODE_REPL_HISTORY_FILE;",
            env: { node: true },
            errors: [
                "'process.env.NODE_REPL_HISTORY_FILE' was deprecated since v4.0.0. Use 'NODE_REPL_HISTORY' instead.",
            ],
        },
        {
            code: "let {env: {NODE_REPL_HISTORY_FILE}} = process;",
            env: { node: true, es6: true },
            errors: [
                "'process.env.NODE_REPL_HISTORY_FILE' was deprecated since v4.0.0. Use 'NODE_REPL_HISTORY' instead.",
            ],
        },
        {
            code: "import domain from 'domain';",
            parserOptions: { sourceType: "module" },
            errors: ["'domain' module was deprecated since v4.0.0."],
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
            env: { node: true },
            errors: [
                "'new Buffer()' was deprecated since v6.0.0. Use 'Buffer.alloc()' or 'Buffer.from()' instead.",
            ],
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
            env: { node: true },
            errors: [
                "'Buffer()' was deprecated since v6.0.0. Use 'Buffer.alloc()' or 'Buffer.from()' instead.",
            ],
        },
    ],
})
