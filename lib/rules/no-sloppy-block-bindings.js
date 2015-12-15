/**
 * @fileoverview Rule to disallow block-scoped declarations outside strict mode.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    /**
     * Reports a given node if it's in sloppy mode.
     * @param {ASTNode} node - A node to report.
     * @returns {void}
     */
    function reportIfInSloppy(node) {
        var scope = context.getScope();
        if (!scope.isStrict) {
            context.report({
                message: "Block-scoped declarations (let, const, function, class) not yet supported outside strict mode.",
                node: node
            });
        }
    }

    // In modules, all are OK.
    if ((context.parserOptions && context.parserOptions.sourceType === "module") ||
        (context.ecmaFeatures && context.ecmaFeatures.modules)
    ) {
        return {};
    }

    return {
        ClassDeclaration: reportIfInSloppy,
        ClassExpression: reportIfInSloppy,
        FunctionDeclaration: function(node) {
            var scope = context.getScope().upper;
            if (scope.type !== "global" && scope.type !== "function") {
                reportIfInSloppy(node);
            }
        },
        VariableDeclaration: function(node) {
            if (node.kind === "let" || node.kind === "const") {
                reportIfInSloppy(node);
            }
        }
    };
};

module.exports.schema = [];
