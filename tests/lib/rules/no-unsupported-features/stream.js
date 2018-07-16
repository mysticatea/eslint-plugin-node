/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/stream")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/stream", rule, {
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
            options: [{ version: "9.9.9", ignores: ["stream.finished"] }],
        },
        {
            code: "var hooks = require('stream'); hooks.finished()",
            options: [{ version: "9.9.9", ignores: ["stream.finished"] }],
        },
        {
            code: "var { finished } = require('stream'); finished()",
            options: [{ version: "9.9.9", ignores: ["stream.finished"] }],
        },
        {
            code: "import stream from 'stream'; stream.finished()",
            options: [{ version: "9.9.9", ignores: ["stream.finished"] }],
        },
        {
            code: "import { finished } from 'stream'; finished()",
            options: [{ version: "9.9.9", ignores: ["stream.finished"] }],
        },
        {
            code: "require('stream').pipeline()",
            options: [{ version: "9.9.9", ignores: ["stream.pipeline"] }],
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
})
