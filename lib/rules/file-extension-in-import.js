/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const fs = require("fs")
const visitImport = require("../util/visit-import")
const packageNamePattern = /^(?:@[^/\\]+[/\\])?[^/\\]+$/u
const corePackageOverridePattern =
    /^(?:assert|async_hooks|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|http2|https|inspector|module|net|os|path|perf_hooks|process|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|trace_events|tty|url|util|v8|vm|worker_threads|zlib)[/\\]$/u
const typescriptFileExtensionsMapping = {
    ".ts": ".js",
    ".cts": ".cjs",
    ".mts": ".mjs",
}

/**
 * Get all file extensions of the files which have the same basename.
 * @param {string} filePath The path to the original file to check.
 * @returns {string[]} File extensions.
 */
function getExistingExtensions(filePath) {
    const basename = path.basename(filePath, path.extname(filePath))
    try {
        return fs
            .readdirSync(path.dirname(filePath))
            .filter(
                filename =>
                    path.basename(filename, path.extname(filename)) === basename
            )
            .map(filename => path.extname(filename))
    } catch (_error) {
        return []
    }
}

/**
 * Get the file extension that should be added in an import statement,
 * based on the given file extension of the referenced file.
 *
 * For example, in typescript, when referencing another typescript from a typescript file,
 * a .js extension should be used instead of the original .ts extension of the referenced file.
 * @param {string} referencedFileExt The original file extension of the referenced file.
 * @param {string} referencingFileExt The original file extension of the file the contains the import statement.
 * @returns {string} The file extension to append to the import statement.
 */
function getFileExtensionToAdd(referencedFileExt, referencingFileExt) {
    if (
        referencingFileExt in typescriptFileExtensionsMapping &&
        referencedFileExt in typescriptFileExtensionsMapping
    ) {
        return typescriptFileExtensionsMapping[referencedFileExt]
    }

    return referencedFileExt
}

module.exports = {
    meta: {
        docs: {
            description:
                "enforce the style of file extensions in `import` declarations",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://github.com/weiran-zsd/eslint-plugin-node/blob/HEAD/docs/rules/file-extension-in-import.md",
        },
        fixable: "code",
        messages: {
            requireExt: "require file extension '{{ext}}'.",
            forbidExt: "forbid file extension '{{ext}}'.",
        },
        schema: [
            {
                enum: ["always", "never"],
            },
            {
                type: "object",
                properties: {},
                additionalProperties: {
                    enum: ["always", "never"],
                },
            },
        ],
        type: "suggestion",
    },
    create(context) {
        if (context.getFilename().startsWith("<")) {
            return {}
        }
        const defaultStyle = context.options[0] || "always"
        const overrideStyle = context.options[1] || {}

        function verify({ filePath, name, node }) {
            // Ignore if it's not resolved to a file or it's a bare module.
            if (
                !filePath ||
                packageNamePattern.test(name) ||
                corePackageOverridePattern.test(name)
            ) {
                return
            }

            // Get extension.
            const originalExt = path.extname(name)
            const resolvedExt = path.extname(filePath)
            const existingExts = getExistingExtensions(filePath)
            const ext = resolvedExt || existingExts.join(" or ")
            const style = overrideStyle[ext] || defaultStyle

            // Verify.
            if (style === "always" && ext !== originalExt) {
                const referencingFileExt = path.extname(
                    context.getPhysicalFilename()
                )
                const fileExtensionToAdd = getFileExtensionToAdd(
                    ext,
                    referencingFileExt
                )
                context.report({
                    node,
                    messageId: "requireExt",
                    data: { ext: fileExtensionToAdd },
                    fix(fixer) {
                        if (existingExts.length !== 1) {
                            return null
                        }
                        const index = node.range[1] - 1
                        return fixer.insertTextBeforeRange(
                            [index, index],
                            fileExtensionToAdd
                        )
                    },
                })
            } else if (style === "never" && ext === originalExt) {
                context.report({
                    node,
                    messageId: "forbidExt",
                    data: { ext },
                    fix(fixer) {
                        if (existingExts.length !== 1) {
                            return null
                        }
                        const index = name.lastIndexOf(ext)
                        const start = node.range[0] + 1 + index
                        const end = start + ext.length
                        return fixer.removeRange([start, end])
                    },
                })
            }
        }

        return visitImport(context, { optionIndex: 1 }, targets => {
            targets.forEach(verify)
        })
    },
}
