/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { CALL } = require("eslint-utils")
const defineUnsupportedModuleHandlers = require("../../util/define-unsupported-module-handlers")
const enumeratePropertyNames = require("../../util/enumerate-property-names")

const trackMap = {
    modules: {
        console: {
            clear: { [CALL]: { supported: "8.3.0" } },
            count: { [CALL]: { supported: "8.3.0" } },
            countReset: { [CALL]: { supported: "8.3.0" } },
            debug: { [CALL]: { supported: "8.0.0" } },
            dirxml: { [CALL]: { supported: "8.0.0" } },
            group: { [CALL]: { supported: "8.5.0" } },
            groupCollapsed: { [CALL]: { supported: "8.5.0" } },
            groupEnd: { [CALL]: { supported: "8.5.0" } },
            table: { [CALL]: { supported: "10.0.0" } },
            markTimeline: { [CALL]: { supported: "8.0.0" } },
            profile: { [CALL]: { supported: "8.0.0" } },
            profileEnd: { [CALL]: { supported: "8.0.0" } },
            timeStamp: { [CALL]: { supported: "8.0.0" } },
            timeline: { [CALL]: { supported: "8.0.0" } },
            timelineEnd: { [CALL]: { supported: "8.0.0" } },
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
