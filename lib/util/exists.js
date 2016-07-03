/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs")

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Checks whether or not the file of a given path exists.
 *
 * @param {string} filePath - A file path to check.
 * @returns {boolean} `true` if the file of a given path exists.
 */
module.exports = function exists(filePath) {
    try {
        return fs.statSync(filePath).isFile()
    }
    catch (_err) {
        return false
    }
}
