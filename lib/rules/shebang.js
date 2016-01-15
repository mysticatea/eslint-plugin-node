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
var getConvertPath = require("../util/get-convert-path");
var getPackageJson = require("../util/get-package-json");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var NODE_SHEBANG = "#!/usr/bin/env node\n";
var SHEBANG_PATTERN = /^#\!.+?\n/;

/**
 * Checks whether or not a given path is a `bin` file.
 *
 * @param {string} filePath - A file path to check.
 * @param {string|object|undefined} binField - A value of the `bin` field of `package.json`.
 * @param {string} basedir - A directory path that `package.json` exists.
 * @returns {boolean} `true` if the file is a `bin` file.
 */
function isBinFile(filePath, binField, basedir) {
    if (!binField) {
        return false;
    }
    if (typeof binField === "string") {
        return filePath === path.resolve(basedir, binField);
    }
    return Object.keys(binField).some(function(key) {
        return filePath === path.resolve(basedir, binField[key]);
    });
}

/**
 * Gets the shebang line (includes a line ending) from a given code.
 *
 * @param {SourceCode} sourceCode - A source code object to check.
 * @returns {string} shebang if exists. Otherwise an empty string.
 */
function getShebang(sourceCode) {
    var m = SHEBANG_PATTERN.exec(sourceCode.text);
    return (m && m[0]) || "";
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var filePath = context.getFilename();
    if (filePath === "<input>") {
        return {};
    }
    filePath = path.resolve(filePath);

    var p = getPackageJson(filePath);
    if (!p) {
        return {};
    }

    var basedir = path.dirname(p.filePath);
    filePath = path.join(
        basedir,
        getConvertPath(context)(path.relative(basedir, filePath).replace(/\\/g, "/"))
    );

    var needsShebang = isBinFile(filePath, p.bin, basedir);
    var shebang = getShebang(context.getSourceCode());
    if (needsShebang ? shebang === NODE_SHEBANG : !shebang) {
        return {};
    }

    if (needsShebang) {
        return {
            Program: function(node) {
                context.report({
                    node: node,
                    message: "This file needs shebang \"#!/usr/bin/env node\".",
                    fix: function(fixer) {
                        if (shebang) {
                            return fixer.replaceTextRange([0, shebang.length], NODE_SHEBANG);
                        }
                        return fixer.insertTextBeforeRange([0, 0], NODE_SHEBANG);
                    }
                });
            }
        };
    }
    return {
        Program: function(node) {
            context.report({
                node: node,
                message: "This file needs no shebang.",
                fix: function(fixer) {
                    return fixer.removeRange([0, shebang.length]);
                }
            });
        }
    };
};

module.exports.schema = [
    {
        type: "object",
        properties: {
            convertPath: {
                type: "object",
                properties: {},
                patternProperties: {
                    "^.+$": {
                        type: "array",
                        items: {type: "string"},
                        minItems: 2,
                        maxItems: 2
                    }
                },
                additionalProperties: false
            }
        },
        additionalProperties: false
    }
];
