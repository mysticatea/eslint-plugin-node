/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const checkExistence = require("../util/check-existence")
const getRequireTargets = require("../util/get-require-targets")

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    const filePath = context.getFilename()
    if (filePath === "<input>") {
        return {}
    }

    return {
        "Program:exit"() {
            checkExistence(
                context,
                filePath,
                getRequireTargets(context)
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
