/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { CALL, CONSTRUCT, READ, ReferenceTracker } = require("eslint-utils")

const MODULES = {
    _linklist: {
        [READ]: { since: 5, replacedBy: null },
    },
    assert: {
        deepEqual: {
            [READ]: {
                since: 10.0,
                replacedBy:
                    "'assert.deepStrictEqual' or 'assert.strict.deepEqual'",
            },
        },
        equal: {
            [READ]: {
                since: 10.0,
                replacedBy: "'assert.strictEqual' or 'assert.strict.equal'",
            },
        },
        notDeepEqual: {
            [READ]: {
                since: 10.0,
                replacedBy:
                    "'assert.notDeepStrictEqual' or 'assert.strict.notDeepEqual'",
            },
        },
        notEqual: {
            [READ]: {
                since: 10.0,
                replacedBy:
                    "'assert.notStrictEqual' or 'assert.strict.notEqual'",
            },
        },
    },
    //eslint-disable-next-line camelcase
    async_hooks: {
        currentId: {
            [READ]: {
                since: 8.2,
                replacedBy: "'async_hooks.executionAsyncId()'",
            },
        },
        triggerId: {
            [READ]: {
                since: 8.2,
                replacedBy: "'async_hooks.triggerAsyncId()'",
            },
        },
    },
    buffer: {
        Buffer: {
            [CONSTRUCT]: {
                since: 6,
                replacedBy: "'buffer.Buffer.alloc()' or 'buffer.Buffer.from()'",
            },
            [CALL]: {
                since: 6,
                replacedBy: "'buffer.Buffer.alloc()' or 'buffer.Buffer.from()'",
            },
        },
        SlowBuffer: {
            [READ]: {
                since: 6,
                replacedBy: "'buffer.Buffer.allocUnsafeSlow()'",
            },
        },
    },
    constants: {
        [READ]: {
            since: 6.3,
            replacedBy: "'constants' property of each module",
        },
    },
    crypto: {
        Credentials: {
            [READ]: { since: 0.12, replacedBy: "'tls.SecureContext'" },
        },
        DEFAULT_ENCODING: {
            [READ]: { since: 10.0, replacedBy: null },
        },
        createCipher: {
            [READ]: { since: 10.0, replacedBy: "'tls.createCipheriv()'" },
        },
        createCredentials: {
            [READ]: { since: 0.12, replacedBy: "'tls.createSecureContext()'" },
        },
        createDecipher: {
            [READ]: { since: 10.0, replacedBy: "'tls.createDecipheriv()'" },
        },
        fips: {
            [READ]: {
                since: 10.0,
                replacedBy: "'crypto.getFips()' and 'crypto.setFips()'",
            },
        },
    },
    domain: {
        [READ]: { since: 4, replacedBy: null },
    },
    events: {
        EventEmitter: {
            listenerCount: {
                [READ]: {
                    since: 4,
                    replacedBy: "'events.EventEmitter#listenerCount()'",
                },
            },
        },
        listenerCount: {
            [READ]: {
                since: 4,
                replacedBy: "'events.EventEmitter#listenerCount()'",
            },
        },
    },
    freelist: {
        [READ]: { since: 4, replacedBy: null },
    },
    fs: {
        SyncWriteStream: {
            [READ]: { since: 4, replacedBy: null },
        },
        exists: {
            [READ]: { since: 4, replacedBy: "'fs.stat()' or 'fs.access()'" },
        },
        lchmod: {
            [READ]: { since: 0.4, replacedBy: null },
        },
        lchmodSync: {
            [READ]: { since: 0.4, replacedBy: null },
        },
        lchown: {
            [READ]: { since: 0.4, replacedBy: null },
        },
        lchownSync: {
            [READ]: { since: 0.4, replacedBy: null },
        },
    },
    http: {
        createClient: {
            [READ]: { since: 0.1, replacedBy: "'http.request()'" },
        },
    },
    module: {
        Module: {
            requireRepl: {
                [READ]: { since: 6, replacedBy: "'require(\"repl\")'" },
            },
            _debug: {
                [READ]: { since: 9, replacedBy: null },
            },
        },
        requireRepl: {
            [READ]: { since: 6, replacedBy: "'require(\"repl\")'" },
        },
        _debug: {
            [READ]: { since: 9, replacedBy: null },
        },
    },
    os: {
        getNetworkInterfaces: {
            [READ]: { since: 0.6, replacedBy: "'os.networkInterfaces()'" },
        },
        tmpDir: {
            [READ]: { since: 7, replacedBy: "'os.tmpdir()'" },
        },
    },
    path: {
        _makeLong: {
            [READ]: { since: 9, replacedBy: "'path.toNamespacedPath()'" },
        },
    },
    process: {
        EventEmitter: {
            [READ]: { since: 0.6, replacedBy: "'require(\"events\")'" },
        },
        assert: {
            [READ]: { since: 10.0, replacedBy: "'require(\"assert\")'" },
        },
        env: {
            NODE_REPL_HISTORY_FILE: {
                [READ]: { since: 4, replacedBy: "'NODE_REPL_HISTORY'" },
            },
        },
    },
    punycode: {
        [READ]: {
            since: 7,
            replacedBy: "'https://www.npmjs.com/package/punycode'",
        },
    },
    readline: {
        codePointAt: {
            [READ]: { since: 4, replacedBy: null },
        },
        getStringWidth: {
            [READ]: { since: 6, replacedBy: null },
        },
        isFullWidthCodePoint: {
            [READ]: { since: 6, replacedBy: null },
        },
        stripVTControlCharacters: {
            [READ]: { since: 6, replacedBy: null },
        },
    },
    // safe-buffer.Buffer function/constructror is just a re-export of buffer.Buffer
    // and should be deprecated likewise.
    "safe-buffer": {
        Buffer: {
            [CONSTRUCT]: {
                since: 6,
                replacedBy: "'buffer.Buffer.alloc()' or 'buffer.Buffer.from()'",
            },
            [CALL]: {
                since: 6,
                replacedBy: "'buffer.Buffer.alloc()' or 'buffer.Buffer.from()'",
            },
        },
        SlowBuffer: {
            [READ]: {
                since: 6,
                replacedBy: "'buffer.Buffer.allocUnsafeSlow()'",
            },
        },
    },
    sys: {
        [READ]: { since: 0.3, replacedBy: "'util' module" },
    },
    timers: {
        enroll: {
            [READ]: {
                since: 10.0,
                replacedBy: "'setTimeout()' or 'setInterval()'",
            },
        },
        unenroll: {
            [READ]: {
                since: 10.0,
                replacedBy: "'clearTimeout()' or 'clearInterval()'",
            },
        },
    },
    tls: {
        CleartextStream: {
            [READ]: { since: 0.1, replacedBy: null },
        },
        CryptoStream: {
            [READ]: { since: 0.12, replacedBy: "'tls.TLSSocket'" },
        },
        SecurePair: {
            [READ]: { since: 6, replacedBy: "'tls.TLSSocket'" },
        },
        convertNPNProtocols: {
            [READ]: { since: 10.0, replacedBy: null },
        },
        createSecurePair: {
            [READ]: { since: 6, replacedBy: "'tls.TLSSocket'" },
        },
        parseCertString: {
            [READ]: { since: 8.6, replacedBy: "'querystring.parse()'" },
        },
    },
    tty: {
        setRawMode: {
            [READ]: {
                since: 0.1,
                replacedBy:
                    "'tty.ReadStream#setRawMode()' (e.g. 'process.stdin.setRawMode()')",
            },
        },
    },
    util: {
        debug: {
            [READ]: { since: 0.12, replacedBy: "'console.error()'" },
        },
        error: {
            [READ]: { since: 0.12, replacedBy: "'console.error()'" },
        },
        isArray: {
            [READ]: { since: 4, replacedBy: "'Array.isArray()'" },
        },
        isBoolean: {
            [READ]: { since: 4, replacedBy: null },
        },
        isBuffer: {
            [READ]: { since: 4, replacedBy: "'Buffer.isBuffer()'" },
        },
        isDate: {
            [READ]: { since: 4, replacedBy: null },
        },
        isError: {
            [READ]: { since: 4, replacedBy: null },
        },
        isFunction: {
            [READ]: { since: 4, replacedBy: null },
        },
        isNull: {
            [READ]: { since: 4, replacedBy: null },
        },
        isNullOrUndefined: {
            [READ]: { since: 4, replacedBy: null },
        },
        isNumber: {
            [READ]: { since: 4, replacedBy: null },
        },
        isObject: {
            [READ]: { since: 4, replacedBy: null },
        },
        isPrimitive: {
            [READ]: { since: 4, replacedBy: null },
        },
        isRegExp: {
            [READ]: { since: 4, replacedBy: null },
        },
        isString: {
            [READ]: { since: 4, replacedBy: null },
        },
        isSymbol: {
            [READ]: { since: 4, replacedBy: null },
        },
        isUndefined: {
            [READ]: { since: 4, replacedBy: null },
        },
        log: {
            [READ]: { since: 6, replacedBy: "a third party module" },
        },
        print: {
            [READ]: { since: 0.12, replacedBy: "'console.log()'" },
        },
        pump: {
            [READ]: { since: 0.1, replacedBy: "'stream.Readable#pipe()'" },
        },
        puts: {
            [READ]: { since: 0.12, replacedBy: "'console.log()'" },
        },
        _extend: {
            [READ]: { since: 6, replacedBy: "'Object.assign()'" },
        },
    },
    vm: {
        runInDebugContext: {
            [READ]: { since: 8, replacedBy: null },
        },
    },
}
const GLOBALS = {
    Buffer: {
        [CONSTRUCT]: {
            since: 6,
            replacedBy: "'Buffer.alloc()' or 'Buffer.from()'",
        },
        [CALL]: {
            since: 6,
            replacedBy: "'Buffer.alloc()' or 'Buffer.from()'",
        },
    },
    GLOBAL: {
        [READ]: { since: 6, replacedBy: "'global'" },
    },
    Intl: {
        v8BreakIterator: {
            [READ]: { since: 7, replacedBy: null },
        },
    },
    require: {
        extensions: {
            [READ]: { since: 0.12, replacedBy: "compiling them ahead of time" },
        },
    },
    root: {
        [READ]: { since: 6, replacedBy: "'global'" },
    },
    process: MODULES.process,
}
const MODULE_ITEMS = listNames(MODULES)
const GLOBAL_ITEMS = listNames(GLOBALS)

/**
 * Gets the array of deprecated items.
 *
 * These are names which are concatenated by dots.
 * E.g. `buffer.Buffer`, `events.EventEmitter.listenerCount`
 *
 * @param {object} definition - The definition of deprecated APIs.
 * @param {string[]} result - The array of the result.
 * @param {string[]} stack - The array to manage the stack of paths.
 * @returns {string[]} `result`.
 */
function listNames(definition, result = [], stack = []) {
    for (const key of Object.keys(definition)) {
        stack.push(key)
        try {
            const item = definition[key]
            let stop = false

            if (item[ReferenceTracker.READ]) {
                result.push(stack.join("."))
                stop = true
            }
            if (item[ReferenceTracker.CALL]) {
                result.push(`${stack.join(".")}()`)
                stop = true
            }
            if (item[ReferenceTracker.CONSTRUCT]) {
                result.push(`new ${stack.join(".")}()`)
                stop = true
            }

            if (!stop) {
                listNames(item, result, stack)
            }
        } finally {
            stack.pop()
        }
    }

    return result
}

/**
 * Converts from a version number to a version text to display.
 *
 * @param {number} value - A version number to convert.
 * @returns {string} Covnerted text.
 */
function toVersionText(value) {
    if (value <= 0.12) {
        return value.toFixed(2)
    }
    if (value < 1) {
        return value.toFixed(1)
    }
    return String(value)
}

/**
 * Makes a replacement message.
 *
 * @param {string|null} replacedBy - The text of substitute way.
 * @returns {string} Replacement message.
 */
function toReplaceMessage(replacedBy) {
    return replacedBy ? `. Use ${replacedBy} instead` : ""
}

/**
 * Convert a given path to name.
 * @param {symbol} type The report type.
 * @param {string[]} path The property access path.
 * @returns {string} The name.
 */
function toName(type, path) {
    const baseName = path.join(".")
    return type === ReferenceTracker.CALL
        ? `${baseName}()`
        : type === ReferenceTracker.CONSTRUCT
            ? `new ${baseName}()`
            : baseName
}

module.exports = {
    meta: {
        docs: {
            description: "disallow deprecated APIs",
            category: "Best Practices",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v7.0.0-beta.0/docs/rules/no-deprecated-api.md",
        },
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    ignoreModuleItems: {
                        type: "array",
                        items: { enum: MODULE_ITEMS },
                        additionalItems: false,
                        uniqueItems: true,
                    },
                    ignoreGlobalItems: {
                        type: "array",
                        items: { enum: GLOBAL_ITEMS },
                        additionalItems: false,
                        uniqueItems: true,
                    },

                    // Deprecated since v4.2.0
                    ignoreIndirectDependencies: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options = context.options[0] || {}
        const ignoredModuleItems = options.ignoreModuleItems || []
        const ignoredGlobalItems = options.ignoreGlobalItems || []

        /**
         * Reports a use of a deprecated API.
         *
         * @param {ASTNode} node - A node to report.
         * @param {string} name - The name of a deprecated API.
         * @param {{since: number, replacedBy: string}} info - Information of the API.
         * @returns {void}
         */
        function reportItem(node, name, info) {
            context.report({
                node,
                loc: node.loc,
                message:
                    "{{name}} was deprecated since v{{version}}{{replace}}.",
                data: {
                    name,
                    version: toVersionText(info.since),
                    replace: toReplaceMessage(info.replacedBy),
                },
            })
        }

        return {
            "Program:exit"() {
                const tracker = new ReferenceTracker(context.getScope(), {
                    mode: "legacy",
                })

                for (const report of tracker.iterateGlobalReferences(GLOBALS)) {
                    const { node, path, type, info } = report
                    const name = toName(type, path)

                    if (!ignoredGlobalItems.includes(name)) {
                        reportItem(node, `'${name}'`, info)
                    }
                }
                for (const report of tracker.iterateCjsReferences(MODULES)) {
                    const { node, path, type, info } = report
                    const name = toName(type, path)
                    const suffix = path.length === 1 ? " module" : ""

                    if (!ignoredModuleItems.includes(name)) {
                        reportItem(node, `'${name}'${suffix}`, info)
                    }
                }
                for (const report of tracker.iterateEsmReferences(MODULES)) {
                    const { node, path, type, info } = report
                    const name = toName(type, path)
                    const suffix = path.length === 1 ? " module" : ""

                    if (!ignoredModuleItems.includes(name)) {
                        reportItem(node, `'${name}'${suffix}`, info)
                    }
                }
            },
        }
    },
}
