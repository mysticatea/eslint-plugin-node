/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const semver = require("semver")
const { ReferenceTracker } = require("eslint-utils")
const getEnginesNode = require("./get-engines-node")

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

/**
 * Define the handlers which reports the specified APIs of modules.
 * @param {RuleContext} context The rule context.
 * @param {{modules:object,globals:object}} trackMap The map for APIs to report.
 * @returns {object} Handlers.
 */
module.exports = function defineUnsupportedModuleHandlers(context, trackMap) {
    const defaultVersion = getEnginesNode(context.getFilename())
    const options = parseOptions(context.options[0], defaultVersion)

    return {
        "Program:exit"() {
            const tracker = new ReferenceTracker(context.getScope(), {
                mode: "legacy",
            })
            const references = [
                ...tracker.iterateCjsReferences(trackMap.modules || {}),
                ...tracker.iterateEsmReferences(trackMap.modules || {}),
                ...tracker.iterateGlobalReferences(trackMap.globals || {}),
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
}
