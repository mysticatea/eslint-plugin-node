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
        url: {
            URL: { [READ]: { supported: "7.0.0" } },
            URLSearchParams: { [READ]: { supported: "7.5.0" } },
            domainToASCII: { [READ]: { supported: "7.4.0" } },
            domainToUnicode: { [READ]: { supported: "7.4.0" } },
        },
    },
    globals: {
        URL: { [READ]: { supported: "10.0.0" } },
        URLSearchParams: { [READ]: { supported: "10.0.0" } },
    },
}

module.exports = {
    meta: {
        docs: {
            description:
                "disallow unsupported `url` APIs on the specified version",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/no-unsupported-features/url.md",
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
                            enum: [
                                ...enumeratePropertyNames(trackMap.globals),
                                ...enumeratePropertyNames(trackMap.modules),
                            ],
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
