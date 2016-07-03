/**
 * @fileoverview Rule to disallow deprecated API.
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assign = require("object-assign")
var deprecatedApis = require("../util/deprecated-apis")
var getValueIfString = require("../util/get-value-if-string")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var SENTINEL_TYPE = /^(?:.+?Statement|.+?Declaration|(?:Array|ArrowFunction|Assignment|Call|Class|Function|Member|New|Object)Expression|AssignmentPattern|Program|VariableDeclarator)$/

/**
 * Converts from a version number to a version text to display.
 *
 * @param {number} value - A version number to convert.
 * @returns {string} Covnerted text.
 */
function toVersionText(value) {
    if (value < 1) {
        return value.toFixed(2)
    }
    return String(value)
}

/**
 * Makes a replacement message.
 *
 * @param {string|null} replacedBy - The text of substitute way.
 * @returns {string} Replacement message.
 */
function toReplaceMessage(replacedBy) {
    return replacedBy ? " Use " + replacedBy + " instead." : ""
}

/**
 * Gets the property name from a MemberExpression node or a Property node.
 *
 * @param {ASTNode} node - A node to get.
 * @returns {string|null} The property name of the node.
 */
function getPropertyName(node) {
    switch (node.type) {
        case "MemberExpression":
            if (node.computed) {
                return getValueIfString(node.property)
            }
            return node.property.name

        case "Property":
            if (node.computed) {
                return getValueIfString(node.key)
            }
            if (node.key.type === "Literal") {
                return String(node.key.value)
            }
            return node.key.name

        // no default
    }

    /* istanbul ignore next: unreachable */
    return null
}

/**
 * Checks a given reference is readable.
 *
 * @param {escope.Reference} reference - A reference to check.
 * @returns {boolean} `true` if the reference is readable.
 */
function isReadReference(reference) {
    return reference.isRead()
}

/**
 * Checks a given node is a ImportDeclaration node.
 *
 * @param {ASTNode} node - A node to check.
 * @returns {boolean} `true` if the node is a ImportDeclaration node.
 */
function isImportDeclaration(node) {
    return node.type === "ImportDeclaration"
}

/**
 * Finds the variable object of a given Identifier node.
 *
 * @param {ASTNode} node - An Identifier node to find.
 * @param {escope.Scope} initialScope - A scope to start searching.
 * @returns {escope.Variable} Found variable object.
 */
function findVariable(node, initialScope) {
    var location = node.range[0]
    var variable = null

    // Dive into the scope that the node exists.
    for (var i = 0; i < initialScope.childScopes.length; ++i) {
        var childScope = initialScope.childScopes[i]
        var range = childScope.block.range

        if (range[0] <= location && location < range[1]) {
            variable = findVariable(node, childScope)
            if (variable != null) {
                return variable
            }
        }
    }

    // Find the variable of that name in this scope or ancestor scopes.
    var scope = initialScope
    while (scope != null) {
        variable = scope.set.get(node.name)
        if (variable != null) {
            return variable
        }

        scope = scope.upper
    }

    return null
}

/**
 * Traverses the references of a given variable as calling a given predicate.
 *
 * @param {escope.Variable} variable - A variable to traverse references.
 * @param {function} f - A predicate to call.
 * @returns {void}
 */
function eachReadReferences(variable, f) {
    variable.references.filter(isReadReference).forEach(f)
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var globalScope = null

    /**
     * Reports a use of a deprecated API.
     *
     * @param {ASTNode} node - A node to report.
     * @param {string} name - The name of a deprecated API.
     * @param {{since: number, replacedBy: string}} info - Information of the API.
     * @returns {void}
     */
    function report(node, name, info) {
        context.report({
            node: node,
            message: "{{name}} was deprecated since v{{version}}.{{replace}}",
            data: {
                name: name,
                version: toVersionText(info.since),
                replace: toReplaceMessage(info.replacedBy),
            },
        })
    }

    /**
     * Reports a use of a deprecated module.
     *
     * @param {ASTNode} node - A node to report.
     * @param {string} name - The name of a deprecated module.
     * @param {{since: number, replacedBy: string}} info - Information of the module.
     * @returns {void}
     */
    function reportModule(node, name, info) {
        report(node, "'" + name + "' module", info)
    }

    /**
     * Reports a use of a deprecated property.
     *
     * @param {ASTNode} node - A node to report.
     * @param {string[]} path - The path to a deprecated property.
     * @param {{since: number, replacedBy: string}} info - Information of the property.
     * @returns {void}
     */
    function reportConstructor(node, path, info) {
        report(node, "'" + path.join(".") + "' constructor", info)
    }

    /**
     * Reports a use of a deprecated property.
     *
     * @param {ASTNode} node - A node to report.
     * @param {string[]} path - The path to a deprecated property.
     * @param {string} key - The name of the property.
     * @param {{since: number, replacedBy: string}} info - Information of the property.
     * @returns {void}
     */
    function reportProperty(node, path, key, info) {
        report(node, "'" + path.join(".") + "." + key + "'", info)
    }

    /**
     * Checks violations in destructuring assignments.
     *
     * @param {ASTNode} node - A pattern node to check.
     * @param {string[]} path - The path to a deprecated property.
     * @param {object} infoMap - A map of properties' information.
     * @returns {void}
     */
    function checkDestructuring(node, path, infoMap) {
        switch (node.type) {
            case "AssignmentPattern":
                checkDestructuring(node.left, path, infoMap)
                break

            case "Identifier":
                checkVariable(
                    findVariable(node, globalScope),
                    path,
                    infoMap
                )
                break

            case "ObjectPattern":
                node.properties.forEach(function(property) {
                    var key = getPropertyName(property)
                    if (key != null && hasOwnProperty.call(infoMap, key)) {
                        var keyInfo = infoMap[key]
                        if (keyInfo.$deprecated) {
                            reportProperty(property.key, path, key, keyInfo)
                        }
                        else {
                            path.push(key)
                            checkDestructuring(property.value, path, keyInfo)
                            path.pop()
                        }
                    }
                })
                break

            // no default
        }
    }

    /**
     * Checks violations in properties.
     *
     * @param {ASTNode} root - A node to check.
     * @param {string[]} path - The path to a deprecated property.
     * @param {object} infoMap - A map of properties' information.
     * @returns {void}
     */
    function checkProperties(root, path, infoMap) {
        var node = root
        while (!SENTINEL_TYPE.test(node.parent.type)) {
            node = node.parent
        }

        var parent = node.parent
        switch (parent.type) {
            case "CallExpression":
            case "NewExpression":
                var ctorInfo = infoMap.$constructor
                if (parent.callee === node &&
                    ctorInfo != null &&
                    (parent.type === "NewExpression" || ctorInfo.omittableNew)
                ) {
                    reportConstructor(parent, path, ctorInfo)
                }
                break

            case "MemberExpression":
                if (parent.object === node) {
                    var key = getPropertyName(parent)
                    if (key != null && hasOwnProperty.call(infoMap, key)) {
                        var keyInfo = infoMap[key]
                        if (keyInfo.$deprecated) {
                            reportProperty(parent.property, path, key, keyInfo)
                        }
                        else {
                            path.push(key)
                            checkProperties(parent, path, keyInfo)
                            path.pop()
                        }
                    }
                }
                break

            case "AssignmentExpression":
                if (parent.right === node) {
                    checkDestructuring(parent.left, path, infoMap)
                    checkProperties(parent, path, infoMap)
                }
                break

            case "AssignmentPattern":
                if (parent.right === node) {
                    checkDestructuring(parent.left, path, infoMap)
                }
                break

            case "VariableDeclarator":
                if (parent.init === node) {
                    checkDestructuring(parent.id, path, infoMap)
                }
                break

            // no default
        }
    }

    /**
     * Checks violations in the references of a given variable.
     *
     * @param {escope.Variable} variable - A variable to check.
     * @param {string[]} path - The path to a deprecated property.
     * @param {object} infoMap - A map of properties' information.
     * @returns {void}
     */
    function checkVariable(variable, path, infoMap) {
        eachReadReferences(variable, function(reference) {
            checkProperties(reference.identifier, path, infoMap)
        })
    }

    /**
     * Checks violations in a ModuleSpecifier node.
     *
     * @param {ASTNode} node - A ModuleSpecifier node to check.
     * @param {string[]} path - The path to a deprecated property.
     * @param {object} infoMap - A map of properties' information.
     * @returns {void}
     */
    function checkImportSpecifier(node, path, infoMap) {
        switch (node.type) {
            case "ImportSpecifier":
                var key = node.imported.name
                if (hasOwnProperty.call(infoMap, key)) {
                    var keyInfo = infoMap[key]
                    if (keyInfo.$deprecated) {
                        reportProperty(node.imported, path, key, keyInfo)
                    }
                    else {
                        path.push(key)
                        checkVariable(
                            findVariable(node.local, globalScope),
                            path,
                            keyInfo
                        )
                        path.pop()
                    }
                }
                break

            case "ImportDefaultSpecifier":
                checkVariable(
                    findVariable(node.local, globalScope),
                    path,
                    infoMap
                )
                break

            case "ImportNamespaceSpecifier":
                checkVariable(
                    findVariable(node.local, globalScope),
                    path,
                    assign({}, infoMap, {default: infoMap})
                )
                break

            // no default
        }
    }

    /**
     * Checks violations for CommonJS modules.
     * @returns {void}
     */
    function checkCommonJsModules() {
        var infoMap = deprecatedApis.modules
        var variable = globalScope.set.get("require")

        if (variable != null && variable.defs.length === 0) {
            eachReadReferences(variable, function(reference) {
                var id = reference.identifier
                var node = id.parent

                if (node.type === "CallExpression" && node.callee === id) {
                    var key = getValueIfString(node.arguments[0])
                    if (key != null && hasOwnProperty.call(infoMap, key)) {
                        var moduleInfo = infoMap[key]
                        if (moduleInfo.$deprecated) {
                            reportModule(node, key, moduleInfo)
                        }
                        else {
                            checkProperties(node, [key], moduleInfo)
                        }
                    }
                }
            })
        }
    }

    /**
     * Checks violations for ES2015 modules.
     * @param {ASTNode} programNode - A program node to check.
     * @returns {void}
     */
    function checkES2015Modules(programNode) {
        var infoMap = deprecatedApis.modules

        programNode.body.filter(isImportDeclaration).forEach(function(node) {
            var key = node.source.value
            if (hasOwnProperty.call(infoMap, key)) {
                var moduleInfo = infoMap[key]
                if (moduleInfo.$deprecated) {
                    reportModule(node, key, moduleInfo)
                }
                else {
                    node.specifiers.forEach(function(specifier) {
                        checkImportSpecifier(specifier, [key], moduleInfo)
                    })
                }
            }
        })
    }

    /**
     * Checks violations for global variables.
     * @returns {void}
     */
    function checkGlobals() {
        var infoMap = deprecatedApis.globals

        Object.keys(infoMap).forEach(function(key) {
            var keyInfo = infoMap[key]
            var variable = globalScope.set.get(key)

            if (variable != null && variable.defs.length === 0) {
                checkVariable(variable, [key], keyInfo)
            }
        })
    }

    return {
        "Program:exit": function(node) {
            globalScope = context.getScope()

            checkCommonJsModules()
            checkES2015Modules(node)
            checkGlobals()
        },
    }
}

module.exports.schema = []
