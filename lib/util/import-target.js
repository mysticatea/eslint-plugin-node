/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path");
var exists = require("./exists");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Resolves the file.
 *
 * @param {string} basedir - The path of base directory to resolve relative path.
 * @param {string} name - The name of an import target.
 * @param {string[]} exts - Extensions that it checks whether or not the file exists.
 * @returns {string} Resolved path.
 */
function resolve(basedir, name, exts) {
    var resolvedPath = path.resolve(basedir, name);

    // Checks with extensions.
    if (!exists(resolvedPath)) {
        for (var i = 0; i < exts.length; ++i) {
            var ext = exts[i];

            if (exists(resolvedPath + ext)) {
                return resolvedPath + ext;
            }
        }
    }

    return resolvedPath;
}

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
 * Information of an import target.
 *
 * @constructor
 * @param {ASTNode} node - The node of a `require()` or a module declaraiton.
 * @param {string} name - The name of an import target.
 * @param {string} basedir - The path of base directory to resolve relative path.
 * @param {string[]} exts - Extensions that it checks whether or not the file exists.
 */
module.exports = function ImportTarget(node, name, basedir, exts) {
    var relative = /^\./.test(name);

    /**
     * The node of a `require()` or a module declaraiton.
     * @type {ASTNode}
     */
    this.node = node;

    /**
     * The name of this import target.
     * @type {string}
     */
    this.name = name;

    /**
     * The full path of this import target.
     * If the target is a module then this is `null`.
     * @type {string|null}
     */
    this.filePath = relative ? resolve(basedir, name, exts) : null;

    /**
     * The module name of this import target.
     * If the target is a relative path then this is `null`.
     * @type {string|null}
     */
    this.moduleName = relative ? null : getModuleName(name);
};
