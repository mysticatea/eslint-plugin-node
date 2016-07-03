/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var semver = require("semver")
var features = require("../util/features")
var getPackageJson = require("../util/get-package-json")
var getValueIfString = require("../util/get-value-if-string")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var VERSIONS = [0.10, 0.12, 4, 5, 6]
var OPTIONS = Object.keys(features)
var FUNC_TYPE = /^(?:Arrow)?Function(?:Declaration|Expression)$/
var CLASS_TYPE = /^Class(?:Declaration|Expression)$/
var DESTRUCTURING_PARENT_TYPE = /^(?:Function(?:Declaration|Expression)|ArrowFunctionExpression|AssignmentExpression|VariableDeclarator)$/
var BINARY_NUMBER = /^0[bB]/
var OCTAL_NUMBER = /^0[oO]/
var UNICODE_ESC = /\\u\{.+?\}/
var GET_OR_SET = /^(?:g|s)et$/
var NEW_BUILTIN_TYPES = [
    "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array",
    "Int32Array", "Uint32Array", "Float32Array", "Float64Array", "DataView",
    "Map", "Set", "WeakMap", "WeakSet", "Proxy", "Reflect", "Promise", "Symbol",
]
var SUBCLASSING_TEST_TARGETS = [
    "Array", "RegExp", "Function", "Promise", "Boolean", "Number", "String",
    "Map", "Set",
]
var PROPERTY_TEST_TARGETS = {
    Object: ["assign", "is", "getOwnPropertySymbols", "setPrototypeOf"],
    String: ["raw", "fromCodePoint"],
    Array: ["from", "of"],
    Number: [
        "isFinite", "isInteger", "isSafeInteger", "isNaN", "EPSILON",
        "MIN_SAFE_INTEGER", "MAX_SAFE_INTEGER",
    ],
    Math: [
        "clz32", "imul", "sign", "log10", "log2", "log1p", "expm1", "cosh",
        "sinh", "tanh", "acosh", "asinh", "atanh", "trunc", "fround", "cbrt",
        "hypot",
    ],
    Symbol: [
        "hasInstance", "isConcatSpreadablec", "iterator", "species", "replace",
        "search", "split", "match", "toPrimitive", "toStringTag", "unscopables",
    ],
}

/**
 * Gets major version of 'semver.Comparator'.
 *
 * @param {semver.Comparator} comparator - A comparator to get.
 * @returns {number} The major version of the comparator.
 */
function parseVersion(comparator) {
    var major = comparator.semver.major
    var minor = comparator.semver.minor

    if (major >= 1) {
        return major
    }
    if (minor >= 10) {
        return parseFloat("0." + minor)
    }
    return 0.10
}

/**
 * Gets default version configuration of this rule.
 *
 * This finds and reads 'package.json' file, then parses 'engines.node' field.
 * If it's nothing, this returns '0.10'.
 *
 * @param {string} filename - The file name of the current linting file.
 * @returns {number} The default version configuration.
 */
function getDefaultVersion(filename) {
    var info = getPackageJson(filename)
    var nodeVersion = info && info.engines && info.engines.node

    try {
        var range = new semver.Range(nodeVersion)
        var comparators = Array.prototype.concat.apply([], range.set)
        var version = comparators.reduce(
            function(minVersion, comparator) {
                var op = comparator.operator

                if (op === "" || op === ">" || op === ">=") {
                    return Math.min(minVersion, parseVersion(comparator))
                }
                return minVersion
            },
            Number.POSITIVE_INFINITY
        )

        if (Number.isFinite(version)) {
            return version
        }
    }
    catch (_err) {
        // ignore
    }

    return 0.10
}

/**
 * Gets values of the `ignores` option.
 *
 * @returns {string[]} Values of the `ignores` option.
 */
function getIgnoresEnum() {
    return Object.keys(OPTIONS.reduce(
        function(retv, key) {
            features[key].alias.forEach(function(alias) {
                retv[alias] = true
            })
            retv[key] = true
            return retv
        },
        Object.create(null)
    ))
}

/**
 * Checks whether a given key should be ignored or not.
 *
 * @param {string} key - A key to check.
 * @param {string[]} ignores - An array of keys and aliases to be ignored.
 * @returns {boolean} `true` if the key should be ignored.
 */
function isIgnored(key, ignores) {
    return (
        ignores.indexOf(key) !== -1 ||
        features[key].alias.some(function(alias) {
            return ignores.indexOf(alias) !== -1
        })
    )
}

/**
 * Parses the options.
 *
 * @param {object} options - An option object to parse.
 * @returns {object} Parsed value.
 */
function parseOptions(options) {
    var version = 0
    var ignores = null

    if (typeof options === "number") {
        version = options
        ignores = []
    }
    else {
        version = options.version
        ignores = options.ignores || []
    }

    return Object.freeze({
        version: version < 1 ? version.toFixed(2) : version.toFixed(0),
        features: Object.freeze(OPTIONS.reduce(
            function(retv, key) {
                var feature = features[key]

                if (isIgnored(key, ignores)) {
                    retv[key] = Object.freeze({
                        name: feature.name,
                        singular: Boolean(feature.singular),
                        supported: true,
                        supportedInStrict: true,
                    })
                }
                else if (typeof feature.node === "number") {
                    retv[key] = Object.freeze({
                        name: feature.name,
                        singular: Boolean(feature.singular),
                        supported: version >= feature.node,
                        supportedInStrict: version >= feature.node,
                    })
                }
                else {
                    retv[key] = Object.freeze({
                        name: feature.name,
                        singular: Boolean(feature.singular),
                        supported: version >= feature.node.sloppy,
                        supportedInStrict: version >= feature.node.strict,
                    })
                }

                return retv
            },
            Object.create(null)
        )),
    })
}

/**
 * Checks whether or not the current configure has a special lexical environment.
 * If it's modules or globalReturn then it has a special lexical environment.
 *
 * @param {RuleContext} context - A context to check.
 * @returns {boolean} `true` if the current configure is modules or globalReturn.
 */
function checkSpecialLexicalEnvironment(context) {
    var parserOptions = context.parserOptions
    var ecmaFeatures = parserOptions.ecmaFeatures
    return Boolean(
        parserOptions.sourceType === "module" ||
        (ecmaFeatures && ecmaFeatures.globalReturn)
    )
}

/**
 * Gets the name of a given node.
 *
 * @param {ASTNode} node - An Identifier node to get.
 * @returns {string} The name of the node.
 */
function getIdentifierName(node) {
    return node.name
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var sourceCode = context.getSourceCode()
    var supportInfo = parseOptions(
        context.options[0] || getDefaultVersion(context.getFilename())
    )
    var hasSpecialLexicalEnvironment = checkSpecialLexicalEnvironment(context)

    /**
     * Does an given action for each reference of the specified global variables.
     *
     * @param {string[]} names - Variable names to get.
     * @param {function} f - An action for each reference.
     * @returns {void}
     */
    function eachReferences(names, f) {
        var globalScope = context.getScope()

        for (var i = 0; i < names.length; ++i) {
            var name = names[i]
            var variable = globalScope.set.get(name)

            if (variable && variable.defs.length === 0) {
                variable.references.forEach(f)
            }
        }
    }

    /**
     * Checks whether or not the current scope is strict mode.
     *
     * @returns {boolean}
     *      `true` if the current scope is strict mode. Otherwise `false`.
     */
    function isStrict() {
        var scope = context.getScope()
        if (scope.type === "global" && hasSpecialLexicalEnvironment) {
            scope = scope.childScopes[0]
        }
        return scope.isStrict
    }

    /**
     * Reports a given node if the specified feature is not supported.
     *
     * @param {ASTNode} node - A node to be reported.
     * @param {string} key - A feature name to report.
     * @returns {void}
     */
    function report(node, key) {
        var version = supportInfo.version
        var feature = supportInfo.features[key]
        if (feature.supported) {
            return
        }

        if (!feature.supportedInStrict) {
            context.report({
                node: node,
                message: "{{feature}} {{be}} not supported yet on Node v{{version}}.",
                data: {
                    feature: feature.name,
                    be: feature.singular ? "is" : "are",
                    version: version,
                },
            })
        }
        else if (!isStrict()) {
            context.report({
                node: node,
                message: "{{feature}} {{be}} not supported yet on Node v{{version}}.",
                data: {
                    feature: feature.name + " in non-strict mode",
                    be: feature.singular ? "is" : "are",
                    version: version,
                },
            })
        }
    }

    return {
        //----------------------------------------------------------------------
        // Program
        //----------------------------------------------------------------------

        "Program:exit": function() {
            // Check new global variables.
            NEW_BUILTIN_TYPES.forEach(function(name) {
                eachReferences([name], function(reference) {
                    report(reference.identifier, name)
                })
            })

            // Check static methods.
            eachReferences(
                Object.keys(PROPERTY_TEST_TARGETS),
                function(reference) {
                    var node = reference.identifier
                    var parentNode = node.parent
                    if (parentNode.type !== "MemberExpression" ||
                        parentNode.object !== node
                    ) {
                        return
                    }

                    var objectName = node.name
                    var properties = PROPERTY_TEST_TARGETS[objectName]
                    var propertyName = (parentNode.computed ? getValueIfString : getIdentifierName)(parentNode.property)
                    if (propertyName && properties.indexOf(propertyName) !== -1) {
                        report(parentNode, objectName + "." + propertyName)
                    }
                }
            )

            // Check subclassing
            eachReferences(
                SUBCLASSING_TEST_TARGETS,
                function(reference) {
                    var node = reference.identifier
                    var parentNode = node.parent
                    if (CLASS_TYPE.test(parentNode.type) &&
                        parentNode.superClass === node
                    ) {
                        report(node, "extends" + node.name)
                    }
                }
            )
        },

        //----------------------------------------------------------------------
        // Functions
        //----------------------------------------------------------------------

        "ArrowFunctionExpression": function(node) {
            report(node, "arrowFunctions")
        },

        "AssignmentPattern": function(node) {
            if (FUNC_TYPE.test(node.parent.type)) {
                report(node, "defaultParameters")
            }
        },

        "FunctionDeclaration": function(node) {
            var scope = context.getScope().upper
            if (scope.type !== "global" && scope.type !== "function") {
                report(node, "blockScopedFunctions")
            }
            if (node.generator) {
                report(node, "generatorFunctions")
            }
        },

        "FunctionExpression": function(node) {
            if (node.generator) {
                report(node, "generatorFunctions")
            }
        },

        "MetaProperty": function(node) {
            var meta = node.meta.name || node.meta
            var property = node.property.name || node.property
            if (meta === "new" && property === "target") {
                report(node, "new.target")
            }
        },

        "RestElement": function(node) {
            if (FUNC_TYPE.test(node.parent.type)) {
                report(node, "restParameters")
            }
        },

        //----------------------------------------------------------------------
        // Classes
        //----------------------------------------------------------------------

        "ClassDeclaration": function(node) {
            report(node, "classes")
        },

        "ClassExpression": function(node) {
            report(node, "classes")
        },

        //----------------------------------------------------------------------
        // Statements
        //----------------------------------------------------------------------

        "ForOfStatement": function(node) {
            report(node, "forOf")
        },

        "VariableDeclaration": function(node) {
            if (node.kind === "const") {
                report(node, "const")
            }
            else if (node.kind === "let") {
                report(node, "let")
            }
        },

        //----------------------------------------------------------------------
        // Expressions
        //----------------------------------------------------------------------

        "ArrayPattern": function(node) {
            if (DESTRUCTURING_PARENT_TYPE.test(node.parent.type)) {
                report(node, "destructuring")
            }
        },

        "Identifier": function(node) {
            var raw = sourceCode.getText(node)
            if (UNICODE_ESC.test(raw)) {
                report(node, "unicodeCodePointEscapes")
            }
        },

        "Literal": function(node) {
            if (typeof node.value === "number") {
                if (BINARY_NUMBER.test(node.raw)) {
                    report(node, "binaryNumberLiterals")
                }
                else if (OCTAL_NUMBER.test(node.raw)) {
                    report(node, "octalNumberLiterals")
                }
            }
            else if (typeof node.value === "string") {
                if (UNICODE_ESC.test(node.raw)) {
                    report(node, "unicodeCodePointEscapes")
                }
            }
            else if (node.regex) {
                if (node.regex.flags.indexOf("y") !== -1) {
                    report(node, "regexpY")
                }
                if (node.regex.flags.indexOf("u") !== -1) {
                    report(node, "regexpU")
                }
            }
        },

        "NewExpression": function(node) {
            if (node.callee.type === "Identifier" &&
                node.callee.name === "RegExp" &&
                node.arguments.length === 2 &&
                node.arguments[1].type === "Literal" &&
                typeof node.arguments[1].value === "string"
            ) {
                if (node.arguments[1].value.indexOf("y") !== -1) {
                    report(node, "regexpY")
                }
                if (node.arguments[1].value.indexOf("u") !== -1) {
                    report(node, "regexpU")
                }
            }
        },

        "ObjectPattern": function(node) {
            if (DESTRUCTURING_PARENT_TYPE.test(node.parent.type)) {
                report(node, "destructuring")
            }
        },

        "Property": function(node) {
            if (node.parent.type === "ObjectExpression" &&
                (node.computed || node.shorthand || node.method)
            ) {
                if (node.shorthand && GET_OR_SET.test(node.key.name)) {
                    report(node, "objectPropertyShorthandOfGetSet")
                }
                else {
                    report(node, "objectLiteralExtensions")
                }
            }
        },

        "SpreadElement": function(node) {
            report(node, "spreadOperators", 5)
        },

        "TemplateLiteral": function(node) {
            report(node, "templateStrings")
        },

        //----------------------------------------------------------------------
        // Modules
        //----------------------------------------------------------------------

        "ExportAllDeclaration": function(node) {
            report(node, "modules")
        },

        "ExportDefaultDeclaration": function(node) {
            report(node, "modules")
        },

        "ExportNamedDeclaration": function(node) {
            report(node, "modules")
        },

        "ImportDeclaration": function(node) {
            report(node, "modules")
        },
    }
}

module.exports.schema = [
    {
        oneOf: [
        {enum: VERSIONS},
            {
                type: "object",
                properties: {
                    version: {enum: VERSIONS},
                    ignores: {
                        type: "array",
                        items: {enum: getIgnoresEnum()},
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
                required: ["version"],
            },
        ],
    },
]
