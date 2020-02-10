/**
 * @author Wil Moore III
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-new-require")

new RuleTester().run("no-new-require", rule, {
    valid: [
        "var appHeader = require('app-header')",
        "var AppHeader = new (require('app-header'))",
        "var AppHeader = new (require('headers').appHeader)",
    ],
    invalid: [
        {
            code: "var appHeader = new require('app-header')",
            errors: [
                {
                    messageId: "noNewRequire",
                    type: "NewExpression",
                },
            ],
        },
        {
            code: "var appHeader = new require('headers').appHeader",
            errors: [
                {
                    messageId: "noNewRequire",
                    type: "NewExpression",
                },
            ],
        },
    ],
})
