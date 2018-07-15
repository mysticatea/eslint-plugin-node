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
        buffer: {
            Buffer: {
                alloc: { [READ]: { supported: "4.5.0" } },
                allocUnsafe: { [READ]: { supported: "4.5.0" } },
                allocUnsafeSlow: { [READ]: { supported: "4.5.0" } },
                from: { [READ]: { supported: "4.5.0" } },
            },
            kMaxLength: { [READ]: { supported: "3.0.0" } },
            transcode: { [READ]: { supported: "7.1.0" } },
            constants: { [READ]: { supported: "8.2.0" } },
        },
    },
    get globals() {
        return { Buffer: this.modules.buffer.Buffer }
    },
}

module.exports = {
    meta: {
        docs: {
            description:
                "disallow unsupported `buffer` APIs on the specified version",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/no-unsupported-features/buffer.md",
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
                                ...enumeratePropertyNames(trackMap.modules),
                                ...enumeratePropertyNames(trackMap.globals),
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
