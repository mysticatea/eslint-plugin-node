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
        console: {
            clear: { [READ]: { supported: "8.3.0" } },
            count: { [READ]: { supported: "8.3.0" } },
            countReset: { [READ]: { supported: "8.3.0" } },
            debug: { [READ]: { supported: "8.0.0" } },
            dirxml: { [READ]: { supported: "8.0.0" } },
            group: { [READ]: { supported: "8.5.0" } },
            groupCollapsed: { [READ]: { supported: "8.5.0" } },
            groupEnd: { [READ]: { supported: "8.5.0" } },
            table: { [READ]: { supported: "10.0.0" } },
            markTimeline: { [READ]: { supported: "8.0.0" } },
            profile: { [READ]: { supported: "8.0.0" } },
            profileEnd: { [READ]: { supported: "8.0.0" } },
            timeStamp: { [READ]: { supported: "8.0.0" } },
            timeline: { [READ]: { supported: "8.0.0" } },
            timelineEnd: { [READ]: { supported: "8.0.0" } },
        },
    },
    get globals() {
        return this.modules
    },
}

module.exports = {
    meta: {
        docs: {
            description:
                "disallow unsupported `console` APIs on the specified version",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/no-unsupported-features/console.md",
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
