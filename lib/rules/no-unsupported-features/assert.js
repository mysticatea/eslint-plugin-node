/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const semver = require("semver")
const { CALL, READ, ReferenceTracker } = require("eslint-utils")
const getEnginesNode = require("../../util/get-engines-node")

const trackMap = {
    assert: {
        strict: {
            [READ]: { supported: "9.9.0" },
            doesNotReject: { [CALL]: { supported: "10.0.0" } },
            rejects: { [CALL]: { supported: "10.0.0" } },
        },
        deepStrictEqual: { [CALL]: { supported: "4.0.0" } },
        doesNotReject: { [CALL]: { supported: "10.0.0" } },
        notDeepStrictEqual: { [CALL]: { supported: "4.0.0" } },
        rejects: { [CALL]: { supported: "10.0.0" } },
    },
}
const keywords = (function collect(path, map) {
    const ret = []
    if (map[CALL] || map[READ]) {
        ret.push(path.join("."))
    }
    for (const key of Object.keys(map)) {
        path.push(key)
        ret.push(...collect(path, map[key]))
        path.pop()
    }
    return ret
})([], trackMap)

/**
 * Parses the options.
 * @param {object|undefined} options - An option object to parse.
 * @param {string} defaultVersion - The default version to use if the version option was omitted.
 * @returns {{version:string,ignores:Set<string>}} Parsed value.
 */
function parseOptions(options, defaultVersion) {
    const version =
        semver.validRange(options && options.version) || defaultVersion
    const ignores = new Set((options && options.ignores) || [])

    return Object.freeze({ version, ignores })
}

module.exports = {
    meta: {
        docs: {
            description:
                "disallow unsupported `assert` APIs on the specified version",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/no-unsupported-features/assert.md",
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
                        items: { enum: keywords },
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
        const defaultVersion = getEnginesNode(context.getFilename())
        const options = parseOptions(context.options[0], defaultVersion)

        return {
            "Program:exit"() {
                const tracker = new ReferenceTracker(context.getScope(), {
                    mode: "legacy",
                })
                const references = [
                    ...tracker.iterateCjsReferences(trackMap),
                    ...tracker.iterateEsmReferences(trackMap),
                ]

                for (const { node, path, info } of references) {
                    const name = path.join(".")
                    const supported = semver.intersects(
                        options.version,
                        `<${info.supported}`
                    )

                    if (supported && !options.ignores.has(name)) {
                        context.report({
                            node,
                            messageId: "unsupported",
                            data: {
                                name,
                                supported: info.supported,
                                version: options.version,
                            },
                        })
                    }
                }
            },
        }
    },
}
