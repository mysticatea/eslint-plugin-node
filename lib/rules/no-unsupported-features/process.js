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
        process: {
            argv0: { [READ]: { supported: "6.4.0" } },
            channel: { [READ]: { supported: "7.1.0" } },
            cpuUsage: { [READ]: { supported: "6.1.0" } },
            emitWarning: { [READ]: { supported: "8.0.0" } },
            getegid: { [READ]: { supported: "2.0.0" } },
            geteuid: { [READ]: { supported: "2.0.0" } },
            hasUncaughtExceptionCaptureCallback: {
                [READ]: { supported: "9.3.0" },
            },
            ppid: { [READ]: { supported: "9.2.0" } },
            release: { [READ]: { supported: "3.0.0" } },
            setegid: { [READ]: { supported: "2.0.0" } },
            seteuid: { [READ]: { supported: "2.0.0" } },
            setUncaughtExceptionCaptureCallback: {
                [READ]: { supported: "9.3.0" },
            },
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
                "disallow unsupported `process` APIs on the specified version",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/no-unsupported-features/process.md",
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
