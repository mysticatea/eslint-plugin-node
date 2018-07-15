/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/child_process")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/child_process", rule, {
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
                { version: "2.1.9", ignores: ["child_process.ChildProcess"] },
            ],
        },
        {
            code: "var cp = require('child_process'); cp.ChildProcess",
            options: [
                { version: "2.1.9", ignores: ["child_process.ChildProcess"] },
            ],
        },
        {
            code:
                "var { ChildProcess } = require('child_process'); ChildProcess",
            options: [
                { version: "2.1.9", ignores: ["child_process.ChildProcess"] },
            ],
        },
        {
            code: "import cp from 'child_process'; cp.ChildProcess",
            options: [
                { version: "2.1.9", ignores: ["child_process.ChildProcess"] },
            ],
        },
        {
            code: "import { ChildProcess } from 'child_process'",
            options: [
                { version: "2.1.9", ignores: ["child_process.ChildProcess"] },
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
})
