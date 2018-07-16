/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/worker_threads")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/worker_threads", rule, {
    valid: [
        {
            code: "require('worker_threads')",
            options: [{ version: "10.5.0" }],
        },
        {
            code: "import worker_threads from 'worker_threads'",
            options: [{ version: "10.5.0" }],
        },
        {
            code: "require('worker_threads')",
            options: [{ version: "10.4.99", ignores: ["worker_threads"] }],
        },
        {
            code: "import worker_threads from 'worker_threads'",
            options: [{ version: "10.4.99", ignores: ["worker_threads"] }],
        },
    ],
    invalid: [
        {
            code: "require('worker_threads')",
            options: [{ version: "10.4.99" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "worker_threads",
                        supported: "10.5.0",
                        version: "10.4.99",
                    },
                },
            ],
        },
        {
            code: "import worker_threads from 'worker_threads'",
            options: [{ version: "10.4.99" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "worker_threads",
                        supported: "10.5.0",
                        version: "10.4.99",
                    },
                },
            ],
        },
        {
            code: "import { Worker } from 'worker_threads'",
            options: [{ version: "10.4.99" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "worker_threads",
                        supported: "10.5.0",
                        version: "10.4.99",
                    },
                },
            ],
        },
    ],
})
