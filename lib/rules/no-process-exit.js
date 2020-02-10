/**
 * @author Nicholas C. Zakas
 * See LICENSE file in root directory for full license.
 */
"use strict"

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow the use of `process.exit()`",
            category: "Node.js and CommonJS",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v11.0.0/docs/rules/no-process-exit.md",
        },

        schema: [],

        messages: {
            noProcessExit: "Don't use process.exit(); throw an error instead.",
        },
    },

    create(context) {
        return {
            "CallExpression > MemberExpression.callee[object.name = 'process'][property.name = 'exit']"(
                node
            ) {
                context.report({
                    node: node.parent,
                    messageId: "noProcessExit",
                })
            },
        }
    },
}
