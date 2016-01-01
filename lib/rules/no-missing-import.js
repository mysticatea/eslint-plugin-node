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
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var filePath = context.getFilename();
    if (filePath === "<input>") {
        return {};
    }

    /**
     * Checks the `source` of a given node is valid.
     *
     * @param {ASTNode} node - A node to check.
     * @returns {void}
     */
    function checkForImportExport(node) {
        var name = getValueIfString(node.source);
        if (!name || resolve.isCore(name)) {
            return;
        }

        var targets = [{
            node: node.source,
            name: name,
            relative: /^\./.test(name)
        }];
        checkExistence(context, filePath, targets);
    }

    return {
        ImportDeclaration: checkForImportExport,
        ExportNamedDeclaration: checkForImportExport,
        ExportDefaultDeclaration: checkForImportExport,
        ExportAllDeclaration: checkForImportExport
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
