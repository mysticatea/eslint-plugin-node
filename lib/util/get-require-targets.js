/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path")
var resolve = require("resolve")
var getTryExtensions = require("./get-try-extensions")
var getValueIfString = require("./get-value-if-string")
var ImportTarget = require("./import-target")
var stripImportPathParams = require("./strip-import-path-params")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether or not a given node is a callee.
 *
 * @param {ASTNode} node - A node to check.
 * @returns {boolean} `true` if the node is a callee.
 */
function isCallee(node) {
    return node.parent.type === "CallExpression" && node.parent.callee === node
}

/**
 * Gets references of "require".
 *
 * @param {escope.Scope} scope - The global scope.
 * @returns {escope.Reference[]} References of "require".
 */
function getReferencesOfRequire(scope) {
    var variable = scope.set.get("require")
    if (!variable) {
        // Not found.
        return []
    }
    return variable.references
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Gets a list of `require()` targets.
 *
 * Core modules of Node.js (e.g. `fs`, `http`) are excluded.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {ImportTarget[]} A list of found target's information.
 */
module.exports = function getRequireTargets(context) {
    var retv = []
    var basedir = path.dirname(path.resolve(context.getFilename()))
    var references = getReferencesOfRequire(context.getScope())
    var extensions = getTryExtensions(context)

    for (var i = 0; i < references.length; ++i) {
        var reference = references[i]
        var node = reference.identifier

        // Skips if it's not a call of `require`.
        if (!isCallee(node)) {
            continue
        }

        // Gets the target module.
        var targetNode = node.parent.arguments[0]
        var rawName = getValueIfString(targetNode)
        var name = rawName && stripImportPathParams(rawName)
        if (name && !resolve.isCore(name)) {
            retv.push(new ImportTarget(targetNode, name, basedir, extensions))
        }
    }

    return retv
}
