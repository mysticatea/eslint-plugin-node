/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { globals, modules } = require("../util/deprecated-apis")
const ReferenceTracer = require("../util/reference-tracer")

const MODULE_ITEMS = listNames(modules)
const GLOBAL_ITEMS = listNames(globals)

/**
 * Gets the array of deprecated items.
 *
 * These are names which are concatenated by dots.
 * E.g. `buffer.Buffer`, `events.EventEmitter.listenerCount`
 *
 * @param {object} definition - The definition of deprecated APIs.
 * @param {string[]} result - The array of the result.
 * @param {string[]} stack - The array to manage the stack of paths.
 * @returns {string[]} `result`.
 */
function listNames(definition, result = [], stack = []) {
    for (const key of Object.keys(definition)) {
        stack.push(key)
        try {
            const item = definition[key]
            let stop = false

            if (item[ReferenceTracer.READ]) {
                result.push(stack.join("."))
                stop = true
            }
            if (item[ReferenceTracer.CALL]) {
                result.push(`${stack.join(".")}()`)
                stop = true
            }
            if (item[ReferenceTracer.CONSTRUCT]) {
                result.push(`new ${stack.join(".")}()`)
                stop = true
            }

            if (!stop) {
                listNames(item, result, stack)
            }
        } finally {
            stack.pop()
        }
    }

    return result
}

/**
 * Converts from a version number to a version text to display.
 *
 * @param {number} value - A version number to convert.
 * @returns {string} Covnerted text.
 */
function toVersionText(value) {
    if (value <= 0.12) {
        return value.toFixed(2)
    }
    if (value < 1) {
        return value.toFixed(1)
    }
    return String(value)
}

/**
 * Makes a replacement message.
 *
 * @param {string|null} replacedBy - The text of substitute way.
 * @returns {string} Replacement message.
 */
function toReplaceMessage(replacedBy) {
    return replacedBy ? `. Use ${replacedBy} instead` : ""
}

/**
 * Convert a given path to name.
 * @param {symbol} type The report type.
 * @param {string[]} path The property access path.
 * @returns {string} The name.
 */
function toName(type, path) {
    const baseName = path.join(".")
    return type === ReferenceTracer.CALL
        ? `${baseName}()`
        : type === ReferenceTracer.CONSTRUCT
            ? `new ${baseName}()`
            : baseName
}

module.exports = {
    meta: {
        docs: {
            description: "disallow deprecated APIs",
            category: "Best Practices",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/no-deprecated-api.md",
        },
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    ignoreModuleItems: {
                        type: "array",
                        items: { enum: MODULE_ITEMS },
                        additionalItems: false,
                        uniqueItems: true,
                    },
                    ignoreGlobalItems: {
                        type: "array",
                        items: { enum: GLOBAL_ITEMS },
                        additionalItems: false,
                        uniqueItems: true,
                    },

                    // Deprecated since v4.2.0
                    ignoreIndirectDependencies: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options = context.options[0] || {}
        const ignoredModuleItems = options.ignoreModuleItems || []
        const ignoredGlobalItems = options.ignoreGlobalItems || []

        /**
         * Reports a use of a deprecated API.
         *
         * @param {ASTNode} node - A node to report.
         * @param {string} name - The name of a deprecated API.
         * @param {{since: number, replacedBy: string}} info - Information of the API.
         * @returns {void}
         */
        function reportItem(node, name, info) {
            context.report({
                node,
                loc: node.loc,
                message:
                    "{{name}} was deprecated since v{{version}}{{replace}}.",
                data: {
                    name,
                    version: toVersionText(info.since),
                    replace: toReplaceMessage(info.replacedBy),
                },
            })
        }

        return {
            "Program:exit"() {
                const tracer = new ReferenceTracer(context.getScope())

                for (const report of tracer.iterateGlobalReferences(globals)) {
                    const { node, path, type, entry } = report
                    const name = toName(type, path)

                    if (!ignoredGlobalItems.includes(name)) {
                        reportItem(node, `'${name}'`, entry)
                    }
                }
                for (const report of tracer.iterateCjsReferences(modules)) {
                    const { node, path, type, entry } = report
                    const name = toName(type, path)
                    const suffix = path.length === 1 ? " module" : ""

                    if (!ignoredModuleItems.includes(name)) {
                        reportItem(node, `'${name}'${suffix}`, entry)
                    }
                }
                for (const report of tracer.iterateEsmReferences(modules)) {
                    const { node, path, type, entry } = report
                    const name = toName(type, path)
                    const suffix = path.length === 1 ? " module" : ""

                    if (!ignoredModuleItems.includes(name)) {
                        reportItem(node, `'${name}'${suffix}`, entry)
                    }
                }
            },
        }
    },
}
