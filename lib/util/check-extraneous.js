/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path")
const resolve = require("resolve")
const getAllowModules = require("./get-allow-modules")
const getConvertPath = require("./get-convert-path")
const getPackageJson = require("./get-package-json")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Check whether the given package exists or not.
 * @param {string} name The package name to check.
 * @param {string} basedir The path to starting directory.
 * @returns {boolean} `true` if the package was found.
 */
function exists(name, basedir) {
    try {
        resolve.sync(name, {basedir})
        return true
    }
    catch (_err) {
        return false
    }
}

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
module.exports = function checkForExtraeous(context, filePath, targets) {
    const packageInfo = getPackageJson(filePath)
    if (!packageInfo) {
        return
    }

    const allowed = new Set(getAllowModules(context))
    const convertPath = getConvertPath(context)
    const rootPath = path.dirname(packageInfo.filePath)
    const toRelative = function(fullPath) { // eslint-disable-line func-style
        const retv = path.relative(rootPath, fullPath).replace(/\\/g, "/")
        return convertPath(retv)
    }
    const convertedPath = path.resolve(
        rootPath,
        toRelative(path.resolve(filePath))
    )
    const basedir = path.dirname(convertedPath)
    const dependencies = new Set(
        [].concat(
            Object.keys(packageInfo.dependencies || {}),
            Object.keys(packageInfo.devDependencies || {}),
            Object.keys(packageInfo.peerDependencies || {}),
            Object.keys(packageInfo.optionalDependencies || {})
        )
    )

    for (const target of targets) {
        const name = target.moduleName
        const extraneous = (
            name != null &&
            !dependencies.has(name) &&
            !allowed.has(name) &&
            exists(name, basedir)
        )

        if (extraneous) {
            context.report({
                node: target.node,
                loc: target.node.loc,
                message: "\"{{moduleName}}\" is extraneous.",
                data: target,
            })
        }
    }
}
