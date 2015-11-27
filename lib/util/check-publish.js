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
var minimatch = require("minimatch");
var assign = require("object-assign");
var getPackageJson = require("./get-package-json");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets the module name of a given path.
 *
 * e.g. `eslint/lib/ast-utils` -> `eslint`
 *
 * @param {string} nameOrPath - A path to get.
 * @returns {string} The module name of the path.
 */
function getModuleName(nameOrPath) {
    var end = nameOrPath.indexOf("/");
    if (end !== -1 && nameOrPath[0] === "@") {
        end = nameOrPath.indexOf("/", 1 + end);
    }

    return end === -1 ? nameOrPath : nameOrPath.slice(0, end);
}

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
 * Checks whether or not each requirement target is published via package.json.
 *
 * It reads package.json and checks the target exists in `dependencies`.
 *
 * @param {RuleContext} context - A context to report.
 * @param {string} filePath - The current file path.
 * @param {TargetInfo[]} targets - A list of target information to check.
 * @returns {void}
 */
module.exports = function checkForPublish(context, filePath, targets) {
    var option = context.options[0];
    if ((option && option.publish) === null) {
        return;
    }

    var packageInfo = getPackageJson(filePath);
    if (!packageInfo) {
        return;
    }

    var publish = minimatch(
        path.relative(packageInfo.filePath, filePath).replace(/\\/g, "/"),
        (option && option.publish) || "+(./*|./{bin,lib,src}/**)",
        {matchBase: true}
    );
    var deps = assign(
        {},
        packageInfo.peerDependencies || {},
        packageInfo.dependencies || {},
        (!publish && packageInfo.devDependencies) || {}
    );

    for (var i = 0; i < targets.length; ++i) {
        var target = targets[i];

        if (!target.relative && !deps.hasOwnProperty(getModuleName(target.name))) {
            context.report({
                node: target.node,
                message: "\"{{name}}\" is not published.",
                data: target
            });
        }
    }
};
