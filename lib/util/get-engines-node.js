/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
"use strict"

const semver = require("semver")
const getPackageJson = require("./get-package-json")
const DEFAULT_VERSION = ">=6.0.0"

/**
 * Gets default version configuration of this rule.
 *
 * This finds and reads 'package.json' file, then parses 'engines.node' field.
 * If it's nothing, this returns '>=6.0.0'.
 *
 * @param {string} filename - The file name of the current linting file.
 * @returns {string} The default version configuration.
 */
module.exports = function getEnginesNode(filename) {
    const info = getPackageJson(filename)
    const nodeVersion = info && info.engines && info.engines.node

    return semver.validRange(nodeVersion) || DEFAULT_VERSION
}
