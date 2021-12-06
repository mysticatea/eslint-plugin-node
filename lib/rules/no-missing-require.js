/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const checkExistence = require("../util/check-existence.js")
const getAllowModules = require("../util/get-allow-modules.js")
const getResolvePaths = require("../util/get-resolve-paths.js")
const getTryExtensions = require("../util/get-try-extensions.js")
const visitRequire = require("../util/visit-require.js")

module.exports = {
    meta: {
        docs: {
            description:
                "disallow `require()` expressions which import non-existence modules",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-missing-require.md",
        },
        type: "problem",
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    allowModules: getAllowModules.schema,
                    tryExtensions: getTryExtensions.schema,
                    resolvePaths: getResolvePaths.schema,
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

        return visitRequire(context, {}, targets => {
            checkExistence(context, targets)
        })
    },
}
