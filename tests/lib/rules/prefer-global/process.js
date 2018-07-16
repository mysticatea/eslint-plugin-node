/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/prefer-global/process")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
    },
    globals: {
        process: false,
        require: false,
    },
}).run("prefer-global/process", rule, {
    valid: [
        "process.exit(0)",
        {
            code: "process.exit(0)",
            options: ["always"],
        },
        {
            code: "var process = require('process'); process.exit(0)",
            options: ["never"],
        },
    ],
    invalid: [
        {
            code: "var process = require('process'); process.exit(0)",
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var process = require('process'); process.exit(0)",
            options: ["always"],
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "process.exit(0)",
            options: ["never"],
            errors: [{ messageId: "preferModule" }],
        },
    ],
})
