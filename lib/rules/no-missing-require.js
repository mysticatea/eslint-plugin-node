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
const getAllowModules = require("../util/get-allow-modules")
const getRequireTargets = require("../util/get-require-targets")
const getTryExtensions = require("../util/get-try-extensions")

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
            allowModules: getAllowModules.schema,
            tryExtensions: getTryExtensions.schema,
        },
        additionalProperties: false,
    },
]
