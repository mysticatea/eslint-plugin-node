/**
 * @author Teddy Katz
 * See LICENSE file in root directory for full license.
 */
"use strict"

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "disallow use of the `Buffer()` constructor",
            category: "Possible Errors",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v11.0.0/docs/rules/no-buffer-constructor.md",
        },
        fixable: null,
        schema: [],
        messages: {
            deprecated:
                "{{expr}} is deprecated. Use Buffer.from(), Buffer.alloc(), or Buffer.allocUnsafe() instead.",
        },
    },

    create(context) {
        return {
            "CallExpression[callee.name='Buffer'], NewExpression[callee.name='Buffer']"(
                node
            ) {
                context.report({
                    node,
                    messageId: "deprecated",
                    data: {
                        expr:
                            node.type === "CallExpression"
                                ? "Buffer()"
                                : "new Buffer()",
                    },
                })
            },
        }
    },
}
