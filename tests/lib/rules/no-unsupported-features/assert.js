/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/assert")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/assert", rule, {
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
            code: "var assert = require('assert'); assert.deepStrictEqual()",
            options: [{ version: "4.0.0" }],
        },
        {
            code:
                "var { deepStrictEqual } = require('assert'); deepStrictEqual()",
            options: [{ version: "4.0.0" }],
        },
        {
            code: "import assert from 'assert'; assert.deepStrictEqual()",
            options: [{ version: "4.0.0" }],
        },
        {
            code: "import { deepStrictEqual } from 'assert'; deepStrictEqual()",
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
            code: "var {strict: assert} = require('assert'); assert.rejects()",
            options: [{ version: "10.0.0" }],
        },
        {
            code: "require('assert').deepStrictEqual()",
            options: [
                { version: "3.9.9", ignores: ["assert.deepStrictEqual"] },
            ],
        },
        {
            code: "var assert = require('assert'); assert.deepStrictEqual()",
            options: [
                { version: "3.9.9", ignores: ["assert.deepStrictEqual"] },
            ],
        },
        {
            code:
                "var { deepStrictEqual } = require('assert'); deepStrictEqual()",
            options: [
                { version: "3.9.9", ignores: ["assert.deepStrictEqual"] },
            ],
        },
        {
            code: "import assert from 'assert'; assert.deepStrictEqual()",
            options: [
                { version: "3.9.9", ignores: ["assert.deepStrictEqual"] },
            ],
        },
        {
            code: "import { deepStrictEqual } from 'assert'; deepStrictEqual()",
            options: [
                { version: "3.9.9", ignores: ["assert.deepStrictEqual"] },
            ],
        },
        {
            code: "require('assert').notDeepStrictEqual()",
            options: [
                { version: "3.9.9", ignores: ["assert.notDeepStrictEqual"] },
            ],
        },
        {
            code: "require('assert').rejects()",
            options: [{ version: "9.9.9", ignores: ["assert.rejects"] }],
        },
        {
            code: "require('assert').doesNotReject()",
            options: [{ version: "9.9.9", ignores: ["assert.doesNotReject"] }],
        },
        {
            code: "require('assert').strict.rejects()",
            options: [{ version: "9.9.9", ignores: ["assert.strict.rejects"] }],
        },
        {
            code: "require('assert').strict.doesNotReject()",
            options: [
                { version: "9.9.9", ignores: ["assert.strict.doesNotReject"] },
            ],
        },
        {
            code: "var assert = require('assert').strict",
            options: [{ version: "9.8.9", ignores: ["assert.strict"] }],
        },
        {
            code: "var {strict: assert} = require('assert'); assert.rejects()",
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
            code: "var assert = require('assert'); assert.deepStrictEqual()",
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
            code: "import assert from 'assert'; assert.deepStrictEqual()",
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
            code: "import { deepStrictEqual } from 'assert'; deepStrictEqual()",
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
                        supported: "9.9.0",
                        version: "9.8.9",
                    },
                },
            ],
        },
        {
            code: "var {strict: assert} = require('assert'); assert.rejects()",
            options: [{ version: "9.8.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "assert.strict",
                        supported: "9.9.0",
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
})
