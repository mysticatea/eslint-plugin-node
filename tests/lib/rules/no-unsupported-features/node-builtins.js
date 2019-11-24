/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/node-builtins")

/**
 * Concatenate patterns.
 * @param {Array<{valid:Array,invalid:Array}>} patterns The patterns to concat.
 * @returns {{valid:Array,invalid:Array}} The concatenated patterns.
 */
function concat(patterns) {
    const ret = {
        valid: [],
        invalid: [],
    }

    for (const { valid, invalid } of patterns) {
        ret.valid.push(...valid)
        ret.invalid.push(...invalid)
    }

    return ret
}

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        Buffer: false,
        URL: false,
        URLSearchParams: false,
        console: false,
        process: false,
        require: false,
    },
}).run(
    "no-unsupported-features/node-builtins",
    rule,
    concat([
        //----------------------------------------------------------------------
        // assert
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('assert').strictEqual()",
                    options: [{ version: "0.12.0" }],
                },
                {
                    code:
                        "var assert = require('assert'); assert(); assert.strictEqual()",
                    options: [{ version: "0.12.0" }],
                },
                {
                    code: "require('assert').deepStrictEqual()",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code:
                        "var assert = require('assert'); assert.deepStrictEqual()",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code:
                        "var { deepStrictEqual } = require('assert'); deepStrictEqual()",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code:
                        "import assert from 'assert'; assert.deepStrictEqual()",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code:
                        "import { deepStrictEqual } from 'assert'; deepStrictEqual()",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "require('assert').notDeepStrictEqual()",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "require('assert').rejects()",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "require('assert').doesNotReject()",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "require('assert').strict.rejects()",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "require('assert').strict.doesNotReject()",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "var assert = require('assert').strict",
                    options: [{ version: "9.9.0" }],
                },
                {
                    code:
                        "var {strict: assert} = require('assert'); assert.rejects()",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "require('assert').deepStrictEqual()",
                    options: [
                        {
                            version: "3.9.9",
                            ignores: ["assert.deepStrictEqual"],
                        },
                    ],
                },
                {
                    code:
                        "var assert = require('assert'); assert.deepStrictEqual()",
                    options: [
                        {
                            version: "3.9.9",
                            ignores: ["assert.deepStrictEqual"],
                        },
                    ],
                },
                {
                    code:
                        "var { deepStrictEqual } = require('assert'); deepStrictEqual()",
                    options: [
                        {
                            version: "3.9.9",
                            ignores: ["assert.deepStrictEqual"],
                        },
                    ],
                },
                {
                    code:
                        "import assert from 'assert'; assert.deepStrictEqual()",
                    options: [
                        {
                            version: "3.9.9",
                            ignores: ["assert.deepStrictEqual"],
                        },
                    ],
                },
                {
                    code:
                        "import { deepStrictEqual } from 'assert'; deepStrictEqual()",
                    options: [
                        {
                            version: "3.9.9",
                            ignores: ["assert.deepStrictEqual"],
                        },
                    ],
                },
                {
                    code: "require('assert').notDeepStrictEqual()",
                    options: [
                        {
                            version: "3.9.9",
                            ignores: ["assert.notDeepStrictEqual"],
                        },
                    ],
                },
                {
                    code: "require('assert').rejects()",
                    options: [
                        { version: "9.9.9", ignores: ["assert.rejects"] },
                    ],
                },
                {
                    code: "require('assert').doesNotReject()",
                    options: [
                        { version: "9.9.9", ignores: ["assert.doesNotReject"] },
                    ],
                },
                {
                    code: "require('assert').strict.rejects()",
                    options: [
                        {
                            version: "9.9.9",
                            ignores: ["assert.strict.rejects"],
                        },
                    ],
                },
                {
                    code: "require('assert').strict.doesNotReject()",
                    options: [
                        {
                            version: "9.9.9",
                            ignores: ["assert.strict.doesNotReject"],
                        },
                    ],
                },
                {
                    code: "var assert = require('assert').strict",
                    options: [{ version: "9.8.9", ignores: ["assert.strict"] }],
                },
                {
                    code:
                        "var {strict: assert} = require('assert'); assert.rejects()",
                    options: [
                        {
                            version: "9.8.9",
                            ignores: ["assert.strict", "assert.strict.rejects"],
                        },
                    ],
                },
            ],
            invalid: [
                {
                    code: "require('assert').deepStrictEqual()",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "assert.deepStrictEqual",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "var assert = require('assert'); assert.deepStrictEqual()",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "assert.deepStrictEqual",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "var { deepStrictEqual } = require('assert'); deepStrictEqual()",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "assert.deepStrictEqual",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "import assert from 'assert'; assert.deepStrictEqual()",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "assert.deepStrictEqual",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "import { deepStrictEqual } from 'assert'; deepStrictEqual()",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "assert.deepStrictEqual",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('assert').notDeepStrictEqual()",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "assert.notDeepStrictEqual",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('assert').rejects()",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "assert.rejects",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('assert').doesNotReject()",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "assert.doesNotReject",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('assert').strict.rejects()",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "assert.strict.rejects",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('assert').strict.doesNotReject()",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "assert.strict.doesNotReject",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "var assert = require('assert').strict",
                    options: [{ version: "9.8.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "assert.strict",
                                supported: "9.9.0 (backported: ^8.13.0)",
                                version: "9.8.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "var {strict: assert} = require('assert'); assert.rejects()",
                    options: [{ version: "9.8.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "assert.strict",
                                supported: "9.9.0 (backported: ^8.13.0)",
                                version: "9.8.9",
                            },
                        },
                        {
                            messageId: "unsupported",
                            data: {
                                name: "assert.strict.rejects",
                                supported: "10.0.0",
                                version: "9.8.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // async_hooks
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('async_hooks')",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "import hooks from 'async_hooks'",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "require('async_hooks').createHook()",
                    options: [{ version: "8.1.0" }],
                },
                {
                    code:
                        "var hooks = require('async_hooks'); hooks.createHook()",
                    options: [{ version: "8.1.0" }],
                },
                {
                    code:
                        "var { createHook } = require('async_hooks'); createHook()",
                    options: [{ version: "8.1.0" }],
                },
                {
                    code: "import hooks from 'async_hooks'; hooks.createHook()",
                    options: [{ version: "8.1.0" }],
                },
                {
                    code:
                        "import { createHook } from 'async_hooks'; createHook()",
                    options: [{ version: "8.1.0" }],
                },

                // Ignores
                {
                    code: "require('async_hooks')",
                    options: [{ version: "7.9.9", ignores: ["async_hooks"] }],
                },
                {
                    code: "import hooks from 'async_hooks'",
                    options: [{ version: "7.9.9", ignores: ["async_hooks"] }],
                },
                {
                    code: "import { createHook } from 'async_hooks'",
                    options: [
                        {
                            version: "7.9.9",
                            ignores: ["async_hooks", "async_hooks.createHook"],
                        },
                    ],
                },
                {
                    code: "require('async_hooks').createHook()",
                    options: [
                        {
                            version: "8.0.9",
                            ignores: ["async_hooks.createHook"],
                        },
                    ],
                },
                {
                    code:
                        "var hooks = require('async_hooks'); hooks.createHook()",
                    options: [
                        {
                            version: "8.0.9",
                            ignores: ["async_hooks.createHook"],
                        },
                    ],
                },
                {
                    code:
                        "var { createHook } = require('async_hooks'); createHook()",
                    options: [
                        {
                            version: "8.0.9",
                            ignores: ["async_hooks.createHook"],
                        },
                    ],
                },
                {
                    code:
                        "import async_hooks from 'async_hooks'; async_hooks.createHook()",
                    options: [
                        {
                            version: "8.0.9",
                            ignores: ["async_hooks.createHook"],
                        },
                    ],
                },
                {
                    code:
                        "import { createHook } from 'async_hooks'; createHook()",
                    options: [
                        {
                            version: "8.0.9",
                            ignores: ["async_hooks.createHook"],
                        },
                    ],
                },
            ],
            invalid: [
                {
                    code: "require('async_hooks')",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "async_hooks",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "import hooks from 'async_hooks'",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "async_hooks",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { createHook } from 'async_hooks'",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "async_hooks",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                        {
                            messageId: "unsupported",
                            data: {
                                name: "async_hooks.createHook",
                                supported: "8.1.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('async_hooks').createHook()",
                    options: [{ version: "8.0.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "async_hooks.createHook",
                                supported: "8.1.0",
                                version: "8.0.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "var hooks = require('async_hooks'); hooks.createHook()",
                    options: [{ version: "8.0.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "async_hooks.createHook",
                                supported: "8.1.0",
                                version: "8.0.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "var { createHook } = require('async_hooks'); createHook()",
                    options: [{ version: "8.0.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "async_hooks.createHook",
                                supported: "8.1.0",
                                version: "8.0.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "import async_hooks from 'async_hooks'; async_hooks.createHook()",
                    options: [{ version: "8.0.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "async_hooks.createHook",
                                supported: "8.1.0",
                                version: "8.0.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "import { createHook } from 'async_hooks'; createHook()",
                    options: [{ version: "8.0.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "async_hooks.createHook",
                                supported: "8.1.0",
                                version: "8.0.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // buffer
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "Buffer.alloc",
                    options: [{ version: "4.5.0" }],
                },
                {
                    code: "Buffer.allocUnsafe",
                    options: [{ version: "4.5.0" }],
                },
                {
                    code: "Buffer.allocUnsafeSlow",
                    options: [{ version: "4.5.0" }],
                },
                {
                    code: "Buffer.from",
                    options: [{ version: "4.5.0" }],
                },
                {
                    code: "require('buffer').constants",
                    options: [{ version: "8.2.0" }],
                },
                {
                    code: "var cp = require('buffer'); cp.constants",
                    options: [{ version: "8.2.0" }],
                },
                {
                    code: "var { constants } = require('buffer');",
                    options: [{ version: "8.2.0" }],
                },
                {
                    code: "import cp from 'buffer'; cp.constants",
                    options: [{ version: "8.2.0" }],
                },
                {
                    code: "import { constants } from 'buffer'",
                    options: [{ version: "8.2.0" }],
                },
                {
                    code: "var {Buffer: b} = require('buffer'); b.alloc",
                    options: [{ version: "4.5.0" }],
                },
                {
                    code: "var {Buffer: b} = require('buffer'); b.allocUnsafe",
                    options: [{ version: "4.5.0" }],
                },
                {
                    code:
                        "var {Buffer: b} = require('buffer'); b.allocUnsafeSlow",
                    options: [{ version: "4.5.0" }],
                },
                {
                    code: "var {Buffer: b} = require('buffer'); b.from",
                    options: [{ version: "4.5.0" }],
                },
                {
                    code: "require('buffer').kMaxLength",
                    options: [{ version: "3.0.0" }],
                },
                {
                    code: "require('buffer').transcode",
                    options: [{ version: "7.1.0" }],
                },

                // Ignores
                {
                    code: "Buffer.alloc",
                    options: [{ version: "4.4.9", ignores: ["Buffer.alloc"] }],
                },
                {
                    code: "Buffer.allocUnsafe",
                    options: [
                        { version: "4.4.9", ignores: ["Buffer.allocUnsafe"] },
                    ],
                },
                {
                    code: "Buffer.allocUnsafeSlow",
                    options: [
                        {
                            version: "4.4.9",
                            ignores: ["Buffer.allocUnsafeSlow"],
                        },
                    ],
                },
                {
                    code: "Buffer.from",
                    options: [{ version: "4.4.9", ignores: ["Buffer.from"] }],
                },
                {
                    code: "require('buffer').constants",
                    options: [
                        { version: "8.1.9", ignores: ["buffer.constants"] },
                    ],
                },
                {
                    code: "var cp = require('buffer'); cp.constants",
                    options: [
                        { version: "8.1.9", ignores: ["buffer.constants"] },
                    ],
                },
                {
                    code: "var { constants } = require('buffer');",
                    options: [
                        { version: "8.1.9", ignores: ["buffer.constants"] },
                    ],
                },
                {
                    code: "import cp from 'buffer'; cp.constants",
                    options: [
                        { version: "8.1.9", ignores: ["buffer.constants"] },
                    ],
                },
                {
                    code: "import { constants } from 'buffer'",
                    options: [
                        { version: "8.1.9", ignores: ["buffer.constants"] },
                    ],
                },
                {
                    code: "var {Buffer: b} = require('buffer'); b.alloc",
                    options: [
                        { version: "4.4.9", ignores: ["buffer.Buffer.alloc"] },
                    ],
                },
                {
                    code: "var {Buffer: b} = require('buffer'); b.allocUnsafe",
                    options: [
                        {
                            version: "4.4.9",
                            ignores: ["buffer.Buffer.allocUnsafe"],
                        },
                    ],
                },
                {
                    code:
                        "var {Buffer: b} = require('buffer'); b.allocUnsafeSlow",
                    options: [
                        {
                            version: "4.4.9",
                            ignores: ["buffer.Buffer.allocUnsafeSlow"],
                        },
                    ],
                },
                {
                    code: "var {Buffer: b} = require('buffer'); b.from",
                    options: [
                        { version: "4.4.9", ignores: ["buffer.Buffer.from"] },
                    ],
                },
                {
                    code: "require('buffer').kMaxLength",
                    options: [
                        { version: "2.9.9", ignores: ["buffer.kMaxLength"] },
                    ],
                },
                {
                    code: "require('buffer').transcode",
                    options: [
                        { version: "7.0.9", ignores: ["buffer.transcode"] },
                    ],
                },
            ],
            invalid: [
                {
                    code: "Buffer.alloc",
                    options: [{ version: "4.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "Buffer.alloc",
                                supported: "4.5.0",
                                version: "4.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "Buffer.allocUnsafe",
                    options: [{ version: "4.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "Buffer.allocUnsafe",
                                supported: "4.5.0",
                                version: "4.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "Buffer.allocUnsafeSlow",
                    options: [{ version: "4.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "Buffer.allocUnsafeSlow",
                                supported: "4.5.0",
                                version: "4.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "Buffer.from",
                    options: [{ version: "4.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "Buffer.from",
                                supported: "4.5.0",
                                version: "4.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('buffer').constants",
                    options: [{ version: "8.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "buffer.constants",
                                supported: "8.2.0",
                                version: "8.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "var cp = require('buffer'); cp.constants",
                    options: [{ version: "8.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "buffer.constants",
                                supported: "8.2.0",
                                version: "8.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "var { constants } = require('buffer');",
                    options: [{ version: "8.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "buffer.constants",
                                supported: "8.2.0",
                                version: "8.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "import cp from 'buffer'; cp.constants",
                    options: [{ version: "8.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "buffer.constants",
                                supported: "8.2.0",
                                version: "8.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { constants } from 'buffer'",
                    options: [{ version: "8.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "buffer.constants",
                                supported: "8.2.0",
                                version: "8.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "var {Buffer: b} = require('buffer'); b.alloc",
                    options: [{ version: "4.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "buffer.Buffer.alloc",
                                supported: "4.5.0",
                                version: "4.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "var {Buffer: b} = require('buffer'); b.allocUnsafe",
                    options: [{ version: "4.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "buffer.Buffer.allocUnsafe",
                                supported: "4.5.0",
                                version: "4.4.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "var {Buffer: b} = require('buffer'); b.allocUnsafeSlow",
                    options: [{ version: "4.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "buffer.Buffer.allocUnsafeSlow",
                                supported: "4.5.0",
                                version: "4.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "var {Buffer: b} = require('buffer'); b.from",
                    options: [{ version: "4.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "buffer.Buffer.from",
                                supported: "4.5.0",
                                version: "4.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('buffer').kMaxLength",
                    options: [{ version: "2.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "buffer.kMaxLength",
                                supported: "3.0.0",
                                version: "2.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('buffer').transcode",
                    options: [{ version: "7.0.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "buffer.transcode",
                                supported: "7.1.0",
                                version: "7.0.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // child_process
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('child_process').ChildProcess",
                    options: [{ version: "2.2.0" }],
                },
                {
                    code: "var cp = require('child_process'); cp.ChildProcess",
                    options: [{ version: "2.2.0" }],
                },
                {
                    code:
                        "var { ChildProcess } = require('child_process'); ChildProcess",
                    options: [{ version: "2.2.0" }],
                },
                {
                    code: "import cp from 'child_process'; cp.ChildProcess",
                    options: [{ version: "2.2.0" }],
                },
                {
                    code: "import { ChildProcess } from 'child_process'",
                    options: [{ version: "2.2.0" }],
                },

                // Ignores.
                {
                    code: "require('child_process').ChildProcess",
                    options: [
                        {
                            version: "2.1.9",
                            ignores: ["child_process.ChildProcess"],
                        },
                    ],
                },
                {
                    code: "var cp = require('child_process'); cp.ChildProcess",
                    options: [
                        {
                            version: "2.1.9",
                            ignores: ["child_process.ChildProcess"],
                        },
                    ],
                },
                {
                    code:
                        "var { ChildProcess } = require('child_process'); ChildProcess",
                    options: [
                        {
                            version: "2.1.9",
                            ignores: ["child_process.ChildProcess"],
                        },
                    ],
                },
                {
                    code: "import cp from 'child_process'; cp.ChildProcess",
                    options: [
                        {
                            version: "2.1.9",
                            ignores: ["child_process.ChildProcess"],
                        },
                    ],
                },
                {
                    code: "import { ChildProcess } from 'child_process'",
                    options: [
                        {
                            version: "2.1.9",
                            ignores: ["child_process.ChildProcess"],
                        },
                    ],
                },
            ],
            invalid: [
                {
                    code: "require('child_process').ChildProcess",
                    options: [{ version: "2.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "child_process.ChildProcess",
                                supported: "2.2.0",
                                version: "2.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "var cp = require('child_process'); cp.ChildProcess",
                    options: [{ version: "2.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "child_process.ChildProcess",
                                supported: "2.2.0",
                                version: "2.1.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "var { ChildProcess } = require('child_process'); ChildProcess",
                    options: [{ version: "2.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "child_process.ChildProcess",
                                supported: "2.2.0",
                                version: "2.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "import cp from 'child_process'; cp.ChildProcess",
                    options: [{ version: "2.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "child_process.ChildProcess",
                                supported: "2.2.0",
                                version: "2.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { ChildProcess } from 'child_process'",
                    options: [{ version: "2.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "child_process.ChildProcess",
                                supported: "2.2.0",
                                version: "2.1.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // console
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "console.clear()",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "require('console').clear()",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "var c = require('console'); c.clear()",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "var { clear } = require('console'); clear()",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "import c from 'console'; c.clear()",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "console.count()",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "console.countReset()",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "console.debug()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "console.dirxml()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "console.group()",
                    options: [{ version: "8.5.0" }],
                },
                {
                    code: "console.groupCollapsed()",
                    options: [{ version: "8.5.0" }],
                },
                {
                    code: "console.groupEnd()",
                    options: [{ version: "8.5.0" }],
                },
                {
                    code: "console.table()",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "console.markTimeline()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "console.profile()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "console.profileEnd()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "console.timeStamp()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "console.timeline()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "console.timelineEnd()",
                    options: [{ version: "8.0.0" }],
                },

                // Ignores.
                {
                    code: "console.clear()",
                    options: [{ version: "8.2.9", ignores: ["console.clear"] }],
                },
                {
                    code: "require('console').clear()",
                    options: [{ version: "8.2.9", ignores: ["console.clear"] }],
                },
                {
                    code: "var c = require('console'); c.clear()",
                    options: [{ version: "8.2.9", ignores: ["console.clear"] }],
                },
                {
                    code: "var { clear } = require('console'); clear()",
                    options: [{ version: "8.2.9", ignores: ["console.clear"] }],
                },
                {
                    code: "import c from 'console'; c.clear()",
                    options: [{ version: "8.2.9", ignores: ["console.clear"] }],
                },
                {
                    code: "console.count()",
                    options: [{ version: "8.2.9", ignores: ["console.count"] }],
                },
                {
                    code: "console.countReset()",
                    options: [
                        { version: "8.2.9", ignores: ["console.countReset"] },
                    ],
                },
                {
                    code: "console.debug()",
                    options: [{ version: "7.9.9", ignores: ["console.debug"] }],
                },
                {
                    code: "console.dirxml()",
                    options: [
                        { version: "7.9.9", ignores: ["console.dirxml"] },
                    ],
                },
                {
                    code: "console.group()",
                    options: [{ version: "8.4.9", ignores: ["console.group"] }],
                },
                {
                    code: "console.groupCollapsed()",
                    options: [
                        {
                            version: "8.4.9",
                            ignores: ["console.groupCollapsed"],
                        },
                    ],
                },
                {
                    code: "console.groupEnd()",
                    options: [
                        { version: "8.4.9", ignores: ["console.groupEnd"] },
                    ],
                },
                {
                    code: "console.table()",
                    options: [{ version: "9.9.9", ignores: ["console.table"] }],
                },
                {
                    code: "console.markTimeline()",
                    options: [
                        { version: "7.9.9", ignores: ["console.markTimeline"] },
                    ],
                },
                {
                    code: "console.profile()",
                    options: [
                        { version: "7.9.9", ignores: ["console.profile"] },
                    ],
                },
                {
                    code: "console.profileEnd()",
                    options: [
                        { version: "7.9.9", ignores: ["console.profileEnd"] },
                    ],
                },
                {
                    code: "console.timeStamp()",
                    options: [
                        { version: "7.9.9", ignores: ["console.timeStamp"] },
                    ],
                },
                {
                    code: "console.timeline()",
                    options: [
                        { version: "7.9.9", ignores: ["console.timeline"] },
                    ],
                },
                {
                    code: "console.timelineEnd()",
                    options: [
                        { version: "7.9.9", ignores: ["console.timelineEnd"] },
                    ],
                },
            ],
            invalid: [
                {
                    code: "console.clear()",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.clear",
                                supported: "8.3.0 (backported: ^6.13.0)",
                                version: "8.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('console').clear()",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.clear",
                                supported: "8.3.0 (backported: ^6.13.0)",
                                version: "8.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "var c = require('console'); c.clear()",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.clear",
                                supported: "8.3.0 (backported: ^6.13.0)",
                                version: "8.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "var { clear } = require('console'); clear()",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.clear",
                                supported: "8.3.0 (backported: ^6.13.0)",
                                version: "8.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "import c from 'console'; c.clear()",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.clear",
                                supported: "8.3.0 (backported: ^6.13.0)",
                                version: "8.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.count()",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.count",
                                supported: "8.3.0 (backported: ^6.13.0)",
                                version: "8.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.countReset()",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.countReset",
                                supported: "8.3.0 (backported: ^6.13.0)",
                                version: "8.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.debug()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.debug",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.dirxml()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.dirxml",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.group()",
                    options: [{ version: "8.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.group",
                                supported: "8.5.0",
                                version: "8.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.groupCollapsed()",
                    options: [{ version: "8.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.groupCollapsed",
                                supported: "8.5.0",
                                version: "8.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.groupEnd()",
                    options: [{ version: "8.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.groupEnd",
                                supported: "8.5.0",
                                version: "8.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.table()",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.table",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.markTimeline()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.markTimeline",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.profile()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.profile",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.profileEnd()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.profileEnd",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.timeStamp()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.timeStamp",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.timeline()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.timeline",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "console.timelineEnd()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "console.timelineEnd",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // crypto
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('crypto').constants",
                    options: [{ version: "6.3.0" }],
                },
                {
                    code: "var hooks = require('crypto'); hooks.constants",
                    options: [{ version: "6.3.0" }],
                },
                {
                    code: "var { constants } = require('crypto'); constants",
                    options: [{ version: "6.3.0" }],
                },
                {
                    code: "import crypto from 'crypto'; crypto.constants",
                    options: [{ version: "6.3.0" }],
                },
                {
                    code: "import { constants } from 'crypto'; constants",
                    options: [{ version: "6.3.0" }],
                },
                {
                    code: "require('crypto').Certificate.exportChallenge()",
                    options: [{ version: "9.0.0" }],
                },
                {
                    code:
                        "var { Certificate: c } = require('crypto'); c.exportChallenge()",
                    options: [{ version: "9.0.0" }],
                },
                {
                    code:
                        "var { Certificate: c } = require('crypto'); c.exportPublicKey()",
                    options: [{ version: "9.0.0" }],
                },
                {
                    code:
                        "var { Certificate: c } = require('crypto'); c.verifySpkac()",
                    options: [{ version: "9.0.0" }],
                },
                {
                    code: "require('crypto').fips",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "require('crypto').getCurves",
                    options: [{ version: "2.3.0" }],
                },
                {
                    code: "require('crypto').getFips",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "require('crypto').privateEncrypt",
                    options: [{ version: "1.1.0" }],
                },
                {
                    code: "require('crypto').publicDecrypt",
                    options: [{ version: "1.1.0" }],
                },
                {
                    code: "require('crypto').randomFillSync",
                    options: [{ version: "7.10.0" }],
                },
                {
                    code: "require('crypto').randomFill",
                    options: [{ version: "7.10.0" }],
                },
                {
                    code: "require('crypto').scrypt",
                    options: [{ version: "10.5.0" }],
                },
                {
                    code: "require('crypto').scryptSync",
                    options: [{ version: "10.5.0" }],
                },
                {
                    code: "require('crypto').setFips",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "require('crypto').timingSafeEqual",
                    options: [{ version: "6.6.0" }],
                },

                // Ignores.
                {
                    code: "require('crypto').constants",
                    options: [
                        { version: "6.2.9", ignores: ["crypto.constants"] },
                    ],
                },
                {
                    code: "var hooks = require('crypto'); hooks.constants",
                    options: [
                        { version: "6.2.9", ignores: ["crypto.constants"] },
                    ],
                },
                {
                    code: "var { constants } = require('crypto'); constants",
                    options: [
                        { version: "6.2.9", ignores: ["crypto.constants"] },
                    ],
                },
                {
                    code: "import crypto from 'crypto'; crypto.constants",
                    options: [
                        { version: "6.2.9", ignores: ["crypto.constants"] },
                    ],
                },
                {
                    code: "import { constants } from 'crypto'; constants",
                    options: [
                        { version: "6.2.9", ignores: ["crypto.constants"] },
                    ],
                },
                {
                    code: "require('crypto').Certificate.exportChallenge()",
                    options: [
                        {
                            version: "8.9.9",
                            ignores: ["crypto.Certificate.exportChallenge"],
                        },
                    ],
                },
                {
                    code:
                        "var { Certificate: c } = require('crypto'); c.exportChallenge()",
                    options: [
                        {
                            version: "8.9.9",
                            ignores: ["crypto.Certificate.exportChallenge"],
                        },
                    ],
                },
                {
                    code:
                        "var { Certificate: c } = require('crypto'); c.exportPublicKey()",
                    options: [
                        {
                            version: "8.9.9",
                            ignores: ["crypto.Certificate.exportPublicKey"],
                        },
                    ],
                },
                {
                    code:
                        "var { Certificate: c } = require('crypto'); c.verifySpkac()",
                    options: [
                        {
                            version: "8.9.9",
                            ignores: ["crypto.Certificate.verifySpkac"],
                        },
                    ],
                },
                {
                    code: "require('crypto').fips",
                    options: [{ version: "5.9.9", ignores: ["crypto.fips"] }],
                },
                {
                    code: "require('crypto').getCurves",
                    options: [
                        { version: "2.2.9", ignores: ["crypto.getCurves"] },
                    ],
                },
                {
                    code: "require('crypto').getFips",
                    options: [
                        { version: "9.9.9", ignores: ["crypto.getFips"] },
                    ],
                },
                {
                    code: "require('crypto').privateEncrypt",
                    options: [
                        {
                            version: "1.0.9",
                            ignores: ["crypto.privateEncrypt"],
                        },
                    ],
                },
                {
                    code: "require('crypto').publicDecrypt",
                    options: [
                        { version: "1.0.9", ignores: ["crypto.publicDecrypt"] },
                    ],
                },
                {
                    code: "require('crypto').randomFillSync",
                    options: [
                        {
                            version: "7.9.9",
                            ignores: ["crypto.randomFillSync"],
                        },
                    ],
                },
                {
                    code: "require('crypto').randomFill",
                    options: [
                        { version: "7.9.9", ignores: ["crypto.randomFill"] },
                    ],
                },
                {
                    code: "require('crypto').scrypt",
                    options: [
                        { version: "10.4.9", ignores: ["crypto.scrypt"] },
                    ],
                },
                {
                    code: "require('crypto').scryptSync",
                    options: [
                        { version: "10.4.9", ignores: ["crypto.scryptSync"] },
                    ],
                },
                {
                    code: "require('crypto').setFips",
                    options: [
                        { version: "9.9.9", ignores: ["crypto.setFips"] },
                    ],
                },
                {
                    code: "require('crypto').timingSafeEqual",
                    options: [
                        {
                            version: "6.5.9",
                            ignores: ["crypto.timingSafeEqual"],
                        },
                    ],
                },
            ],
            invalid: [
                {
                    code: "require('crypto').constants",
                    options: [{ version: "6.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.constants",
                                supported: "6.3.0",
                                version: "6.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "var hooks = require('crypto'); hooks.constants",
                    options: [{ version: "6.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.constants",
                                supported: "6.3.0",
                                version: "6.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "var { constants } = require('crypto'); constants",
                    options: [{ version: "6.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.constants",
                                supported: "6.3.0",
                                version: "6.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "import crypto from 'crypto'; crypto.constants",
                    options: [{ version: "6.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.constants",
                                supported: "6.3.0",
                                version: "6.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { constants } from 'crypto'; constants",
                    options: [{ version: "6.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.constants",
                                supported: "6.3.0",
                                version: "6.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('crypto').Certificate.exportChallenge()",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.Certificate.exportChallenge",
                                supported: "9.0.0",
                                version: "8.9.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "var { Certificate: c } = require('crypto'); c.exportChallenge()",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.Certificate.exportChallenge",
                                supported: "9.0.0",
                                version: "8.9.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "var { Certificate: c } = require('crypto'); c.exportPublicKey()",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.Certificate.exportPublicKey",
                                supported: "9.0.0",
                                version: "8.9.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "var { Certificate: c } = require('crypto'); c.verifySpkac()",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.Certificate.verifySpkac",
                                supported: "9.0.0",
                                version: "8.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('crypto').fips",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.fips",
                                supported: "6.0.0",
                                version: "5.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('crypto').getCurves",
                    options: [{ version: "2.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.getCurves",
                                supported: "2.3.0",
                                version: "2.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('crypto').getFips",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.getFips",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('crypto').privateEncrypt",
                    options: [{ version: "1.0.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.privateEncrypt",
                                supported: "1.1.0",
                                version: "1.0.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('crypto').publicDecrypt",
                    options: [{ version: "1.0.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.publicDecrypt",
                                supported: "1.1.0",
                                version: "1.0.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('crypto').randomFillSync",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.randomFillSync",
                                supported: "7.10.0 (backported: ^6.13.0)",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('crypto').randomFill",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.randomFill",
                                supported: "7.10.0 (backported: ^6.13.0)",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('crypto').scrypt",
                    options: [{ version: "10.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.scrypt",
                                supported: "10.5.0",
                                version: "10.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('crypto').scryptSync",
                    options: [{ version: "10.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.scryptSync",
                                supported: "10.5.0",
                                version: "10.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('crypto').setFips",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.setFips",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('crypto').timingSafeEqual",
                    options: [{ version: "6.5.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "crypto.timingSafeEqual",
                                supported: "6.6.0",
                                version: "6.5.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // dns
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('dns').Resolver",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "var hooks = require('dns'); hooks.Resolver",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "var { Resolver } = require('dns'); Resolver",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "import dns from 'dns'; dns.Resolver",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "import { Resolver } from 'dns'; Resolver",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "require('dns').resolvePtr",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "require('dns').promises",
                    options: [{ version: "11.14.0" }],
                },

                // Ignores
                {
                    code: "require('dns').Resolver",
                    options: [{ version: "8.2.9", ignores: ["dns.Resolver"] }],
                },
                {
                    code: "var hooks = require('dns'); hooks.Resolver",
                    options: [{ version: "8.2.9", ignores: ["dns.Resolver"] }],
                },
                {
                    code: "var { Resolver } = require('dns'); Resolver",
                    options: [{ version: "8.2.9", ignores: ["dns.Resolver"] }],
                },
                {
                    code: "import dns from 'dns'; dns.Resolver",
                    options: [{ version: "8.2.9", ignores: ["dns.Resolver"] }],
                },
                {
                    code: "import { Resolver } from 'dns'; Resolver",
                    options: [{ version: "8.2.9", ignores: ["dns.Resolver"] }],
                },
                {
                    code: "require('dns').resolvePtr",
                    options: [
                        { version: "5.9.9", ignores: ["dns.resolvePtr"] },
                    ],
                },
                {
                    code: "require('dns').promises",
                    options: [
                        { version: "11.13.9", ignores: ["dns.promises"] },
                    ],
                },
            ],
            invalid: [
                {
                    code: "require('dns').Resolver",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "dns.Resolver",
                                supported: "8.3.0",
                                version: "8.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "var hooks = require('dns'); hooks.Resolver",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "dns.Resolver",
                                supported: "8.3.0",
                                version: "8.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "var { Resolver } = require('dns'); Resolver",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "dns.Resolver",
                                supported: "8.3.0",
                                version: "8.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "import dns from 'dns'; dns.Resolver",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "dns.Resolver",
                                supported: "8.3.0",
                                version: "8.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { Resolver } from 'dns'; Resolver",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "dns.Resolver",
                                supported: "8.3.0",
                                version: "8.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('dns').resolvePtr",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "dns.resolvePtr",
                                supported: "6.0.0",
                                version: "5.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('dns').promises",
                    options: [{ version: "11.13.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "dns.promises",
                                supported: "11.14.0 (backported: ^10.17.0)",
                                version: "11.13.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // fs
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('fs').promises",
                    options: [{ version: "11.14.0" }],
                },
                {
                    code: "var fs = require('fs'); fs.promises",
                    options: [{ version: "11.14.0" }],
                },
                {
                    code: "var { promises } = require('fs'); promises",
                    options: [{ version: "11.14.0" }],
                },
                {
                    code: "import fs from 'fs'; fs.promises",
                    options: [{ version: "11.14.0" }],
                },
                {
                    code: "import { promises } from 'fs'",
                    options: [{ version: "11.14.0" }],
                },
                {
                    code: "require('fs').copyFile",
                    options: [{ version: "8.5.0" }],
                },
                {
                    code: "require('fs').copyFileSync",
                    options: [{ version: "8.5.0" }],
                },
                {
                    code: "require('fs').mkdtemp",
                    options: [{ version: "5.10.0" }],
                },
                {
                    code: "require('fs').mkdtempSync",
                    options: [{ version: "5.10.0" }],
                },
                {
                    code: "require('fs').realpath.native",
                    options: [{ version: "9.2.0" }],
                },
                {
                    code: "require('fs').realpathSync.native",
                    options: [{ version: "9.2.0" }],
                },

                // Ignores
                {
                    code: "require('fs').promises",
                    options: [{ version: "11.13.9", ignores: ["fs.promises"] }],
                },
                {
                    code: "var fs = require('fs'); fs.promises",
                    options: [{ version: "11.13.9", ignores: ["fs.promises"] }],
                },
                {
                    code: "var { promises } = require('fs'); promises",
                    options: [{ version: "11.13.9", ignores: ["fs.promises"] }],
                },
                {
                    code: "import fs from 'fs'; fs.promises",
                    options: [{ version: "11.13.9", ignores: ["fs.promises"] }],
                },
                {
                    code: "import { promises } from 'fs'",
                    options: [{ version: "11.13.9", ignores: ["fs.promises"] }],
                },
                {
                    code: "require('fs').copyFile",
                    options: [{ version: "8.4.9", ignores: ["fs.copyFile"] }],
                },
                {
                    code: "require('fs').copyFileSync",
                    options: [
                        { version: "8.4.9", ignores: ["fs.copyFileSync"] },
                    ],
                },
                {
                    code: "require('fs').mkdtemp",
                    options: [{ version: "5.9.9", ignores: ["fs.mkdtemp"] }],
                },
                {
                    code: "require('fs').mkdtempSync",
                    options: [
                        { version: "5.9.9", ignores: ["fs.mkdtempSync"] },
                    ],
                },
                {
                    code: "require('fs').realpath.native",
                    options: [
                        { version: "9.1.9", ignores: ["fs.realpath.native"] },
                    ],
                },
                {
                    code: "require('fs').realpathSync.native",
                    options: [
                        {
                            version: "9.1.9",
                            ignores: ["fs.realpathSync.native"],
                        },
                    ],
                },
            ],
            invalid: [
                {
                    code: "require('fs').promises",
                    options: [{ version: "11.13.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "fs.promises",
                                supported: "11.14.0 (backported: ^10.17.0)",
                                version: "11.13.9",
                            },
                        },
                    ],
                },
                {
                    code: "var fs = require('fs'); fs.promises",
                    options: [{ version: "11.13.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "fs.promises",
                                supported: "11.14.0 (backported: ^10.17.0)",
                                version: "11.13.9",
                            },
                        },
                    ],
                },
                {
                    code: "var { promises } = require('fs'); promises",
                    options: [{ version: "11.13.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "fs.promises",
                                supported: "11.14.0 (backported: ^10.17.0)",
                                version: "11.13.9",
                            },
                        },
                    ],
                },
                {
                    code: "import fs from 'fs'; fs.promises",
                    options: [{ version: "11.13.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "fs.promises",
                                supported: "11.14.0 (backported: ^10.17.0)",
                                version: "11.13.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { promises } from 'fs'",
                    options: [{ version: "11.13.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "fs.promises",
                                supported: "11.14.0 (backported: ^10.17.0)",
                                version: "11.13.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('fs').copyFile",
                    options: [{ version: "8.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "fs.copyFile",
                                supported: "8.5.0",
                                version: "8.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('fs').copyFileSync",
                    options: [{ version: "8.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "fs.copyFileSync",
                                supported: "8.5.0",
                                version: "8.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('fs').mkdtemp",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "fs.mkdtemp",
                                supported: "5.10.0",
                                version: "5.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('fs').mkdtempSync",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "fs.mkdtempSync",
                                supported: "5.10.0",
                                version: "5.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('fs').realpath.native",
                    options: [{ version: "9.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "fs.realpath.native",
                                supported: "9.2.0",
                                version: "9.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('fs').realpathSync.native",
                    options: [{ version: "9.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "fs.realpathSync.native",
                                supported: "9.2.0",
                                version: "9.1.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // http2
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('http2')",
                    options: [{ version: "10.10.0" }],
                },
                {
                    code: "import http2 from 'http2'",
                    options: [{ version: "10.10.0" }],
                },
                {
                    code: "require('http2')",
                    options: [{ version: "8.3.9", ignores: ["http2"] }],
                },
                {
                    code: "import http2 from 'http2'",
                    options: [{ version: "8.3.9", ignores: ["http2"] }],
                },
            ],
            invalid: [
                {
                    code: "require('http2')",
                    options: [{ version: "8.3.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "http2",
                                supported: "10.10.0 (backported: ^8.13.0)",
                                version: "8.3.9",
                            },
                        },
                    ],
                },
                {
                    code: "import http2 from 'http2'",
                    options: [{ version: "8.3.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "http2",
                                supported: "10.10.0 (backported: ^8.13.0)",
                                version: "8.3.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { createServer } from 'http2'",
                    options: [{ version: "8.3.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "http2",
                                supported: "10.10.0 (backported: ^8.13.0)",
                                version: "8.3.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // inspector
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('inspector')",
                    options: [{ version: "7.9.9", ignores: ["inspector"] }],
                },
                {
                    code: "import inspector from 'inspector'",
                    options: [{ version: "7.9.9", ignores: ["inspector"] }],
                },
            ],
            invalid: [
                {
                    code: "require('inspector')",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "inspector",
                                supported: "(none yet)",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "import inspector from 'inspector'",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "inspector",
                                supported: "(none yet)",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { open } from 'inspector'",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "inspector",
                                supported: "(none yet)",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // module
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require.resolve.paths()",
                    options: [{ version: "8.9.0" }],
                },
                {
                    code: "require('module').builtinModules",
                    options: [{ version: "9.3.0" }],
                },
                {
                    code: "require.resolve.paths()",
                    options: [
                        {
                            version: "8.8.9",
                            ignores: ["require.resolve.paths"],
                        },
                    ],
                },
                {
                    code: "require('module').builtinModules",
                    options: [
                        {
                            version: "9.2.9",
                            ignores: ["module.builtinModules"],
                        },
                    ],
                },
            ],
            invalid: [
                {
                    code: "require.resolve.paths()",
                    options: [{ version: "8.8.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "require.resolve.paths",
                                supported: "8.9.0",
                                version: "8.8.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('module').builtinModules",
                    options: [{ version: "9.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "module.builtinModules",
                                supported:
                                    "9.3.0 (backported: ^6.13.0, ^8.10.0)",
                                version: "9.2.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // os
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('os').constants",
                    options: [{ version: "6.3.0" }],
                },
                {
                    code: "var hooks = require('os'); hooks.constants",
                    options: [{ version: "6.3.0" }],
                },
                {
                    code: "var { constants } = require('os'); constants",
                    options: [{ version: "6.3.0" }],
                },
                {
                    code: "import os from 'os'; os.constants",
                    options: [{ version: "6.3.0" }],
                },
                {
                    code: "import { constants } from 'os'; constants",
                    options: [{ version: "6.3.0" }],
                },
                {
                    code: "require('os').homedir",
                    options: [{ version: "2.3.0" }],
                },
                {
                    code: "require('os').userInfo",
                    options: [{ version: "6.0.0" }],
                },

                // Ignores
                {
                    code: "require('os').constants",
                    options: [{ version: "6.2.9", ignores: ["os.constants"] }],
                },
                {
                    code: "var hooks = require('os'); hooks.constants",
                    options: [{ version: "6.2.9", ignores: ["os.constants"] }],
                },
                {
                    code: "var { constants } = require('os'); constants",
                    options: [{ version: "6.2.9", ignores: ["os.constants"] }],
                },
                {
                    code: "import os from 'os'; os.constants",
                    options: [{ version: "6.2.9", ignores: ["os.constants"] }],
                },
                {
                    code: "import { constants } from 'os'; constants",
                    options: [{ version: "6.2.9", ignores: ["os.constants"] }],
                },
                {
                    code: "require('os').homedir",
                    options: [{ version: "2.2.9", ignores: ["os.homedir"] }],
                },
                {
                    code: "require('os').userInfo",
                    options: [{ version: "5.9.9", ignores: ["os.userInfo"] }],
                },
            ],
            invalid: [
                {
                    code: "require('os').constants",
                    options: [{ version: "6.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "os.constants",
                                supported: "6.3.0",
                                version: "6.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "var hooks = require('os'); hooks.constants",
                    options: [{ version: "6.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "os.constants",
                                supported: "6.3.0",
                                version: "6.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "var { constants } = require('os'); constants",
                    options: [{ version: "6.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "os.constants",
                                supported: "6.3.0",
                                version: "6.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "import os from 'os'; os.constants",
                    options: [{ version: "6.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "os.constants",
                                supported: "6.3.0",
                                version: "6.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { constants } from 'os'; constants",
                    options: [{ version: "6.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "os.constants",
                                supported: "6.3.0",
                                version: "6.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('os').homedir",
                    options: [{ version: "2.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "os.homedir",
                                supported: "2.3.0",
                                version: "2.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('os').userInfo",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "os.userInfo",
                                supported: "6.0.0",
                                version: "5.9.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // path
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('path').toNamespacedPath()",
                    options: [{ version: "9.0.0" }],
                },
                {
                    code: "var path = require('path'); path.toNamespacedPath()",
                    options: [{ version: "9.0.0" }],
                },
                {
                    code:
                        "var { toNamespacedPath } = require('path'); toNamespacedPath()",
                    options: [{ version: "9.0.0" }],
                },
                {
                    code: "import path from 'path'; path.toNamespacedPath()",
                    options: [{ version: "9.0.0" }],
                },
                {
                    code:
                        "import { toNamespacedPath } from 'path'; toNamespacedPath()",
                    options: [{ version: "9.0.0" }],
                },

                // Ignores
                {
                    code: "require('path').toNamespacedPath()",
                    options: [
                        {
                            version: "8.9.9",
                            ignores: ["path.toNamespacedPath"],
                        },
                    ],
                },
                {
                    code: "var path = require('path'); path.toNamespacedPath()",
                    options: [
                        {
                            version: "8.9.9",
                            ignores: ["path.toNamespacedPath"],
                        },
                    ],
                },
                {
                    code:
                        "var { toNamespacedPath } = require('path'); toNamespacedPath()",
                    options: [
                        {
                            version: "8.9.9",
                            ignores: ["path.toNamespacedPath"],
                        },
                    ],
                },
                {
                    code: "import path from 'path'; path.toNamespacedPath()",
                    options: [
                        {
                            version: "8.9.9",
                            ignores: ["path.toNamespacedPath"],
                        },
                    ],
                },
                {
                    code:
                        "import { toNamespacedPath } from 'path'; toNamespacedPath()",
                    options: [
                        {
                            version: "8.9.9",
                            ignores: ["path.toNamespacedPath"],
                        },
                    ],
                },
            ],
            invalid: [
                {
                    code: "require('path').toNamespacedPath()",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "path.toNamespacedPath",
                                supported: "9.0.0",
                                version: "8.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "var path = require('path'); path.toNamespacedPath()",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "path.toNamespacedPath",
                                supported: "9.0.0",
                                version: "8.9.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "var { toNamespacedPath } = require('path'); toNamespacedPath()",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "path.toNamespacedPath",
                                supported: "9.0.0",
                                version: "8.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "import path from 'path'; path.toNamespacedPath()",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "path.toNamespacedPath",
                                supported: "9.0.0",
                                version: "8.9.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "import { toNamespacedPath } from 'path'; toNamespacedPath()",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "path.toNamespacedPath",
                                supported: "9.0.0",
                                version: "8.9.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // perf_hooks
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('perf_hooks')",
                    options: [{ version: "8.5.0" }],
                },
                {
                    code: "import perf_hooks from 'perf_hooks'",
                    options: [{ version: "8.5.0" }],
                },
                {
                    code: "require('perf_hooks')",
                    options: [{ version: "8.4.9", ignores: ["perf_hooks"] }],
                },
                {
                    code: "import perf_hooks from 'perf_hooks'",
                    options: [{ version: "8.4.9", ignores: ["perf_hooks"] }],
                },
            ],
            invalid: [
                {
                    code: "require('perf_hooks')",
                    options: [{ version: "8.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "perf_hooks",
                                supported: "8.5.0",
                                version: "8.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "import perf_hooks from 'perf_hooks'",
                    options: [{ version: "8.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "perf_hooks",
                                supported: "8.5.0",
                                version: "8.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { open } from 'perf_hooks'",
                    options: [{ version: "8.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "perf_hooks",
                                supported: "8.5.0",
                                version: "8.4.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // process
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "process.argv0",
                    options: [{ version: "6.4.0" }],
                },
                {
                    code: "require('process').argv0",
                    options: [{ version: "6.4.0" }],
                },
                {
                    code: "var c = require('process'); c.argv0",
                    options: [{ version: "6.4.0" }],
                },
                {
                    code: "var { argv0 } = require('process'); argv0",
                    options: [{ version: "6.4.0" }],
                },
                {
                    code: "import c from 'process'; c.argv0",
                    options: [{ version: "6.4.0" }],
                },
                {
                    code: "process.channel",
                    options: [{ version: "7.1.0" }],
                },
                {
                    code: "process.cpuUsage",
                    options: [{ version: "6.1.0" }],
                },
                {
                    code: "process.emitWarning",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "process.getegid",
                    options: [{ version: "2.0.0" }],
                },
                {
                    code: "process.geteuid",
                    options: [{ version: "2.0.0" }],
                },
                {
                    code: "process.hasUncaughtExceptionCaptureCallback",
                    options: [{ version: "9.3.0" }],
                },
                {
                    code: "process.ppid",
                    options: [{ version: "9.2.0" }],
                },
                {
                    code: "process.release",
                    options: [{ version: "3.0.0" }],
                },
                {
                    code: "process.setegid",
                    options: [{ version: "2.0.0" }],
                },
                {
                    code: "process.seteuid",
                    options: [{ version: "2.0.0" }],
                },
                {
                    code: "process.setUncaughtExceptionCaptureCallback",
                    options: [{ version: "9.3.0" }],
                },

                // Ignores
                {
                    code: "process.argv0",
                    options: [{ version: "6.3.9", ignores: ["process.argv0"] }],
                },
                {
                    code: "require('process').argv0",
                    options: [{ version: "6.3.9", ignores: ["process.argv0"] }],
                },
                {
                    code: "var c = require('process'); c.argv0",
                    options: [{ version: "6.3.9", ignores: ["process.argv0"] }],
                },
                {
                    code: "var { argv0 } = require('process'); argv0",
                    options: [{ version: "6.3.9", ignores: ["process.argv0"] }],
                },
                {
                    code: "import c from 'process'; c.argv0",
                    options: [{ version: "6.3.9", ignores: ["process.argv0"] }],
                },
                {
                    code: "process.channel",
                    options: [
                        { version: "7.0.9", ignores: ["process.channel"] },
                    ],
                },
                {
                    code: "process.cpuUsage",
                    options: [
                        { version: "6.0.9", ignores: ["process.cpuUsage"] },
                    ],
                },
                {
                    code: "process.emitWarning",
                    options: [
                        { version: "5.9.9", ignores: ["process.emitWarning"] },
                    ],
                },
                {
                    code: "process.getegid",
                    options: [
                        { version: "1.9.9", ignores: ["process.getegid"] },
                    ],
                },
                {
                    code: "process.geteuid",
                    options: [
                        { version: "1.9.9", ignores: ["process.geteuid"] },
                    ],
                },
                {
                    code: "process.hasUncaughtExceptionCaptureCallback",
                    options: [
                        {
                            version: "9.2.9",
                            ignores: [
                                "process.hasUncaughtExceptionCaptureCallback",
                            ],
                        },
                    ],
                },
                {
                    code: "process.ppid",
                    options: [{ version: "9.1.9", ignores: ["process.ppid"] }],
                },
                {
                    code: "process.release",
                    options: [
                        { version: "2.9.9", ignores: ["process.release"] },
                    ],
                },
                {
                    code: "process.setegid",
                    options: [
                        { version: "1.9.9", ignores: ["process.setegid"] },
                    ],
                },
                {
                    code: "process.seteuid",
                    options: [
                        { version: "1.9.9", ignores: ["process.seteuid"] },
                    ],
                },
                {
                    code: "process.setUncaughtExceptionCaptureCallback",
                    options: [
                        {
                            version: "9.2.9",
                            ignores: [
                                "process.setUncaughtExceptionCaptureCallback",
                            ],
                        },
                    ],
                },
            ],
            invalid: [
                {
                    code: "process.argv0",
                    options: [{ version: "6.3.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.argv0",
                                supported: "6.4.0",
                                version: "6.3.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('process').argv0",
                    options: [{ version: "6.3.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.argv0",
                                supported: "6.4.0",
                                version: "6.3.9",
                            },
                        },
                    ],
                },
                {
                    code: "var c = require('process'); c.argv0",
                    options: [{ version: "6.3.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.argv0",
                                supported: "6.4.0",
                                version: "6.3.9",
                            },
                        },
                    ],
                },
                {
                    code: "var { argv0 } = require('process'); argv0",
                    options: [{ version: "6.3.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.argv0",
                                supported: "6.4.0",
                                version: "6.3.9",
                            },
                        },
                    ],
                },
                {
                    code: "import c from 'process'; c.argv0",
                    options: [{ version: "6.3.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.argv0",
                                supported: "6.4.0",
                                version: "6.3.9",
                            },
                        },
                    ],
                },
                {
                    code: "process.channel",
                    options: [{ version: "7.0.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.channel",
                                supported: "7.1.0",
                                version: "7.0.9",
                            },
                        },
                    ],
                },
                {
                    code: "process.cpuUsage",
                    options: [{ version: "6.0.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.cpuUsage",
                                supported: "6.1.0",
                                version: "6.0.9",
                            },
                        },
                    ],
                },
                {
                    code: "process.emitWarning",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.emitWarning",
                                supported: "6.0.0",
                                version: "5.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "process.getegid",
                    options: [{ version: "1.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.getegid",
                                supported: "2.0.0",
                                version: "1.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "process.geteuid",
                    options: [{ version: "1.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.geteuid",
                                supported: "2.0.0",
                                version: "1.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "process.hasUncaughtExceptionCaptureCallback",
                    options: [{ version: "9.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name:
                                    "process.hasUncaughtExceptionCaptureCallback",
                                supported: "9.3.0",
                                version: "9.2.9",
                            },
                        },
                    ],
                },
                {
                    code: "process.ppid",
                    options: [{ version: "9.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.ppid",
                                supported:
                                    "9.2.0 (backported: ^6.13.0, ^8.10.0)",
                                version: "9.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "process.release",
                    options: [{ version: "2.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.release",
                                supported: "3.0.0",
                                version: "2.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "process.setegid",
                    options: [{ version: "1.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.setegid",
                                supported: "2.0.0",
                                version: "1.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "process.seteuid",
                    options: [{ version: "1.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "process.seteuid",
                                supported: "2.0.0",
                                version: "1.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "process.setUncaughtExceptionCaptureCallback",
                    options: [{ version: "9.2.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name:
                                    "process.setUncaughtExceptionCaptureCallback",
                                supported: "9.3.0",
                                version: "9.2.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // stream
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('stream').finished()",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "var hooks = require('stream'); hooks.finished()",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "var { finished } = require('stream'); finished()",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "import stream from 'stream'; stream.finished()",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "import { finished } from 'stream'; finished()",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "require('stream').pipeline()",
                    options: [{ version: "10.0.0" }],
                },

                // Ignores
                {
                    code: "require('stream').finished()",
                    options: [
                        { version: "9.9.9", ignores: ["stream.finished"] },
                    ],
                },
                {
                    code: "var hooks = require('stream'); hooks.finished()",
                    options: [
                        { version: "9.9.9", ignores: ["stream.finished"] },
                    ],
                },
                {
                    code: "var { finished } = require('stream'); finished()",
                    options: [
                        { version: "9.9.9", ignores: ["stream.finished"] },
                    ],
                },
                {
                    code: "import stream from 'stream'; stream.finished()",
                    options: [
                        { version: "9.9.9", ignores: ["stream.finished"] },
                    ],
                },
                {
                    code: "import { finished } from 'stream'; finished()",
                    options: [
                        { version: "9.9.9", ignores: ["stream.finished"] },
                    ],
                },
                {
                    code: "require('stream').pipeline()",
                    options: [
                        { version: "9.9.9", ignores: ["stream.pipeline"] },
                    ],
                },
            ],
            invalid: [
                {
                    code: "require('stream').finished()",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "stream.finished",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "var hooks = require('stream'); hooks.finished()",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "stream.finished",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "var { finished } = require('stream'); finished()",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "stream.finished",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "import stream from 'stream'; stream.finished()",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "stream.finished",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { finished } from 'stream'; finished()",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "stream.finished",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('stream').pipeline()",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "stream.pipeline",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // trace_events
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('trace_events')",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "import trace_events from 'trace_events'",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "require('trace_events')",
                    options: [{ version: "9.9.9", ignores: ["trace_events"] }],
                },
                {
                    code: "import trace_events from 'trace_events'",
                    options: [{ version: "9.9.9", ignores: ["trace_events"] }],
                },
            ],
            invalid: [
                {
                    code: "require('trace_events')",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "trace_events",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "import trace_events from 'trace_events'",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "trace_events",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { createTracing } from 'trace_events'",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "trace_events",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // url
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "URL",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "URLSearchParams",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "require('url').URL",
                    options: [{ version: "7.0.0" }],
                },
                {
                    code: "require('url').URL",
                    options: [{ version: "6.13.0" }],
                },
                {
                    code: "var cp = require('url'); cp.URL",
                    options: [{ version: "7.0.0" }],
                },
                {
                    code: "var { URL } = require('url');",
                    options: [{ version: "7.0.0" }],
                },
                {
                    code: "import cp from 'url'; cp.URL",
                    options: [{ version: "7.0.0" }],
                },
                {
                    code: "import { URL } from 'url'",
                    options: [{ version: "7.0.0" }],
                },
                {
                    code: "require('url').URLSearchParams",
                    options: [{ version: "7.5.0" }],
                },
                {
                    code: "require('url').URLSearchParams",
                    options: [{ version: "6.13.0" }],
                },
                {
                    code: "require('url').domainToASCII",
                    options: [{ version: "7.4.0" }],
                },
                {
                    code: "require('url').domainToUnicode",
                    options: [{ version: "7.4.0" }],
                },

                // Ignores
                {
                    code: "URL",
                    options: [{ version: "9.9.9", ignores: ["URL"] }],
                },
                {
                    code: "URLSearchParams",
                    options: [
                        { version: "9.9.9", ignores: ["URLSearchParams"] },
                    ],
                },
                {
                    code: "require('url').URL",
                    options: [{ version: "6.9.9", ignores: ["url.URL"] }],
                },
                {
                    code: "var cp = require('url'); cp.URL",
                    options: [{ version: "6.9.9", ignores: ["url.URL"] }],
                },
                {
                    code: "var { URL } = require('url');",
                    options: [{ version: "6.9.9", ignores: ["url.URL"] }],
                },
                {
                    code: "import cp from 'url'; cp.URL",
                    options: [{ version: "6.9.9", ignores: ["url.URL"] }],
                },
                {
                    code: "import { URL } from 'url'",
                    options: [{ version: "6.9.9", ignores: ["url.URL"] }],
                },
                {
                    code: "require('url').URLSearchParams",
                    options: [
                        { version: "7.4.9", ignores: ["url.URLSearchParams"] },
                    ],
                },
                {
                    code: "require('url').domainToASCII",
                    options: [
                        { version: "7.3.9", ignores: ["url.domainToASCII"] },
                    ],
                },
                {
                    code: "require('url').domainToUnicode",
                    options: [
                        { version: "7.3.9", ignores: ["url.domainToUnicode"] },
                    ],
                },
            ],
            invalid: [
                {
                    code: "URL",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "URL",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "URLSearchParams",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "URLSearchParams",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('url').URL",
                    options: [{ version: "6.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "url.URL",
                                supported: "7.0.0 (backported: ^6.13.0)",
                                version: "6.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "var cp = require('url'); cp.URL",
                    options: [{ version: "6.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "url.URL",
                                supported: "7.0.0 (backported: ^6.13.0)",
                                version: "6.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "var { URL } = require('url');",
                    options: [{ version: "6.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "url.URL",
                                supported: "7.0.0 (backported: ^6.13.0)",
                                version: "6.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "import cp from 'url'; cp.URL",
                    options: [{ version: "6.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "url.URL",
                                supported: "7.0.0 (backported: ^6.13.0)",
                                version: "6.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { URL } from 'url'",
                    options: [{ version: "6.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "url.URL",
                                supported: "7.0.0 (backported: ^6.13.0)",
                                version: "6.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('url').URLSearchParams",
                    options: [{ version: "7.4.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "url.URLSearchParams",
                                supported: "7.5.0 (backported: ^6.13.0)",
                                version: "7.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('url').domainToASCII",
                    options: [{ version: "7.3.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "url.domainToASCII",
                                supported: "7.4.0",
                                version: "7.3.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('url').domainToUnicode",
                    options: [{ version: "7.3.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "url.domainToUnicode",
                                supported: "7.4.0",
                                version: "7.3.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // util
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('util').callbackify",
                    options: [{ version: "8.2.0" }],
                },
                {
                    code: "var hooks = require('util'); hooks.callbackify",
                    options: [{ version: "8.2.0" }],
                },
                {
                    code: "var { callbackify } = require('util'); callbackify",
                    options: [{ version: "8.2.0" }],
                },
                {
                    code: "import util from 'util'; util.callbackify",
                    options: [{ version: "8.2.0" }],
                },
                {
                    code: "import { callbackify } from 'util'; callbackify",
                    options: [{ version: "8.2.0" }],
                },
                {
                    code: "require('util').formatWithOptions",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "require('util').getSystemErrorName",
                    options: [{ version: "9.7.0" }],
                },
                {
                    code: "require('util').inspect.custom",
                    options: [{ version: "6.6.0" }],
                },
                {
                    code: "require('util').inspect.defaultOptions",
                    options: [{ version: "6.4.0" }],
                },
                {
                    code: "require('util').isDeepStrictEqual",
                    options: [{ version: "9.0.0" }],
                },
                {
                    code: "require('util').promisify",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "require('util').TextDecoder",
                    options: [{ version: "8.9.0" }],
                },
                {
                    code: "require('util').TextEncoder",
                    options: [{ version: "8.9.0" }],
                },
                {
                    code: "require('util').types",
                    options: [{ version: "10.0.0" }],
                },

                // Ignores
                {
                    code: "require('util').callbackify",
                    options: [
                        { version: "8.1.9", ignores: ["util.callbackify"] },
                    ],
                },
                {
                    code: "var hooks = require('util'); hooks.callbackify",
                    options: [
                        { version: "8.1.9", ignores: ["util.callbackify"] },
                    ],
                },
                {
                    code: "var { callbackify } = require('util'); callbackify",
                    options: [
                        { version: "8.1.9", ignores: ["util.callbackify"] },
                    ],
                },
                {
                    code: "import util from 'util'; util.callbackify",
                    options: [
                        { version: "8.1.9", ignores: ["util.callbackify"] },
                    ],
                },
                {
                    code: "import { callbackify } from 'util'; callbackify",
                    options: [
                        { version: "8.1.9", ignores: ["util.callbackify"] },
                    ],
                },
                {
                    code: "require('util').formatWithOptions",
                    options: [
                        {
                            version: "9.9.9",
                            ignores: ["util.formatWithOptions"],
                        },
                    ],
                },
                {
                    code: "require('util').getSystemErrorName",
                    options: [
                        {
                            version: "9.6.9",
                            ignores: ["util.getSystemErrorName"],
                        },
                    ],
                },
                {
                    code: "require('util').inspect.custom",
                    options: [
                        { version: "6.5.9", ignores: ["util.inspect.custom"] },
                    ],
                },
                {
                    code: "require('util').inspect.defaultOptions",
                    options: [
                        {
                            version: "6.3.9",
                            ignores: ["util.inspect.defaultOptions"],
                        },
                    ],
                },
                {
                    code: "require('util').isDeepStrictEqual",
                    options: [
                        {
                            version: "8.9.9",
                            ignores: ["util.isDeepStrictEqual"],
                        },
                    ],
                },
                {
                    code: "require('util').promisify",
                    options: [
                        { version: "7.9.9", ignores: ["util.promisify"] },
                    ],
                },
                {
                    code: "require('util').TextDecoder",
                    options: [
                        { version: "8.2.9", ignores: ["util.TextDecoder"] },
                    ],
                },
                {
                    code: "require('util').TextEncoder",
                    options: [
                        { version: "8.2.9", ignores: ["util.TextEncoder"] },
                    ],
                },
                {
                    code: "require('util').types",
                    options: [{ version: "9.9.9", ignores: ["util.types"] }],
                },
            ],
            invalid: [
                {
                    code: "require('util').callbackify",
                    options: [{ version: "8.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.callbackify",
                                supported: "8.2.0",
                                version: "8.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "var hooks = require('util'); hooks.callbackify",
                    options: [{ version: "8.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.callbackify",
                                supported: "8.2.0",
                                version: "8.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "var { callbackify } = require('util'); callbackify",
                    options: [{ version: "8.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.callbackify",
                                supported: "8.2.0",
                                version: "8.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "import util from 'util'; util.callbackify",
                    options: [{ version: "8.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.callbackify",
                                supported: "8.2.0",
                                version: "8.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { callbackify } from 'util'; callbackify",
                    options: [{ version: "8.1.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.callbackify",
                                supported: "8.2.0",
                                version: "8.1.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('util').formatWithOptions",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.formatWithOptions",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('util').getSystemErrorName",
                    options: [{ version: "9.6.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.getSystemErrorName",
                                supported: "9.7.0 (backported: ^8.12.0)",
                                version: "9.6.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('util').inspect.custom",
                    options: [{ version: "6.5.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.inspect.custom",
                                supported: "6.6.0",
                                version: "6.5.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('util').inspect.defaultOptions",
                    options: [{ version: "6.3.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.inspect.defaultOptions",
                                supported: "6.4.0",
                                version: "6.3.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('util').isDeepStrictEqual",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.isDeepStrictEqual",
                                supported: "9.0.0",
                                version: "8.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('util').promisify",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.promisify",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('util').TextDecoder",
                    options: [{ version: "8.8.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.TextDecoder",
                                supported: "8.9.0",
                                version: "8.8.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('util').TextEncoder",
                    options: [{ version: "8.8.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.TextEncoder",
                                supported: "8.9.0",
                                version: "8.8.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('util').types",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "util.types",
                                supported: "10.0.0",
                                version: "9.9.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // v8
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('v8')",
                    options: [{ version: "1.0.0" }],
                },
                {
                    code: "import hooks from 'v8'",
                    options: [{ version: "1.0.0" }],
                },
                {
                    code: "require('v8').cachedDataVersionTag()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code:
                        "var hooks = require('v8'); hooks.cachedDataVersionTag()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code:
                        "var { cachedDataVersionTag } = require('v8'); cachedDataVersionTag()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "import v8 from 'v8'; v8.cachedDataVersionTag()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code:
                        "import { cachedDataVersionTag } from 'v8'; cachedDataVersionTag()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "require('v8').getHeapSpaceStatistics()",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "require('v8').serialize()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "require('v8').deserialize()",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "require('v8').Serializer",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "require('v8').Deserializer",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "require('v8').DefaultSerializer",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "require('v8').DefaultDeserializer",
                    options: [{ version: "8.0.0" }],
                },

                // Ignores.
                {
                    code: "require('v8')",
                    options: [{ version: "0.12.99", ignores: ["v8"] }],
                },
                {
                    code: "import hooks from 'v8'",
                    options: [{ version: "0.12.99", ignores: ["v8"] }],
                },
                {
                    code: "import { cachedDataVersionTag } from 'v8'",
                    options: [
                        {
                            version: "0.12.99",
                            ignores: ["v8", "v8.cachedDataVersionTag"],
                        },
                    ],
                },
                {
                    code: "require('v8').cachedDataVersionTag()",
                    options: [
                        {
                            version: "7.9.9",
                            ignores: ["v8.cachedDataVersionTag"],
                        },
                    ],
                },
                {
                    code:
                        "var hooks = require('v8'); hooks.cachedDataVersionTag()",
                    options: [
                        {
                            version: "7.9.9",
                            ignores: ["v8.cachedDataVersionTag"],
                        },
                    ],
                },
                {
                    code:
                        "var { cachedDataVersionTag } = require('v8'); cachedDataVersionTag()",
                    options: [
                        {
                            version: "7.9.9",
                            ignores: ["v8.cachedDataVersionTag"],
                        },
                    ],
                },
                {
                    code: "import v8 from 'v8'; v8.cachedDataVersionTag()",
                    options: [
                        {
                            version: "7.9.9",
                            ignores: ["v8.cachedDataVersionTag"],
                        },
                    ],
                },
                {
                    code:
                        "import { cachedDataVersionTag } from 'v8'; cachedDataVersionTag()",
                    options: [
                        {
                            version: "7.9.9",
                            ignores: ["v8.cachedDataVersionTag"],
                        },
                    ],
                },
                {
                    code: "require('v8').getHeapSpaceStatistics()",
                    options: [
                        {
                            version: "5.9.9",
                            ignores: ["v8.getHeapSpaceStatistics"],
                        },
                    ],
                },
                {
                    code: "require('v8').serialize()",
                    options: [{ version: "7.9.9", ignores: ["v8.serialize"] }],
                },
                {
                    code: "require('v8').deserialize()",
                    options: [
                        { version: "7.9.9", ignores: ["v8.deserialize"] },
                    ],
                },
                {
                    code: "require('v8').Serializer",
                    options: [{ version: "7.9.9", ignores: ["v8.Serializer"] }],
                },
                {
                    code: "require('v8').Deserializer",
                    options: [
                        { version: "7.9.9", ignores: ["v8.Deserializer"] },
                    ],
                },
                {
                    code: "require('v8').DefaultSerializer",
                    options: [
                        { version: "7.9.9", ignores: ["v8.DefaultSerializer"] },
                    ],
                },
                {
                    code: "require('v8').DefaultDeserializer",
                    options: [
                        {
                            version: "7.9.9",
                            ignores: ["v8.DefaultDeserializer"],
                        },
                    ],
                },
            ],
            invalid: [
                {
                    code: "require('v8')",
                    options: [{ version: "0.12.99" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8",
                                supported: "1.0.0",
                                version: "0.12.99",
                            },
                        },
                    ],
                },
                {
                    code: "import hooks from 'v8'",
                    options: [{ version: "0.12.99" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8",
                                supported: "1.0.0",
                                version: "0.12.99",
                            },
                        },
                    ],
                },
                {
                    code: "import { cachedDataVersionTag } from 'v8'",
                    options: [{ version: "0.12.99" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8",
                                supported: "1.0.0",
                                version: "0.12.99",
                            },
                        },
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8.cachedDataVersionTag",
                                supported: "8.0.0",
                                version: "0.12.99",
                            },
                        },
                    ],
                },
                {
                    code: "require('v8').cachedDataVersionTag()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8.cachedDataVersionTag",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "var hooks = require('v8'); hooks.cachedDataVersionTag()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8.cachedDataVersionTag",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "var { cachedDataVersionTag } = require('v8'); cachedDataVersionTag()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8.cachedDataVersionTag",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "import v8 from 'v8'; v8.cachedDataVersionTag()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8.cachedDataVersionTag",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code:
                        "import { cachedDataVersionTag } from 'v8'; cachedDataVersionTag()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8.cachedDataVersionTag",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('v8').getHeapSpaceStatistics()",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8.getHeapSpaceStatistics",
                                supported: "6.0.0",
                                version: "5.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('v8').serialize()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8.serialize",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('v8').deserialize()",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8.deserialize",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('v8').Serializer",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8.Serializer",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('v8').Deserializer",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8.Deserializer",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('v8').DefaultSerializer",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8.DefaultSerializer",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "require('v8').DefaultDeserializer",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "v8.DefaultDeserializer",
                                supported: "8.0.0",
                                version: "7.9.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // vm
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('vm').Module",
                    options: [{ version: "9.6.0" }],
                },
                {
                    code: "var vm = require('vm'); vm.Module",
                    options: [{ version: "9.6.0" }],
                },
                {
                    code: "var { Module } = require('vm'); Module",
                    options: [{ version: "9.6.0" }],
                },
                {
                    code: "import vm from 'vm'; vm.Module",
                    options: [{ version: "9.6.0" }],
                },
                {
                    code: "import { Module } from 'vm'; Module",
                    options: [{ version: "9.6.0" }],
                },

                // Ignores
                {
                    code: "require('vm').Module",
                    options: [{ version: "9.5.9", ignores: ["vm.Module"] }],
                },
                {
                    code: "var vm = require('vm'); vm.Module",
                    options: [{ version: "9.5.9", ignores: ["vm.Module"] }],
                },
                {
                    code: "var { Module } = require('vm'); Module",
                    options: [{ version: "9.5.9", ignores: ["vm.Module"] }],
                },
                {
                    code: "import vm from 'vm'; vm.Module",
                    options: [{ version: "9.5.9", ignores: ["vm.Module"] }],
                },
                {
                    code: "import { Module } from 'vm'; Module",
                    options: [{ version: "9.5.9", ignores: ["vm.Module"] }],
                },
            ],
            invalid: [
                {
                    code: "require('vm').Module",
                    options: [{ version: "9.5.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "vm.Module",
                                supported: "9.6.0",
                                version: "9.5.9",
                            },
                        },
                    ],
                },
                {
                    code: "var vm = require('vm'); vm.Module",
                    options: [{ version: "9.5.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "vm.Module",
                                supported: "9.6.0",
                                version: "9.5.9",
                            },
                        },
                    ],
                },
                {
                    code: "var { Module } = require('vm'); Module",
                    options: [{ version: "9.5.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "vm.Module",
                                supported: "9.6.0",
                                version: "9.5.9",
                            },
                        },
                    ],
                },
                {
                    code: "import vm from 'vm'; vm.Module",
                    options: [{ version: "9.5.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "vm.Module",
                                supported: "9.6.0",
                                version: "9.5.9",
                            },
                        },
                    ],
                },
                {
                    code: "import { Module } from 'vm'; Module",
                    options: [{ version: "9.5.9" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "vm.Module",
                                supported: "9.6.0",
                                version: "9.5.9",
                            },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // worker_threads
        //----------------------------------------------------------------------
        {
            valid: [
                {
                    code: "require('worker_threads')",
                    options: [
                        { version: "10.4.99", ignores: ["worker_threads"] },
                    ],
                },
                {
                    code: "import worker_threads from 'worker_threads'",
                    options: [
                        { version: "10.4.99", ignores: ["worker_threads"] },
                    ],
                },
                {
                    code: "require('worker_threads')",
                    options: [{ version: "12.11.0" }],
                },
                {
                    code: "import worker_threads from 'worker_threads'",
                    options: [{ version: "12.11.0" }],
                },
            ],
            invalid: [
                {
                    code: "require('worker_threads')",
                    options: [{ version: "10.5.0" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "worker_threads",
                                supported: "12.11.0",
                                version: "10.5.0",
                            },
                        },
                    ],
                },
                {
                    code: "import worker_threads from 'worker_threads'",
                    options: [{ version: "10.5.0" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "worker_threads",
                                supported: "12.11.0",
                                version: "10.5.0",
                            },
                        },
                    ],
                },
                {
                    code: "import { Worker } from 'worker_threads'",
                    options: [{ version: "10.5.0" }],
                    errors: [
                        {
                            messageId: "unsupported",
                            data: {
                                name: "worker_threads",
                                supported: "12.11.0",
                                version: "10.5.0",
                            },
                        },
                    ],
                },
            ],
        },
    ])
)
