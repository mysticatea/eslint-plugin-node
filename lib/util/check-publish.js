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
var assign = require("object-assign")
var getAllowModules = require("./get-allow-modules")
var getConvertPath = require("./get-convert-path")
var getNpmignore = require("./get-npmignore")
var getPackageJson = require("./get-package-json")

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Checks whether or not each requirement target is published via package.json.
 *
 * It reads package.json and checks the target exists in `dependencies`.
 *
 * @param {RuleContext} context - A context to report.
 * @param {string} filePath - The current file path.
 * @param {ImportTarget[]} targets - A list of target information to check.
 * @returns {void}
 */
module.exports = function checkForPublish(context, filePath, targets) {
    var packageInfo = getPackageJson(filePath)
    if (!packageInfo) {
        return
    }

    var allowed = getAllowModules(context)
    var convertPath = getConvertPath(context)
    var basedir = path.dirname(packageInfo.filePath)
    var toRelative = function(fullPath) { // eslint-disable-line func-style
        var retv = path.relative(basedir, fullPath).replace(/\\/g, "/")
        return convertPath(retv)
    }
    var npmignore = getNpmignore(filePath)
    var dependencies = assign(
        Object.create(null),
        packageInfo.peerDependencies || {},
        packageInfo.dependencies || {}
    )
    var devDependencies = assign(
        Object.create(null),
        packageInfo.devDependencies || {}
    )
    var i = 0
    var target = null

    if (npmignore.match(toRelative(filePath))) {
        // This file is private, so this can import private files.
        for (i = 0; i < targets.length; ++i) {
            target = targets[i]

            if (target.moduleName &&
                !dependencies[target.moduleName] &&
                !devDependencies[target.moduleName] &&
                allowed.indexOf(target.moduleName) === -1
            ) {
                context.report({
                    node: target.node,
                    message: "\"{{name}}\" is not published.",
                    data: {name: target.moduleName},
                })
            }
        }
    }
    else {
        // This file is published, so this cannot import private files.
        for (i = 0; i < targets.length; ++i) {
            target = targets[i]

            if (target.moduleName ?
                (!dependencies[target.moduleName] && allowed.indexOf(target.moduleName) === -1) :
                npmignore.match(toRelative(target.filePath))
            ) {
                context.report({
                    node: target.node,
                    message: "\"{{name}}\" is not published.",
                    data: {name: target.moduleName || target.name},
                })
            }
        }
    }
}
