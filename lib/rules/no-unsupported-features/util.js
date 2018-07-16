/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { READ } = require("eslint-utils")
const defineUnsupportedModuleHandlers = require("../../util/define-unsupported-module-handlers")
const enumeratePropertyNames = require("../../util/enumerate-property-names")

const trackMap = {
    modules: {
        util: {
            callbackify: { [READ]: { supported: "8.2.0" } },
            formatWithOptions: { [READ]: { supported: "10.0.0" } },
            getSystemErrorName: { [READ]: { supported: "9.7.0" } },
            inspect: {
                custom: { [READ]: { supported: "6.6.0" } },
                defaultOptions: { [READ]: { supported: "6.4.0" } },
            },
            isDeepStrictEqual: { [READ]: { supported: "9.0.0" } },
            promisify: { [READ]: { supported: "8.0.0" } },
            TextDecoder: { [READ]: { supported: "8.3.0" } },
            TextEncoder: { [READ]: { supported: "8.3.0" } },
            types: {
                [READ]: { supported: "10.0.0" },
            },
        },
    },
}

module.exports = {
    meta: {
        docs: {
            description:
                "disallow unsupported `util` APIs on the specified version",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/no-unsupported-features/util.md",
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
                            enum: Array.from(
                                enumeratePropertyNames(trackMap.modules)
                            ),
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
