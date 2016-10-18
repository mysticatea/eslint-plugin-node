/**
 * @fileoverview Tests for no-deprecated-api rule.
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-deprecated-api")
var RuleTester = require("eslint/lib/testers/rule-tester")

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester()
ruleTester.run("no-deprecated-api", rule, {
    valid: [
        {
            code: "require('buffer').Buffer",
            env: {node: true},
        },
        {
            code: "foo(require('buffer').Buffer)",
            env: {node: true},
        },
        {
            code: "new (require('another-buffer').Buffer)()",
            env: {node: true},
        },
        {
            code: "var http = require('http'); http.request()",
            env: {node: true},
        },
        {
            code: "var {request} = require('http'); request()",
            env: {node: true, es6: true},
        },
        {
            code: "(s ? require('https') : require('http')).request()",
            env: {node: true},
        },
        {
            code: "require(HTTP).createClient",
            env: {node: true},
        },
        {
            code: "import {Buffer} from 'another-buffer'; new Buffer()",
            env: {es6: true},
            parserOptions: {sourceType: "module"},
        },
        {
            code: "import {request} from 'http'; request()",
            env: {es6: true},
            parserOptions: {sourceType: "module"},
        },

        // On Node v6.8.0, fs.existsSync revived.
        {
            code: "require('fs').existsSync;",
            env: {node: true},
        },
    ],
    invalid: [
        //----------------------------------------------------------------------
        // Modules
        //----------------------------------------------------------------------
        {
            code: "new (require('buffer').Buffer)()",
            env: {node: true},
            errors: ["'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "require('buffer').Buffer()",
            env: {node: true},
            errors: ["'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "var b = require('buffer'); new b.Buffer()",
            env: {node: true},
            errors: ["'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "var b = require('buffer'); new b['Buffer']()",
            env: {node: true},
            errors: ["'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "var b = require('buffer'); new b[`Buffer`]()",
            env: {node: true, es6: true},
            errors: ["'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "var b = require('buffer').Buffer; new b()",
            env: {node: true},
            errors: ["'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "var b; new ((b = require('buffer')).Buffer)(); new b.Buffer()",
            env: {node: true},
            errors: [
                "'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead.",
                "'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead.",
            ],
        },
        {
            code: "var {Buffer: b} = require('buffer'); new b()",
            env: {node: true, es6: true},
            errors: ["'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "var {['Buffer']: b = null} = require('buffer'); new b()",
            env: {node: true, es6: true},
            errors: ["'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "var {'Buffer': b = null} = require('buffer'); new b()",
            env: {node: true, es6: true},
            errors: ["'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "var {Buffer: b = require('buffer').Buffer} = {}; new b()",
            env: {node: true, es6: true},
            errors: ["'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "require('buffer').SlowBuffer",
            env: {node: true},
            errors: ["'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },
        {
            code: "var b = require('buffer'); b.SlowBuffer",
            env: {node: true},
            errors: ["'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },
        {
            code: "var {SlowBuffer: b} = require('buffer');",
            env: {node: true, es6: true},
            errors: ["'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },

        {
            code: "require('crypto').createCredentials;",
            env: {node: true},
            errors: ["'crypto.createCredentials' was deprecated since v0.12. Use 'tls.createSecureContext()' instead."],
        },
        {
            code: "require('domain');",
            env: {node: true},
            errors: ["'domain' module was deprecated since v4."],
        },
        {
            code: "require('events').EventEmitter.listenerCount;",
            env: {node: true},
            errors: ["'events.EventEmitter.listenerCount' was deprecated since v4. Use 'events.EventEmitter#listenerCount()' instead."],
        },
        {
            code: "require('events').listenerCount;",
            env: {node: true},
            errors: ["'events.listenerCount' was deprecated since v4. Use 'events.EventEmitter#listenerCount()' instead."],
        },
        {
            code: "require('fs').exists;",
            env: {node: true},
            errors: ["'fs.exists' was deprecated since v4. Use 'fs.stat()' or 'fs.access()' instead."],
        },
        {
            code: "require('http').createClient;",
            env: {node: true},
            errors: ["'http.createClient' was deprecated since v0.10. Use 'http.request()' instead."],
        },
        {
            code: "require('tls').CleartextStream;",
            env: {node: true},
            errors: ["'tls.CleartextStream' was deprecated since v0.10."],
        },
        {
            code: "require('tls').CryptoStream;",
            env: {node: true},
            errors: ["'tls.CryptoStream' was deprecated since v0.12. Use 'tls.TLSSocket' instead."],
        },
        {
            code: "require('tls').SecurePair;",
            env: {node: true},
            errors: ["'tls.SecurePair' was deprecated since v6. Use 'tls.TLSSocket' instead."],
        },
        {
            code: "require('tls').createSecurePair;",
            env: {node: true},
            errors: ["'tls.createSecurePair' was deprecated since v6. Use 'tls.TLSSocket' instead."],
        },
        {
            code: "require('tty').setRawMode;",
            env: {node: true},
            errors: ["'tty.setRawMode' was deprecated since v0.10. Use 'tty.ReadStream#setRawMode()' (e.g. 'process.stdin.setRawMode()') instead."],
        },
        {
            code: "require('util').debug;",
            env: {node: true},
            errors: ["'util.debug' was deprecated since v0.12. Use 'console.error()' instead."],
        },
        {
            code: "require('util').error;",
            env: {node: true},
            errors: ["'util.error' was deprecated since v0.12. Use 'console.error()' instead."],
        },
        {
            code: "require('util').isArray;",
            env: {node: true},
            errors: ["'util.isArray' was deprecated since v4. Use 'Array.isArray()' instead."],
        },
        {
            code: "require('util').isBoolean;",
            env: {node: true},
            errors: ["'util.isBoolean' was deprecated since v4."],
        },
        {
            code: "require('util').isBuffer;",
            env: {node: true},
            errors: ["'util.isBuffer' was deprecated since v4. Use 'Buffer.isBuffer()' instead."],
        },
        {
            code: "require('util').isDate;",
            env: {node: true},
            errors: ["'util.isDate' was deprecated since v4."],
        },
        {
            code: "require('util').isError;",
            env: {node: true},
            errors: ["'util.isError' was deprecated since v4."],
        },
        {
            code: "require('util').isFunction;",
            env: {node: true},
            errors: ["'util.isFunction' was deprecated since v4."],
        },
        {
            code: "require('util').isNull;",
            env: {node: true},
            errors: ["'util.isNull' was deprecated since v4."],
        },
        {
            code: "require('util').isNullOrUndefined;",
            env: {node: true},
            errors: ["'util.isNullOrUndefined' was deprecated since v4."],
        },
        {
            code: "require('util').isNumber;",
            env: {node: true},
            errors: ["'util.isNumber' was deprecated since v4."],
        },
        {
            code: "require('util').isObject;",
            env: {node: true},
            errors: ["'util.isObject' was deprecated since v4."],
        },
        {
            code: "require('util').isPrimitive;",
            env: {node: true},
            errors: ["'util.isPrimitive' was deprecated since v4."],
        },
        {
            code: "require('util').isRegExp;",
            env: {node: true},
            errors: ["'util.isRegExp' was deprecated since v4."],
        },
        {
            code: "require('util').isString;",
            env: {node: true},
            errors: ["'util.isString' was deprecated since v4."],
        },
        {
            code: "require('util').isSymbol;",
            env: {node: true},
            errors: ["'util.isSymbol' was deprecated since v4."],
        },
        {
            code: "require('util').isUndefined;",
            env: {node: true},
            errors: ["'util.isUndefined' was deprecated since v4."],
        },
        {
            code: "require('util').log;",
            env: {node: true},
            errors: ["'util.log' was deprecated since v6. Use a third party module instead."],
        },
        {
            code: "require('util').print;",
            env: {node: true},
            errors: ["'util.print' was deprecated since v0.12. Use 'console.log()' instead."],
        },
        {
            code: "require('util').pump;",
            env: {node: true},
            errors: ["'util.pump' was deprecated since v0.10. Use 'stream.Readable#pipe()' instead."],
        },
        {
            code: "require('util').puts;",
            env: {node: true},
            errors: ["'util.puts' was deprecated since v0.12. Use 'console.log()' instead."],
        },
        {
            code: "require('util')._extend;",
            env: {node: true},
            errors: ["'util._extend' was deprecated since v6. Use 'Object.assign()' instead."],
        },

        // ES2015 Modules
        {
            code: "import b from 'buffer'; new b.Buffer()",
            env: {es6: true},
            parserOptions: {sourceType: "module"},
            errors: ["'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "import * as b from 'buffer'; new b.Buffer()",
            env: {es6: true},
            parserOptions: {sourceType: "module"},
            errors: ["'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "import * as b from 'buffer'; new b.default.Buffer()",
            env: {es6: true},
            parserOptions: {sourceType: "module"},
            errors: ["'buffer.default.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "import {Buffer as b} from 'buffer'; new b()",
            env: {es6: true},
            parserOptions: {sourceType: "module"},
            errors: ["'buffer.Buffer' constructor was deprecated since v6. Use 'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'safe-buffer' module for '<6.0.0') instead."],
        },
        {
            code: "import b from 'buffer'; b.SlowBuffer",
            env: {es6: true},
            parserOptions: {sourceType: "module"},
            errors: ["'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },
        {
            code: "import * as b from 'buffer'; b.SlowBuffer",
            env: {es6: true},
            parserOptions: {sourceType: "module"},
            errors: ["'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },
        {
            code: "import * as b from 'buffer'; b.default.SlowBuffer",
            env: {es6: true},
            parserOptions: {sourceType: "module"},
            errors: ["'buffer.default.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },
        {
            code: "import {SlowBuffer as b} from 'buffer';",
            env: {es6: true},
            parserOptions: {sourceType: "module"},
            errors: ["'buffer.SlowBuffer' was deprecated since v6. Use 'buffer.Buffer.allocUnsafeSlow()' instead."],
        },
        {
            code: "import domain from 'domain';",
            env: {es6: true},
            parserOptions: {sourceType: "module"},
            errors: ["'domain' module was deprecated since v4."],
        },

        //----------------------------------------------------------------------
        // Global Variables
        //----------------------------------------------------------------------
        {
            code: "new Buffer;",
            env: {node: true},
            errors: ["'Buffer' constructor was deprecated since v6. Use 'Buffer.alloc()' or 'Buffer.from()' instead."],
        },
        {
            code: "Buffer();",
            env: {node: true},
            errors: ["'Buffer' constructor was deprecated since v6. Use 'Buffer.alloc()' or 'Buffer.from()' instead."],
        },
        {
            code: "require.extensions;",
            env: {node: true},
            errors: ["'require.extensions' was deprecated since v0.12. Use compiling them ahead of time instead."],
        },
        {
            code: "process.env.NODE_REPL_HISTORY_FILE;",
            env: {node: true},
            errors: ["'process.env.NODE_REPL_HISTORY_FILE' was deprecated since v4. Use 'NODE_REPL_HISTORY' instead."],
        },
        {
            code: "let {env: {NODE_REPL_HISTORY_FILE}} = process;",
            env: {node: true, es6: true},
            errors: ["'process.env.NODE_REPL_HISTORY_FILE' was deprecated since v4. Use 'NODE_REPL_HISTORY' instead."],
        },
    ],
})
