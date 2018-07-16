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
            description:
                'enforce either `URLSearchParams` or `require("url").URLSearchParams`',
            category: "Stylistic Issues",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/prefer-global/url-search-params.md",
        },
        fixable: null,
        schema: [{ enum: ["always", "never"] }],
        messages: {
            preferGlobal:
                "Unexpected use of 'require(\"url\").URLSearchParams'. Use the global variable 'URLSearchParams' instead.",
            preferModule:
                "Unexpected use of the global variable 'URLSearchParams'. Use 'require(\"url\").URLSearchParams' instead.",
        },
    },

    create(context) {
        return defineHandlers(context, {
            globals: {
                URLSearchParams: { [READ]: true },
            },
            modules: {
                url: {
                    URLSearchParams: { [READ]: true },
                },
            },
        })
    },
}
