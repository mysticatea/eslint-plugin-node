/**
 * @author Teddy Katz
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-buffer-constructor")

const CALL_ERROR = {
    messageId: "deprecated",
    data: {
        expr: "Buffer()",
    },
    type: "CallExpression",
}
const CONSTRUCT_ERROR = {
    messageId: "deprecated",
    data: {
        expr: "new Buffer()",
    },
    type: "NewExpression",
}

new RuleTester().run("no-buffer-constructor", rule, {
    valid: [
        "Buffer.alloc(5)",
        "Buffer.allocUnsafe(5)",
        "new Buffer.Foo()",
        "Buffer.from([1, 2, 3])",
        "foo(Buffer)",
        "Buffer.alloc(res.body.amount)",
        "Buffer.from(res.body.values)",
    ],

    invalid: [
        {
            code: "Buffer(5)",
            errors: [CALL_ERROR],
        },
        {
            code: "new Buffer(5)",
            errors: [CONSTRUCT_ERROR],
        },
        {
            code: "Buffer([1, 2, 3])",
            errors: [CALL_ERROR],
        },
        {
            code: "new Buffer([1, 2, 3])",
            errors: [CONSTRUCT_ERROR],
        },
        {
            code: "new Buffer(res.body.amount)",
            errors: [CONSTRUCT_ERROR],
        },
        {
            code: "new Buffer(res.body.values)",
            errors: [CONSTRUCT_ERROR],
        },
    ],
})
