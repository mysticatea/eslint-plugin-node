/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const getAllowModules = require("./get-allow-modules")
const getPackageJson = require("./get-package-json")

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
module.exports = function checkForExtraneous(context, filePath, targets) {
    const options = context.options[0] || {}

    let packageInfo = getPackageJson(filePath)

    // When using yarn workspaces, we should look in the parent folder
    if (options.yarnWorkspaces && packageInfo && !packageInfo.workspaces) {
        packageInfo = getPackageJson(path.dirname(packageInfo.filePath))
    }

    if (!packageInfo) {
        return
    }

    const allowed = new Set(getAllowModules(context))
    const dependencies = new Set(
        [].concat(
            Object.keys(packageInfo.dependencies || {}),
            Object.keys(packageInfo.devDependencies || {}),
            Object.keys(packageInfo.peerDependencies || {}),
            Object.keys(packageInfo.optionalDependencies || {})
        )
    )

    for (const target of targets) {
        const extraneous =
            target.moduleName != null &&
            target.filePath != null &&
            !dependencies.has(target.moduleName) &&
            !allowed.has(target.moduleName)

        if (extraneous) {
            context.report({
                node: target.node,
                loc: target.node.loc,
                message: '"{{moduleName}}" is extraneous.',
                data: target,
            })
        }
    }
}
