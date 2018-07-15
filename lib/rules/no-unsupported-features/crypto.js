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
        crypto: {
            Certificate: {
                exportChallenge: { [READ]: { supported: "9.0.0" } },
                exportPublicKey: { [READ]: { supported: "9.0.0" } },
                verifySpkac: { [READ]: { supported: "9.0.0" } },
            },
            constants: { [READ]: { supported: "6.3.0" } },
            fips: { [READ]: { supported: "6.0.0" } },
            getCurves: { [READ]: { supported: "2.3.0" } },
            getFips: { [READ]: { supported: "10.0.0" } },
            privateEncrypt: { [READ]: { supported: "1.1.0" } },
            publicDecrypt: { [READ]: { supported: "1.1.0" } },
            randomFillSync: { [READ]: { supported: "7.10.0" } },
            randomFill: { [READ]: { supported: "7.10.0" } },
            scrypt: { [READ]: { supported: "10.5.0" } },
            scryptSync: { [READ]: { supported: "10.5.0" } },
            setFips: { [READ]: { supported: "10.0.0" } },
            timingSafeEqual: { [READ]: { supported: "6.6.0" } },
        },
    },
}

module.exports = {
    meta: {
        docs: {
            description:
                "disallow unsupported `crypto` APIs on the specified version",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/no-unsupported-features/crypto.md",
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
