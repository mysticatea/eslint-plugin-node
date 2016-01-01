/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var resolve = require("resolve");
var checkExistence = require("../util/check-existence");
var getValueIfString = require("../util/get-value-if-string");

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

/**
 * Gets a list of `require()` targets.
 *
 * Core modules of Node.js (e.g. `fs`, `http`) are excluded.
 *
 * @param {escope.Reference[]} references - References to search. This is
 *      `through` of the global scope.
 * @returns {TargetInfo[]} A list of found target's information.
 */
function getRequireTargets(references) {
    var retv = [];

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
            retv.push({
                node: targetNode,
                name: name,
                relative: /^\./.test(name)
            });
        }
    }

    return retv;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var filePath = context.getFilename();
    if (filePath === "<input>") {
        return {};
    }

    return {
        "Program:exit": function() {
            var references = getReferencesOfRequire(context.getScope());
            var targets = getRequireTargets(references);
            checkExistence(context, filePath, targets);
        }
    };
};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "publish": {"type": ["string", "null"]}
        },
        "additionalProperties": false
    }
];
