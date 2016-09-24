/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path")
var getConvertPath = require("../util/get-convert-path")
var getNpmignore = require("../util/get-npmignore")
var getPackageJson = require("../util/get-package-json")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether or not a given path is a `bin` file.
 *
 * @param {string} filePath - A file path to check.
 * @param {string|object|undefined} binField - A value of the `bin` field of `package.json`.
 * @param {string} basedir - A directory path that `package.json` exists.
 * @returns {boolean} `true` if the file is a `bin` file.
 */
function isBinFile(filePath, binField, basedir) {
    if (!binField) {
        return false
    }
    if (typeof binField === "string") {
        return filePath === path.resolve(basedir, binField)
    }
    return Object.keys(binField).some(function(key) {
        return filePath === path.resolve(basedir, binField[key])
    })
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow 'bin' files that npm ignores",
            category: "Possible Errors",
            recommended: false,
        },
        fixable: false,
        schema: [
            {
                type: "object",
                properties: {
                    convertPath: {
                        type: "object",
                        properties: {},
                        patternProperties: {
                            "^.+$": {
                                type: "array",
                                items: {type: "string"},
                                minItems: 2,
                                maxItems: 2,
                            },
                        },
                        additionalProperties: false,
                    },
                },
            },
        ],
    },

    create: function(context) {
        return {
            Program: function(node) {
                // Check file path.
                var rawFilePath = context.getFilename()
                if (rawFilePath === "<input>") {
                    return
                }
                rawFilePath = path.resolve(rawFilePath)

                // Find package.json
                var p = getPackageJson(rawFilePath)
                if (!p) {
                    return
                }

                // Convert by convertPath option
                var basedir = path.dirname(p.filePath)
                var relativePath = getConvertPath(context)(
                    path.relative(basedir, rawFilePath).replace(/\\/g, "/")
                )
                var filePath = path.join(basedir, relativePath)

                // Check this file is bin.
                if (!isBinFile(filePath, p.bin, basedir)) {
                    return
                }

                // Check ignored or not
                var npmignore = getNpmignore(filePath)
                if (!npmignore.match(relativePath)) {
                    return
                }

                // Report.
                context.report({
                    node: node,
                    message:
                        "npm ignores '{{name}}'. " +
                        "Check 'files' field of 'package.json' or '.npmignore'.",
                    data: {name: relativePath},
                })
            },
        }
    },
}
