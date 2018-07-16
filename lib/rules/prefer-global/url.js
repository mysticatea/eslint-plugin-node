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
            description: 'enforce either `URL` or `require("url").URL`',
            category: "Stylistic Issues",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/prefer-global/url.md",
        },
        fixable: null,
        schema: [{ enum: ["always", "never"] }],
        messages: {
            preferGlobal:
                "Unexpected use of 'require(\"url\").URL'. Use the global variable 'URL' instead.",
            preferModule:
                "Unexpected use of the global variable 'URL'. Use 'require(\"url\").URL' instead.",
        },
    },

    create(context) {
        return defineHandlers(context, {
            globals: {
                URL: { [READ]: true },
            },
            modules: {
                url: {
                    URL: { [READ]: true },
                },
            },
        })
    },
}
