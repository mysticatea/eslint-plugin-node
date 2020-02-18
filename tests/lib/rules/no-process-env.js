/**
 * @author Vignesh Anand
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-process-env")

new RuleTester().run("no-process-env", rule, {
    valid: [
        "Process.env",
        "process[env]",
        "process.nextTick",
        "process.execArgv",
    ],

    invalid: [
        {
            code: "process.env",
            errors: [
                {
                    messageId: "unexpectedProcessEnv",
                    type: "MemberExpression",
                },
            ],
        },
        {
            code: "process.env.ENV",
            errors: [
                {
                    messageId: "unexpectedProcessEnv",
                    type: "MemberExpression",
                },
            ],
        },
        {
            code: "f(process.env)",
            errors: [
                {
                    messageId: "unexpectedProcessEnv",
                    type: "MemberExpression",
                },
            ],
        },
    ],
})
