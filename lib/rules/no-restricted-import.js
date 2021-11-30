/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const check = require("../util/check-restricted")
const visit = require("../util/visit-import")

module.exports = {
    meta: {
        docs: {
            description:
                "disallow specified modules when loaded by `import` declarations",
            category: "Stylistic Issues",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-restricted-import.md",
        },
        fixable: null,
        messages: {
            restricted:
                // eslint-disable-next-line @mysticatea/eslint-plugin/report-message-format
                "'{{name}}' module is restricted from being used.{{customMessage}}",
        },
        schema: [
            {
                type: "array",
                items: {
                    anyOf: [
                        { type: "string" },
                        {
                            type: "object",
                            properties: {
                                name: {
                                    anyOf: [
                                        { type: "string" },
                                        {
                                            type: "array",
                                            items: { type: "string" },
                                            additionalItems: false,
                                        },
                                    ],
                                },
                                message: { type: "string" },
                            },
                            additionalProperties: false,
                            required: ["name"],
                        },
                    ],
                },
                additionalItems: false,
            },
        ],
        type: "suggestion",
    },

    create(context) {
        const opts = { includeCore: true }
        return visit(context, opts, targets => check(context, targets))
    },
}
