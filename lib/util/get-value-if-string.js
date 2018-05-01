/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

/**
 * Gets the value of a given node if it's a literal or a template literal.
 *
 * @param {ASTNode} node - A node to get.
 * @returns {string|null} The value of the node, or `null`.
 */
module.exports = function getValueIfString(node) {
    if (!node) {
        return null
    }

    switch (node.type) {
        case "Literal":
            if (typeof node.value === "string") {
                return node.value
            }
            break

        case "TemplateLiteral":
            if (node.expressions.length === 0) {
                return node.quasis[0].value.cooked
            }
            break

        // no default
    }

    return null
}
