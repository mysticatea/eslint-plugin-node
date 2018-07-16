/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/perf_hooks")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/perf_hooks", rule, {
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
})
