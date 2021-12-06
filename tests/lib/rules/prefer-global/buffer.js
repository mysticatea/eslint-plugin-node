/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { RuleTester } = require("eslint")
const rule = require("../../../../lib/rules/prefer-global/buffer.js")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
    },
    globals: {
        Buffer: false,
        require: false,
    },
}).run("prefer-global/buffer", rule, {
    valid: [
        "var b = Buffer.alloc(10)",
        {
            code: "var b = Buffer.alloc(10)",
            options: ["always"],
        },
        {
            code:
                "var { Buffer } = require('buffer'); var b = Buffer.alloc(10)",
            options: ["never"],
        },
    ],
    invalid: [
        {
            code:
                "var { Buffer } = require('buffer'); var b = Buffer.alloc(10)",
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code:
                "var { Buffer } = require('buffer'); var b = Buffer.alloc(10)",
            options: ["always"],
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var b = Buffer.alloc(10)",
            options: ["never"],
            errors: [{ messageId: "preferModule" }],
        },
    ],
})
