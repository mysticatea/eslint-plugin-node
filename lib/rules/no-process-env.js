/**
 * @author Vignesh Anand
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow the use of `process.env`",
            category: "Stylistic Issues",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-process-env.md",
        },
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    customMessage: {
                        type: "string",
                    },
                },
            },
        ],
        messages: {
            unexpectedProcessEnv: "Unexpected use of process.env.",
        },
    },

    create(context) {
        const options = context.options[0] || {}
        const customMessage = options.customMessage

        return {
            MemberExpression(node) {
                const objectName = node.object.name
                const propertyName = node.property.name

                if (
                    objectName === "process" &&
                    !node.computed &&
                    propertyName &&
                    propertyName === "env"
                ) {
                    const report = { node }
                    if (customMessage) {
                        report.message = customMessage
                    } else {
                        report.messageId = "unexpectedProcessEnv"
                    }
                    context.report(report)
                }
            },
        }
    },
}
