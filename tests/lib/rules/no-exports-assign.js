/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { RuleTester } = require("eslint")
const rule = require("../../../lib/rules/no-exports-assign.js")

new RuleTester({
    globals: {
        exports: "writable",
        module: "readonly",
    },
}).run("no-exports-assign", rule, {
    valid: [
        "module.exports.foo = 1",
        "exports.bar = 1",
        "module.exports = exports = {}",
        "exports = module.exports = {}",
        "function f(exports) { exports = {} }",
    ],
    invalid: [
        {
            code: "exports = {}",
            errors: [
                "Unexpected assignment to 'exports' variable. Use 'module.exports' instead.",
            ],
        },
    ],
})
