/**
 * @author Nicholas C. Zakas
 * See LICENSE file in root directory for full license.
 */
"use strict"

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description:
                "disallow string concatenation with `__dirname` and `__filename`",
            category: "Node.js and CommonJS",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v11.0.0/docs/rules/no-path-concat.md",
        },

        schema: [],

        messages: {
            usePathFunctions:
                "Use path.join() or path.resolve() instead of + to create paths.",
        },
    },

    create(context) {
        const MATCHER = /^__(?:dir|file)name$/u

        return {
            BinaryExpression(node) {
                const left = node.left
                const right = node.right

                if (
                    node.operator === "+" &&
                    ((left.type === "Identifier" && MATCHER.test(left.name)) ||
                        (right.type === "Identifier" &&
                            MATCHER.test(right.name)))
                ) {
                    context.report({
                        node,
                        messageId: "usePathFunctions",
                    })
                }
            },
        }
    },
}
