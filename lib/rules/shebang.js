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
var SHEBANG_PATTERN = /^(\uFEFF)?(#!.+?)?(\r)?\n/;

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
 * @returns {{length: number, bom: boolean, shebang: string, cr: boolean}}
 *      shebang's information.
 *      `retv.shebang` is an empty string if shebang doesn't exist.
 */
function getShebangInfo(sourceCode) {
    var m = SHEBANG_PATTERN.exec(sourceCode.text);

    // ESLint v1 has BOM in text.
    // ESLint v2 strips BOM from text, and has the "hasBOM" property.
    return {
        bomIndex: (typeof sourceCode.hasBOM === "boolean" ? -1 : 0),
        bom: (typeof sourceCode.hasBOM === "boolean" ? sourceCode.hasBOM : Boolean(m && m[1])),
        cr: Boolean(m && m[3]),
        length: (m && m[0].length || (sourceCode.text.charCodeAt(0) === 0xFEFF ? 1 : 0)),
        shebang: (m && m[2] && (m[2] + "\n") || "")
    };
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var sourceCode = context.getSourceCode();
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
    var info = getShebangInfo(sourceCode);

    return {
        Program: function(node) {
            if (needsShebang ? info.shebang === NODE_SHEBANG : !info.shebang) {
                // Good the shebang target.
                // Checks BOM and \r.
                if (needsShebang && info.bom) {
                    context.report({
                        node: node,
                        message: "This file must not have Unicode BOM.",
                        fix: function(fixer) {
                            return fixer.removeRange([info.bomIndex, info.bomIndex + 1]);
                        }
                    });
                }
                if (needsShebang && info.cr) {
                    context.report({
                        node: node,
                        message: "This file must have Unix linebreaks (LF).",
                        fix: function(fixer) {
                            var index = sourceCode.text.indexOf("\r");
                            return fixer.removeRange([index, index + 1]);
                        }
                    });
                }
            }
            else if (needsShebang) {
                // Shebang is lacking.
                context.report({
                    node: node,
                    message: "This file needs shebang \"#!/usr/bin/env node\".",
                    fix: function(fixer) {
                        return fixer.replaceTextRange([info.bomIndex, info.length], NODE_SHEBANG);
                    }
                });
            }
            else {
                // Shebang is extra.
                context.report({
                    node: node,
                    message: "This file needs no shebang.",
                    fix: function(fixer) {
                        return fixer.removeRange([0, info.length]);
                    }
                });
            }
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
                additionalProperties: {
                    type: "array",
                    items: {type: "string"},
                    minItems: 2,
                    maxItems: 2
                }
            }
        },
        additionalProperties: false
    }
];
