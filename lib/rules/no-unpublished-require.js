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
const getAllowModules = require("../util/get-allow-modules")
const getConvertPath = require("../util/get-convert-path")
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
            checkPublish(
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
            convertPath: getConvertPath.schema,
            tryExtensions: getTryExtensions.schema,
        },
        additionalProperties: false,
    },
]
