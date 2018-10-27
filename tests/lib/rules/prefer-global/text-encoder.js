/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/prefer-global/text-encoder")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
    },
    globals: {
        TextEncoder: false,
        require: false,
    },
}).run("prefer-global/text-encoder", rule, {
    valid: [
        "var b = new TextEncoder(s)",
        {
            code: "var b = new TextEncoder(s)",
            options: ["always"],
        },
        {
            code:
                "var { TextEncoder } = require('util'); var b = new TextEncoder(s)",
            options: ["never"],
        },
    ],
    invalid: [
        {
            code:
                "var { TextEncoder } = require('util'); var b = new TextEncoder(s)",
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code:
                "var { TextEncoder } = require('util'); var b = new TextEncoder(s)",
            options: ["always"],
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var b = new TextEncoder(s)",
            options: ["never"],
            errors: [{ messageId: "preferModule" }],
        },
    ],
})
