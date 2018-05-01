/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { READ, CALL, CONSTRUCT } = require("./reference-tracer")

module.exports = {
    modules: {
        _linklist: {
            [READ]: true,
            since: 5,
            replacedBy: null,
        },
        //eslint-disable-next-line camelcase
        async_hooks: {
            currentId: {
                [READ]: true,
                since: 8.2,
                replacedBy: "'async_hooks.executionAsyncId()'",
            },
            triggerId: {
                [READ]: true,
                since: 8.2,
                replacedBy: "'async_hooks.triggerAsyncId()'",
            },
        },
        buffer: {
            Buffer: {
                [CONSTRUCT]: true,
                [CALL]: true,
                since: 6,
                replacedBy:
                    "'buffer.Buffer.alloc()' or 'buffer.Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0')",
            },
            SlowBuffer: {
                [READ]: true,
                since: 6,
                replacedBy: "'buffer.Buffer.allocUnsafeSlow()'",
            },
        },
        constants: {
            [READ]: true,
            since: 6.3,
            replacedBy: "'constants' property of each module",
        },
        crypto: {
            Credentials: {
                [READ]: true,
                since: 0.12,
                replacedBy: "'tls.SecureContext'",
            },
            createCredentials: {
                [READ]: true,
                since: 0.12,
                replacedBy: "'tls.createSecureContext()'",
            },
        },
        domain: {
            [READ]: true,
            since: 4,
            replacedBy: null,
        },
        events: {
            EventEmitter: {
                listenerCount: {
                    [READ]: true,
                    since: 4,
                    replacedBy: "'events.EventEmitter#listenerCount()'",
                },
            },
            listenerCount: {
                [READ]: true,
                since: 4,
                replacedBy: "'events.EventEmitter#listenerCount()'",
            },
        },
        freelist: {
            [READ]: true,
            since: 4,
            replacedBy: null,
        },
        fs: {
            SyncWriteStream: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            exists: {
                [READ]: true,
                since: 4,
                replacedBy: "'fs.stat()' or 'fs.access()'",
            },
            lchmod: {
                [READ]: true,
                since: 0.4,
                replacedBy: null,
            },
            lchmodSync: {
                [READ]: true,
                since: 0.4,
                replacedBy: null,
            },
            lchown: {
                [READ]: true,
                since: 0.4,
                replacedBy: null,
            },
            lchownSync: {
                [READ]: true,
                since: 0.4,
                replacedBy: null,
            },
        },
        http: {
            createClient: {
                [READ]: true,
                since: 0.1,
                replacedBy: "'http.request()'",
            },
        },
        module: {
            Module: {
                requireRepl: {
                    [READ]: true,
                    since: 6,
                    replacedBy: "'require(\"repl\")'",
                },
                _debug: {
                    [READ]: true,
                    since: 9,
                    replacedBy: null,
                },
            },
            requireRepl: {
                [READ]: true,
                since: 6,
                replacedBy: "'require(\"repl\")'",
            },
            _debug: {
                [READ]: true,
                since: 9,
                replacedBy: null,
            },
        },
        os: {
            getNetworkInterfaces: {
                [READ]: true,
                since: 0.6,
                replacedBy: "'os.networkInterfaces()'",
            },
            tmpDir: {
                [READ]: true,
                since: 7,
                replacedBy: "'os.tmpdir()'",
            },
        },
        path: {
            _makeLong: {
                [READ]: true,
                since: 9,
                replacedBy: "'path.toNamespacedPath()'",
            },
        },
        punycode: {
            [READ]: true,
            since: 7,
            replacedBy: "'https://www.npmjs.com/package/punycode'",
        },
        readline: {
            codePointAt: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            getStringWidth: {
                [READ]: true,
                since: 6,
                replacedBy: null,
            },
            isFullWidthCodePoint: {
                [READ]: true,
                since: 6,
                replacedBy: null,
            },
            stripVTControlCharacters: {
                [READ]: true,
                since: 6,
                replacedBy: null,
            },
        },
        sys: {
            [READ]: true,
            since: 0.3,
            replacedBy: "'util' module",
        },
        tls: {
            CleartextStream: {
                [READ]: true,
                since: 0.1,
                replacedBy: null,
            },
            CryptoStream: {
                [READ]: true,
                since: 0.12,
                replacedBy: "'tls.TLSSocket'",
            },
            SecurePair: {
                [READ]: true,
                since: 6,
                replacedBy: "'tls.TLSSocket'",
            },
            createSecurePair: {
                [READ]: true,
                since: 6,
                replacedBy: "'tls.TLSSocket'",
            },
            parseCertString: {
                [READ]: true,
                since: 8.6,
                replacedBy: "'querystring.parse()'",
            },
        },
        tty: {
            setRawMode: {
                [READ]: true,
                since: 0.1,
                replacedBy:
                    "'tty.ReadStream#setRawMode()' (e.g. 'process.stdin.setRawMode()')",
            },
        },
        util: {
            debug: {
                [READ]: true,
                since: 0.12,
                replacedBy: "'console.error()'",
            },
            error: {
                [READ]: true,
                since: 0.12,
                replacedBy: "'console.error()'",
            },
            isArray: {
                [READ]: true,
                since: 4,
                replacedBy: "'Array.isArray()'",
            },
            isBoolean: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            isBuffer: {
                [READ]: true,
                since: 4,
                replacedBy: "'Buffer.isBuffer()'",
            },
            isDate: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            isError: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            isFunction: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            isNull: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            isNullOrUndefined: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            isNumber: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            isObject: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            isPrimitive: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            isRegExp: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            isString: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            isSymbol: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            isUndefined: {
                [READ]: true,
                since: 4,
                replacedBy: null,
            },
            log: {
                [READ]: true,
                since: 6,
                replacedBy: "a third party module",
            },
            print: {
                [READ]: true,
                since: 0.12,
                replacedBy: "'console.log()'",
            },
            pump: {
                [READ]: true,
                since: 0.1,
                replacedBy: "'stream.Readable#pipe()'",
            },
            puts: {
                [READ]: true,
                since: 0.12,
                replacedBy: "'console.log()'",
            },
            _extend: {
                [READ]: true,
                since: 6,
                replacedBy: "'Object.assign()'",
            },
        },
        vm: {
            runInDebugContext: {
                [READ]: true,
                since: 8,
                replacedBy: null,
            },
        },
    },
    globals: {
        Buffer: {
            [CONSTRUCT]: true,
            [CALL]: true,
            since: 6,
            replacedBy:
                "'Buffer.alloc()' or 'Buffer.from()' (use 'https://www.npmjs.com/package/safe-buffer' for '<4.5.0')",
        },
        GLOBAL: {
            [READ]: true,
            since: 6,
            replacedBy: "'global'",
        },
        Intl: {
            v8BreakIterator: {
                [READ]: true,
                since: 7,
                replacedBy: null,
            },
        },
        require: {
            extensions: {
                [READ]: true,
                since: 0.12,
                replacedBy: "compiling them ahead of time",
            },
        },
        root: {
            [READ]: true,
            since: 6,
            replacedBy: "'global'",
        },
        process: {
            EventEmitter: {
                [READ]: true,
                since: 0.6,
                replacedBy: "'require(\"events\")'",
            },
            env: {
                NODE_REPL_HISTORY_FILE: {
                    [READ]: true,
                    since: 4,
                    replacedBy: "'NODE_REPL_HISTORY'",
                },
            },
        },
    },
}

// safe-buffer.Buffer function/constructror is just a re-export of buffer.Buffer
// and should be deprecated likewise.
module.exports.modules["safe-buffer"] = module.exports.modules.buffer
