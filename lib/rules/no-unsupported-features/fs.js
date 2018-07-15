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
        fs: {
            copyFile: { [READ]: { supported: "8.5.0" } },
            copyFileSync: { [READ]: { supported: "8.5.0" } },
            mkdtemp: { [READ]: { supported: "5.10.0" } },
            mkdtempSync: { [READ]: { supported: "5.10.0" } },
            realpath: {
                native: { [READ]: { supported: "9.2.0" } },
            },
            realpathSync: {
                native: { [READ]: { supported: "9.2.0" } },
            },
            promises: {
                [READ]: { supported: "10.1.0" },
            },
        },
    },
}

module.exports = {
    meta: {
        docs: {
            description:
                "disallow unsupported `fs` APIs on the specified version",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/no-unsupported-features/fs.md",
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
