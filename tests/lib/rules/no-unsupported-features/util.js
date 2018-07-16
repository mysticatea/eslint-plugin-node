/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/util")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/util", rule, {
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
            options: [{ version: "8.3.0" }],
        },
        {
            code: "require('util').TextEncoder",
            options: [{ version: "8.3.0" }],
        },
        {
            code: "require('util').types",
            options: [{ version: "10.0.0" }],
        },

        // Ignores
        {
            code: "require('util').callbackify",
            options: [{ version: "8.1.9", ignores: ["util.callbackify"] }],
        },
        {
            code: "var hooks = require('util'); hooks.callbackify",
            options: [{ version: "8.1.9", ignores: ["util.callbackify"] }],
        },
        {
            code: "var { callbackify } = require('util'); callbackify",
            options: [{ version: "8.1.9", ignores: ["util.callbackify"] }],
        },
        {
            code: "import util from 'util'; util.callbackify",
            options: [{ version: "8.1.9", ignores: ["util.callbackify"] }],
        },
        {
            code: "import { callbackify } from 'util'; callbackify",
            options: [{ version: "8.1.9", ignores: ["util.callbackify"] }],
        },
        {
            code: "require('util').formatWithOptions",
            options: [
                { version: "9.9.9", ignores: ["util.formatWithOptions"] },
            ],
        },
        {
            code: "require('util').getSystemErrorName",
            options: [
                { version: "9.6.9", ignores: ["util.getSystemErrorName"] },
            ],
        },
        {
            code: "require('util').inspect.custom",
            options: [{ version: "6.5.9", ignores: ["util.inspect.custom"] }],
        },
        {
            code: "require('util').inspect.defaultOptions",
            options: [
                { version: "6.3.9", ignores: ["util.inspect.defaultOptions"] },
            ],
        },
        {
            code: "require('util').isDeepStrictEqual",
            options: [
                { version: "8.9.9", ignores: ["util.isDeepStrictEqual"] },
            ],
        },
        {
            code: "require('util').promisify",
            options: [{ version: "7.9.9", ignores: ["util.promisify"] }],
        },
        {
            code: "require('util').TextDecoder",
            options: [{ version: "8.2.9", ignores: ["util.TextDecoder"] }],
        },
        {
            code: "require('util').TextEncoder",
            options: [{ version: "8.2.9", ignores: ["util.TextEncoder"] }],
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
                        supported: "9.7.0",
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
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "util.TextDecoder",
                        supported: "8.3.0",
                        version: "8.2.9",
                    },
                },
            ],
        },
        {
            code: "require('util').TextEncoder",
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "util.TextEncoder",
                        supported: "8.3.0",
                        version: "8.2.9",
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
})
