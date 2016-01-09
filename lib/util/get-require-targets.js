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
var resolve = require("resolve");
var getTryExtensions = require("./get-try-extensions");
var ImportTarget = require("./import-target");

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
    return node.parent.type === "CallExpression" && node.parent.callee === node;
}

/**
 * Checks the name of a given reference is "require".
 *
 * @param {escope.Reference} reference - A reference to check.
 * @returns {boolean} `true` if the reference is "require".
 */
function isRequire(reference) {
    return reference.identifier.name === "require";
}

/**
 * Gets the value of a given node if it's a literal or a template literal.
 *
 * @param {ASTNode} node - A node to get.
 * @returns {string|null} The value of the node, or `null`.
 */
function getValueIfString(node) {
    if (!node) {
        return null;
    }

    switch (node.type) {
        case "Literal":
            if (typeof node.value === "string") {
                return node.value;
            }
            break;

        case "TemplateLiteral":
            if (node.expressions.length === 0) {
                return node.quasis[0].value.cooked;
            }
            break;

        // no default
    }

    return null;
}

/**
 * Gets references of "require".
 *
 * @param {escope.Scope} scope - The global scope.
 * @returns {escope.Reference[]} References of "require".
 */
function getReferencesOfRequire(scope) {
    var variable = scope.set.get("require");
    if (!variable) {
        // Not found.
        return [];
    }
    // Since ESLint v2.
    if (variable.references.length > 0) {
        return variable.references;
    }
    // Fallback for ESLint v1.
    return scope.through.filter(isRequire);
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
    var retv = [];
    var basedir = path.dirname(path.resolve(context.getFilename()));
    var references = getReferencesOfRequire(context.getScope());
    var extensions = getTryExtensions(context);

    for (var i = 0; i < references.length; ++i) {
        var reference = references[i];
        var node = reference.identifier;

        // Skips if it's not a call of `require`.
        if (!isCallee(node)) {
            continue;
        }

        // Gets the target module.
        var targetNode = node.parent.arguments[0];
        var name = getValueIfString(targetNode);
        if (name && !resolve.isCore(name)) {
            retv.push(new ImportTarget(targetNode, name, basedir, extensions));
        }
    }

    return retv;
};
