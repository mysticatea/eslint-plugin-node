/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/trace_events")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/trace_events", rule, {
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
})
