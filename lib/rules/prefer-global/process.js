/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { READ } = require("eslint-utils")
const defineHandlers = require("../../util/define-prefer-global-handlers")

module.exports = {
    meta: {
        docs: {
            description: 'enforce either `process` or `require("process")`',
            category: "Stylistic Issues",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v7.0.0-beta.0/docs/rules/prefer-global/process.md",
        },
        fixable: null,
        schema: [{ enum: ["always", "never"] }],
        messages: {
            preferGlobal:
                "Unexpected use of 'require(\"process\")'. Use the global variable 'process' instead.",
            preferModule:
                "Unexpected use of the global variable 'process'. Use 'require(\"process\")' instead.",
        },
    },

    create(context) {
        return defineHandlers(context, {
            globals: {
                process: { [READ]: true },
            },
            modules: {
                process: { [READ]: true },
            },
        })
    },
}
