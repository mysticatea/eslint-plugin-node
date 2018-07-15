/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/async_hooks")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/async_hooks", rule, {
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
            code: "var hooks = require('async_hooks'); hooks.createHook()",
            options: [{ version: "8.1.0" }],
        },
        {
            code: "var { createHook } = require('async_hooks'); createHook()",
            options: [{ version: "8.1.0" }],
        },
        {
            code: "import hooks from 'async_hooks'; hooks.createHook()",
            options: [{ version: "8.1.0" }],
        },
        {
            code: "import { createHook } from 'async_hooks'; createHook()",
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
                    ignores: ["async_hooks"],
                },
            ],
        },
        {
            code: "require('async_hooks').createHook()",
            options: [
                { version: "8.0.9", ignores: ["async_hooks.createHook"] },
            ],
        },
        {
            code: "var hooks = require('async_hooks'); hooks.createHook()",
            options: [
                { version: "8.0.9", ignores: ["async_hooks.createHook"] },
            ],
        },
        {
            code: "var { createHook } = require('async_hooks'); createHook()",
            options: [
                { version: "8.0.9", ignores: ["async_hooks.createHook"] },
            ],
        },
        {
            code:
                "import async_hooks from 'async_hooks'; async_hooks.createHook()",
            options: [
                { version: "8.0.9", ignores: ["async_hooks.createHook"] },
            ],
        },
        {
            code: "import { createHook } from 'async_hooks'; createHook()",
            options: [
                { version: "8.0.9", ignores: ["async_hooks.createHook"] },
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
            code: "var hooks = require('async_hooks'); hooks.createHook()",
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
            code: "var { createHook } = require('async_hooks'); createHook()",
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
            code: "import { createHook } from 'async_hooks'; createHook()",
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
})
