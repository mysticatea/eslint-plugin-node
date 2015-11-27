/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path");
var getPackageJson = require("../util/get-package-json");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether or not a given path is a `bin` file.
 *
 * @param {string} filePath - A file path to check.
 * @returns {boolean} `true` if the file is a `bin` file.
 */
function isBinFile(filePath) {
    var packageInfo = getPackageJson(filePath);
    if (!packageInfo || !packageInfo.bin) {
        return false;
    }

    var packageDir = path.dirname(packageInfo.filePath);
    var binField = packageInfo.bin;
    if (typeof binField === "string") {
        return filePath === path.resolve(packageDir, binField);
    }
    return Object.keys(binField).some(function(key) {
        return filePath === path.resolve(packageDir, binField[key]);
    });
}

/**
 * Checks whether or not a given code has the valid shebang for Node.js.
 *
 * @param {SourceCode} sourceCode - A source code object to check.
 * @returns {boolean} `true` if the source code has the valid shebang.
 */
function hasShebang(sourceCode) {
    return /^#\!\/usr\/bin\/env node\n/.test(sourceCode.text);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var sourceCode = context.getSourceCode();

    return {
        "Program": function(node) {
            var filePath = context.getFilename();
            if (filePath === "<input>") {
                return;
            }

            var needsShebang = isBinFile(filePath);
            var shebang = hasShebang(sourceCode);
            if (needsShebang === shebang) {
                return;
            }

            if (needsShebang) {
                context.report({
                    node: node,
                    message: "This file needs shebang \"#!/usr/bin/env node\"."
                });
            } else if (shebang) {
                context.report({
                    node: node,
                    message: "This file needs no shebang."
                });
            }
        }
    };
};

module.exports.schema = [];
