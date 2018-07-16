/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/http2")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/http2", rule, {
    valid: [
        {
            code: "require('http2')",
            options: [{ version: "8.4.0" }],
        },
        {
            code: "import http2 from 'http2'",
            options: [{ version: "8.4.0" }],
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
                        supported: "8.4.0",
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
                        supported: "8.4.0",
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
                        supported: "8.4.0",
                        version: "8.3.9",
                    },
                },
            ],
        },
    ],
})
