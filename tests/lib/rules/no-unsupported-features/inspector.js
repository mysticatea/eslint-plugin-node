/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/inspector")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/inspector", rule, {
    valid: [
        {
            code: "require('inspector')",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "import inspector from 'inspector'",
            options: [{ version: "8.0.0" }],
        },
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
                        supported: "8.0.0",
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
                        supported: "8.0.0",
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
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
    ],
})
