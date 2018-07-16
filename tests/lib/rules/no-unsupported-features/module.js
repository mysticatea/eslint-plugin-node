/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/module")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/module", rule, {
    valid: [
        {
            code: "require.resolve.paths()",
            options: [{ version: "8.9.0" }],
        },
        {
            code: "require('module').builtinModules",
            options: [{ version: "9.3.0" }],
        },
        {
            code: "require.resolve.paths()",
            options: [{ version: "8.8.9", ignores: ["require.resolve.paths"] }],
        },
        {
            code: "require('module').builtinModules",
            options: [{ version: "9.2.9", ignores: ["module.builtinModules"] }],
        },
    ],
    invalid: [
        {
            code: "require.resolve.paths()",
            options: [{ version: "8.8.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "require.resolve.paths",
                        supported: "8.9.0",
                        version: "8.8.9",
                    },
                },
            ],
        },
        {
            code: "require('module').builtinModules",
            options: [{ version: "9.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "module.builtinModules",
                        supported: "9.3.0",
                        version: "9.2.9",
                    },
                },
            ],
        },
    ],
})
