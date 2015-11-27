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
var checkPublish = require("../util/check-publish");
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
        if (!node || node.name !== "require" || !isCallee(node)) {
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
    return {
        "Program:exit": function() {
            var filePath = context.getFilename();
            if (filePath !== "<input>") {
                var targets = getRequireTargets(context.getScope().through);
                checkExistence(context, filePath, targets);
                checkPublish(context, filePath, targets);
            }
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
