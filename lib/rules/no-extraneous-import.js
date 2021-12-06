/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const checkExtraneous = require("../util/check-extraneous.js")
const getAllowModules = require("../util/get-allow-modules.js")
const getConvertPath = require("../util/get-convert-path.js")
const getResolvePaths = require("../util/get-resolve-paths.js")
const getTryExtensions = require("../util/get-try-extensions.js")
const visitImport = require("../util/visit-import.js")

module.exports = {
    meta: {
        docs: {
            description:
                "disallow `import` declarations which import extraneous modules",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-extraneous-import.md",
        },
        type: "problem",
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    allowModules: getAllowModules.schema,
                    convertPath: getConvertPath.schema,
                    resolvePaths: getResolvePaths.schema,
                    tryExtensions: getTryExtensions.schema,
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const filePath = context.getFilename()
        if (filePath === "<input>") {
            return {}
        }

        return visitImport(context, {}, targets => {
            checkExtraneous(context, filePath, targets)
        })
    },
}
