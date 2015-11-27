/**
 * @fileoverview Rule to check whether or not `require()` is valid.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path");
var resolve = require("resolve");
var exists = require("./exists");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * @typedef object TargetInfo
 * @property {ASTNode} node - The `Identifier` node of the target.
 * @property {string} name - The target name.
 * @property {boolean} relative - The flag which shows the target name is a relative path.
 */

/**
 * Checks whether or not each requirement target exists.
 *
 * It looks up the target according to the logic of Node.js.
 * See Also: https://nodejs.org/api/modules.html
 *
 * @param {RuleContext} context - A context to report.
 * @param {string} filePath - The current file path.
 * @param {TargetInfo[]} targets - A list of target information to check.
 * @returns {void}
 */
module.exports = function checkForExistence(context, filePath, targets) {
    var basedir = path.dirname(filePath);
    var opts = {basedir: basedir};

    for (var i = 0; i < targets.length; ++i) {
        var target = targets[i];

        // Workaround for https://github.com/substack/node-resolve/issues/78
        if (target.relative) {
            var ext = path.extname(target.name);
            var name = ext ? target.name : target.name + ".js";
            if (exists(path.resolve(basedir, name))) {
                continue;
            }
        } else {
            try {
                resolve.sync(target.name, opts);
                continue;
            } catch (err) {
                // ignore.
            }
        }

        context.report({
            node: target.node,
            message: "\"{{name}}\" is not found.",
            data: target
        });
    }
};
