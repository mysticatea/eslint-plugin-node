/**
 * @fileoverview Rule to check whether or not `require()` is valid.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path")
var resolve = require("resolve")
var exists = require("./exists")
var getAllowModules = require("./get-allow-modules")

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Checks whether or not each requirement target exists.
 *
 * It looks up the target according to the logic of Node.js.
 * See Also: https://nodejs.org/api/modules.html
 *
 * @param {RuleContext} context - A context to report.
 * @param {string} filePath - The current file path.
 * @param {ImportTarget[]} targets - A list of target information to check.
 * @returns {void}
 */
module.exports = function checkForExistence(context, filePath, targets) {
    var allowed = getAllowModules(context)
    var opts = {basedir: path.dirname(path.resolve(filePath))}

    for (var i = 0; i < targets.length; ++i) {
        var target = targets[i]

        // Workaround for https://github.com/substack/node-resolve/issues/78
        if (target.filePath) {
            if (exists(target.filePath)) {
                continue
            }
        }
        else if (allowed.indexOf(target.moduleName) !== -1) {
            continue
        }
        else {
            try {
                resolve.sync(target.name, opts)
                continue
            }
            catch (_err) {
                // ignore.
            }
        }

        context.report({
            node: target.node,
            message: "\"{{name}}\" is not found.",
            data: target,
        })
    }
}
