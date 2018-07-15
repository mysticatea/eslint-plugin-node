/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { CALL, READ } = require("eslint-utils")
const defineUnsupportedModuleHandlers = require("../../util/define-unsupported-module-handlers")
const enumeratePropertyNames = require("../../util/enumerate-property-names")

const trackMap = {
    //eslint-disable-next-line camelcase
    async_hooks: {
        [READ]: { supported: "8.0.0" },
        createHook: { [CALL]: { supported: "8.1.0" } },
    },
}

module.exports = {
    meta: {
        docs: {
            description:
                "disallow unsupported `async_hooks` APIs on the specified version",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/no-unsupported-features/async_hooks.md",
        },
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    version: {
                        type: "string",
                    },
                    ignores: {
                        type: "array",
                        items: {
                            enum: Array.from(enumeratePropertyNames(trackMap)),
                        },
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            unsupported:
                "The '{{name}}' is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
        },
    },
    create(context) {
        return defineUnsupportedModuleHandlers(context, trackMap)
    },
}
