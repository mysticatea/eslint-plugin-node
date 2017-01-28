/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const checkPublish = require("../util/check-publish")
const getImportExportTargets = require("../util/get-import-export-targets")

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    const filePath = context.getFilename()
    if (filePath === "<input>") {
        return {}
    }

    return {
        "Program:exit"(node) {
            checkPublish(
                context,
                filePath,
                getImportExportTargets(context, node)
            )
        },
    }
}

module.exports.schema = [
    {
        type: "object",
        properties: {
            allowModules: {
                type: "array",
                items: {
                    type: "string",
                    pattern: "^(?:@[a-zA-Z0-9_\\-.]+/)?[a-zA-Z0-9_\\-.]+$",
                },
                uniqueItems: true,
            },
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
            tryExtensions: {
                type: "array",
                items: {
                    type: "string",
                    pattern: "^\\.",
                },
                uniqueItems: true,
            },
        },
        additionalProperties: false,
    },
]
