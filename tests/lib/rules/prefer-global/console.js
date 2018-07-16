/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/prefer-global/console")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
    },
    globals: {
        console: false,
        require: false,
    },
}).run("prefer-global/console", rule, {
    valid: [
        "console.log(10)",
        {
            code: "console.log(10)",
            options: ["always"],
        },
        {
            code: "var console = require('console'); console.log(10)",
            options: ["never"],
        },
    ],
    invalid: [
        {
            code: "var console = require('console'); console.log(10)",
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var console = require('console'); console.log(10)",
            options: ["always"],
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "console.log(10)",
            options: ["never"],
            errors: [{ messageId: "preferModule" }],
        },
    ],
})
