/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var checkExistence = require("../util/check-existence")
var getImportExportTargets = require("../util/get-import-export-targets")

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var filePath = context.getFilename()
    if (filePath === "<input>") {
        return {}
    }

    return {
        "Program:exit": function(node) {
            checkExistence(
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
