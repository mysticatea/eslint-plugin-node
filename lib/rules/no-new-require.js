/**
 * @author Wil Moore III
 * See LICENSE file in root directory for full license.
 */
"use strict"

module.exports = {
    meta: {
        docs: {
            description: "disallow `new` operators with calls to `require`",
            category: "Possible Errors",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-new-require.md",
        },
        fixable: null,
        messages: {
            noNewRequire: "Unexpected use of new with require.",
        },
        schema: [],
        type: "suggestion",
    },

    create(context) {
        return {
            NewExpression(node) {
                if (
                    node.callee.type === "Identifier" &&
                    node.callee.name === "require"
                ) {
                    context.report({
                        node,
                        messageId: "noNewRequire",
                    })
                }
            },
        }
    },
}
