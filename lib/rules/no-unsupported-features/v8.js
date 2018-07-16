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
        v8: {
            [READ]: { supported: "1.0.0" },
            cachedDataVersionTag: { [READ]: { supported: "8.0.0" } },
            getHeapSpaceStatistics: { [READ]: { supported: "6.0.0" } },
            serialize: { [READ]: { supported: "8.0.0" } },
            deserialize: { [READ]: { supported: "8.0.0" } },
            Serializer: { [READ]: { supported: "8.0.0" } },
            Deserializer: { [READ]: { supported: "8.0.0" } },
            DefaultSerializer: { [READ]: { supported: "8.0.0" } },
            DefaultDeserializer: { [READ]: { supported: "8.0.0" } },
        },
    },
}

module.exports = {
    meta: {
        docs: {
            description:
                "disallow unsupported `v8` APIs on the specified version",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/no-unsupported-features/v8.md",
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
