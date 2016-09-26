/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/*istanbul ignore next */
/**
 * This function is copied from https://github.com/eslint/eslint/blob/2355f8d0de1d6732605420d15ddd4f1eee3c37b6/lib/ast-utils.js#L648-L684
 * (This utility had been added in v3.3.0)
 *
 * @param {ASTNode} node - The node to get.
 * @returns {string|null} The property name if static. Otherwise, null.
 */
function getStaticPropertyName(node) {
    var prop = null

    switch (node && node.type) {
        case "Property":
        case "MethodDefinition":
            prop = node.key
            break

        case "MemberExpression":
            prop = node.property
            break

        // no default
    }

    switch (prop && prop.type) {
        case "Literal":
            return String(prop.value)

        case "TemplateLiteral":
            if (prop.expressions.length === 0 && prop.quasis.length === 1) {
                return prop.quasis[0].value.cooked
            }
            break

        case "Identifier":
            if (!node.computed) {
                return prop.name
            }
            break

        // no default
    }

    return null
}

/**
 * Checks whether the given node is assignee or not.
 *
 * @param {ASTNode} node - The node to check.
 * @returns {boolean} `true` if the node is assignee.
 */
function isAssignee(node) {
    return (
        node.parent.type === "AssignmentExpression" &&
        node.parent.left === node
    )
}

/**
 * Gets the top assignment expression node if the given node is an assignee.
 *
 * This is used to distinguish 2 assignees belong to the same assignment.
 * If the node is not an assignee, this returns null.
 *
 * @param {ASTNode} leafNode - The node to get.
 * @returns {ASTNode|null} The top assignment expression node, or null.
 */
function getTopAssignment(leafNode) {
    var node = leafNode

    // Skip MemberExpressions.
    while (node.parent.type === "MemberExpression" && node.parent.object === node) {
        node = node.parent
    }

    // Check assignments.
    if (!isAssignee(node)) {
        return null
    }

    // Find the top.
    while (node.parent.type === "AssignmentExpression") {
        node = node.parent
    }

    return node
}

/**
 * Gets top assignment nodes of the given node list.
 *
 * @param {ASTNode[]} nodes - The node list to get.
 * @returns {ASTNode[]} Gotten top assignment nodes.
 */
function createAssignmentList(nodes) {
    return nodes.map(getTopAssignment).filter(Boolean)
}

/**
 * Gets the parent node of the given reference.
 *
 * @param {escope.Reference} reference - The reference to get.
 * @returns {ASTNode} The parent node of the reference.
 */
function getParentNodeOfReference(reference) {
    return reference.identifier.parent
}

/**
 * Gets the node of the given reference.
 *
 * @param {escope.Reference} reference - The reference to get.
 * @returns {ASTNode} The node of the reference.
 */
function getNodeOfReference(reference) {
    return reference.identifier
}

/**
 * Checks whether the given node is the member access to `exports` property.
 *
 * @param {ASTNode} node - The node to check.
 * @returns {boolean} `true` if the node is the member access to `exports` property.
 */
function isExportsMember(node) {
    return (
        node.type === "MemberExpression" &&
        getStaticPropertyName(node) === "exports"
    )
}

/**
 * Gets the reference of `module.exports` from the given scope.
 *
 * @param {escope.Scope} scope - The scope to get.
 * @returns {ASTNode[]} Gotten MemberExpression node list.
 */
function getModuleExportsNodes(scope) {
    var variable = scope.set.get("module")
    if (variable == null) {
        return []
    }
    return variable.references
        .map(getParentNodeOfReference)
        .filter(isExportsMember)
}

/**
 * Gets the reference of `exports` from the given scope.
 *
 * @param {escope.Scope} scope - The scope to get.
 * @returns {ASTNode[]} Gotten Identifier node list.
 */
function getExportsNodes(scope) {
    var variable = scope.set.get("exports")
    if (variable == null) {
        return []
    }
    return variable.references.map(getNodeOfReference)
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce either `module.exports` or `exports`.",
            category: "Stylistic Issues",
            recommended: false,
        },
        fixable: false,
        schema: [
            {enum: ["module.exports", "exports"]},
            {
                type: "object",
                properties: {allowBatchAssign: {type: "boolean"}},
                additionalProperties: false,
            },
        ],
    },

    create: function(context) {
        var mode = context.options[0] || "module.exports"
        var batchAssignAllowed = Boolean(
            context.options[1] != null &&
            context.options[1].allowBatchAssign
        )

        /**
         * Enforces `module.exports`.
         * This warns references of `exports`.
         *
         * @returns {void}
         */
        function enforceModuleExports() {
            var globalScope = context.getScope()
            var exportsNodes = getExportsNodes(globalScope)
            var assignList = batchAssignAllowed
                ? createAssignmentList(getModuleExportsNodes(globalScope))
                : []

            for (var i = 0; i < exportsNodes.length; ++i) {
                var exportsNode = exportsNodes[i]

                // Skip if it's a batch assignment.
                if (assignList.length > 0 &&
                    assignList.indexOf(getTopAssignment(exportsNode)) !== -1
                ) {
                    continue
                }

                // Report.
                context.report({
                    node: exportsNode,
                    loc: exportsNode.loc,
                    message:
                        "Unexpected access to 'exports'. " +
                        "Use 'module.exports' instead.",
                })
            }
        }

        /**
         * Enforces `exports`.
         * This warns references of `module.exports`.
         *
         * @returns {void}
         */
        function enforceExports() {
            var globalScope = context.getScope()
            var exportsNodes = getExportsNodes(globalScope)
            var moduleExportsNodes = getModuleExportsNodes(globalScope)
            var assignList = batchAssignAllowed
                ? createAssignmentList(exportsNodes)
                : []
            var batchAssignList = []

            for (var i = 0; i < moduleExportsNodes.length; ++i) {
                var moduleExportsNode = moduleExportsNodes[i]

                // Skip if it's a batch assignment.
                if (assignList.length > 0) {
                    var found = assignList.indexOf(
                        getTopAssignment(moduleExportsNode)
                    )
                    if (found !== -1) {
                        batchAssignList.push(assignList[found])
                        assignList.splice(found, 1)
                        continue
                    }
                }

                // Report.
                context.report({
                    node: moduleExportsNode,
                    message:
                        "Unexpected access to 'module.exports'. " +
                        "Use 'exports' instead.",
                })
            }

            // Disallow direct assignment to `exports`.
            for (var i = 0; i < exportsNodes.length; ++i) {
                var exportsNode = exportsNodes[i]

                // Skip if it's not assignee.
                if (!isAssignee(exportsNode)) {
                    continue
                }

                // Check if it's a batch assignment.
                if (batchAssignList.indexOf(getTopAssignment(exportsNode)) !== -1) {
                    continue
                }

                // Report.
                context.report({
                    node: exportsNode,
                    message:
                        "Unexpected assignment to 'exports'. " +
                        "Don't modify 'exports' itself.",
                })
            }
        }

        return {
            "Program:exit": function() {
                switch (mode) {
                    case "module.exports":
                        enforceModuleExports()
                        break
                    case "exports":
                        enforceExports()
                        break

                    // no default
                }
            },
        }
    },
}
