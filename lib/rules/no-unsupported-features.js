/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var features = require("../util/features");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var VERSIONS = [0.10, 0.12, 4, 5];
var OPTIONS = Object.keys(features);
var FUNC_TYPE = /^(?:Arrow)?Function(?:Declaration|Expression)$/;
var DESTRUCTURING_PARENT_TYPE = /^(?:Function(?:Declaration|Expression)|ArrowFunctionExpression|AssignmentExpression|VariableDeclarator)$/;
var BINARY_NUMBER = /^0[bB]/;
var OCTAL_NUMBER = /^0[oO]/;
var UNICODE_ESC = /\\u\{.+?\}/;

/**
 * Parses the options.
 *
 * @param {object} options - An option object to parse.
 * @returns {object} Parsed value.
 */
function parseOptions(options) {
    var version, ignores;

    if (typeof options === "number") {
        version = options;
        ignores = [];
    }
    else {
        version = options.version;
        ignores = options.ignores || [];
    }

    return Object.freeze({
        version: version < 1 ? version.toFixed(2) : version.toFixed(0),
        features: Object.freeze(OPTIONS.reduce(
            function(retv, key) {
                var feature = features[key];

                if (ignores.indexOf(key) !== -1) {
                    retv[key] = Object.freeze({
                        name: feature.name,
                        singular: Boolean(feature.singular),
                        supported: true,
                        supportedInStrict: true
                    });
                }
                else if (typeof feature.node === "number") {
                    retv[key] = Object.freeze({
                        name: feature.name,
                        singular: Boolean(feature.singular),
                        supported: version >= feature.node,
                        supportedInStrict: version >= feature.node
                    });
                }
                else {
                    retv[key] = Object.freeze({
                        name: feature.name,
                        singular: Boolean(feature.singular),
                        supported: version >= feature.node.sloppy,
                        supportedInStrict: version >= feature.node.strict
                    });
                }

                return retv;
            },
            Object.create(null)
        ))
    });
}

/**
 * Checks whether or not the current configure has a special lexical environment.
 * If it's modules or globalReturn then it has a special lexical environment.
 *
 * @param {RuleContext} context - A context to check.
 * @returns {boolean} `true` if the current configure is modules or globalReturn.
 */
function checkSpecialLexicalEnvironment(context) {
    var parserOptions = context.parserOptions;
    var ecmaFeatures;

    if (context.parserOptions) {
        ecmaFeatures = parserOptions.ecmaFeatures;
        return Boolean(
            parserOptions.sourceType === "module" ||
            (ecmaFeatures && ecmaFeatures.globalReturn)
        );
    }

    // Backward Compatibility
    ecmaFeatures = context.ecmaFeatures;
    return Boolean(
        ecmaFeatures &&
        (ecmaFeatures.modules || ecmaFeatures.globalReturn)
    );
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var sourceCode = context.getSourceCode();
    var supportInfo = parseOptions(context.options[0] || 0.10);
    var hasSpecialLexicalEnvironment = checkSpecialLexicalEnvironment(context);

    /**
     * Does an given action for each reference of the specified global variables.
     *
     * @param {string[]} names - Variable names to get.
     * @param {function} f - An action for each reference.
     * @returns {void}
     */
    function eachReferences(names, f) {
        var globalScope = context.getScope();

        for (var i = 0; i < names.length; ++i) {
            var name = names[i];
            var variable = globalScope.set.get(name);

            if (variable && variable.defs.length === 0) {
                variable.references.forEach(f);

                // Backward Compatibility
                var references = globalScope.through;
                for (var j = 0; j < references.length; ++j) {
                    var reference = references[j];

                    if (reference.identifier.name === name) {
                        f(reference);
                    }
                }
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
        var scope = context.getScope();
        if (scope.type === "global" && hasSpecialLexicalEnvironment) {
            scope = scope.childScopes[0];
        }
        return scope.isStrict;
    }

    /**
     * Reports a given node if the specified feature is not supported.
     *
     * @param {ASTNode} node - A node to be reported.
     * @param {string} key - A feature name to report.
     * @returns {void}
     */
    function report(node, key) {
        var version = supportInfo.version;
        var feature = supportInfo.features[key];
        if (feature.supported) {
            return;
        }

        if (!feature.supportedInStrict) {
            context.report({
                node: node,
                message: "{{feature}} {{be}} not supported yet on Node v{{version}}.",
                data: {
                    feature: feature.name,
                    be: feature.singular ? "is" : "are",
                    version: version
                }
            });
        }
        else if (!isStrict()) {
            context.report({
                node: node,
                message: "{{feature}} {{be}} not supported yet on Node v{{version}}.",
                data: {
                    feature: feature.name + " in non-strict mode",
                    be: feature.singular ? "is" : "are",
                    version: version
                }
            });
        }
    }

    return {
        //----------------------------------------------------------------------
        // Program
        //----------------------------------------------------------------------

        Program: function() {
            eachReferences(
                [
                    "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array",
                    "Uint16Array", "Int32Array", "Uint32Array", "Float32Array",
                    "Float64Array", "DataView"
                ],
                function(reference) {
                    report(reference.identifier, "typedArrays");
                }
            );
            eachReferences(["Map", "Set"], function(reference) {
                report(reference.identifier, "mapSet");
            });
            eachReferences(["WeakMap", "WeakSet"], function(reference) {
                report(reference.identifier, "weakMapSet");
            });
            eachReferences(["Proxy"], function(reference) {
                report(reference.identifier, "proxy");
            });
            eachReferences(["Reflect"], function(reference) {
                report(reference.identifier, "reflect");
            });
            eachReferences(["Promise"], function(reference) {
                report(reference.identifier, "promise");
            });
            eachReferences(["Symbol"], function(reference) {
                report(reference.identifier, "symbol");
            });
        },

        //----------------------------------------------------------------------
        // Functions
        //----------------------------------------------------------------------

        ArrowFunctionExpression: function(node) {
            report(node, "arrowFunctions");
        },

        AssignmentPattern: function(node) {
            if (FUNC_TYPE.test(node.parent.type)) {
                report(node, "defaultParameters");
            }
        },

        FunctionDeclaration: function(node) {
            var scope = context.getScope().upper;
            if (scope.type !== "global" && scope.type !== "function") {
                report(node, "blockScopedFunctions");
            }
            if (node.generator) {
                report(node, "generatorFunctions");
            }
        },

        FunctionExpression: function(node) {
            if (node.generator) {
                report(node, "generatorFunctions");
            }
        },

        MetaProperty: function(node) {
            var meta = node.meta.name || node.meta;
            var property = node.property.name || node.property;
            if (meta === "new" && property === "target") {
                report(node, "newTarget");
            }
        },

        RestElement: function(node) {
            if (FUNC_TYPE.test(node.parent.type)) {
                report(node, "restParameters");
            }
        },

        //----------------------------------------------------------------------
        // Classes
        //----------------------------------------------------------------------

        ClassDeclaration: function(node) {
            report(node, "classes");
        },

        ClassExpression: function(node) {
            report(node, "classes");
        },

        //----------------------------------------------------------------------
        // Statements
        //----------------------------------------------------------------------

        ForOfStatement: function(node) {
            report(node, "forOf");
        },

        VariableDeclaration: function(node) {
            if (node.kind === "const") {
                report(node, "const");
            }
            else if (node.kind === "let") {
                report(node, "let");
            }
        },

        //----------------------------------------------------------------------
        // Expressions
        //----------------------------------------------------------------------

        ArrayPattern: function(node) {
            if (DESTRUCTURING_PARENT_TYPE.test(node.parent.type)) {
                report(node, "destructuring");
            }
        },

        Identifier: function(node) {
            var raw = sourceCode.getText(node);
            if (UNICODE_ESC.test(raw)) {
                report(node, "unicodeCodePointEscapes");
            }
        },

        Literal: function(node) {
            if (typeof node.value === "number") {
                if (BINARY_NUMBER.test(node.raw)) {
                    report(node, "binaryNumberLiterals");
                }
                else if (OCTAL_NUMBER.test(node.raw)) {
                    report(node, "octalNumberLiterals");
                }
            }
            else if (typeof node.value === "string") {
                if (UNICODE_ESC.test(node.raw)) {
                    report(node, "unicodeCodePointEscapes");
                }
            }
            else if (node.regex) {
                if (node.regex.flags.indexOf("y") !== -1) {
                    report(node, "regexpY");
                }
                if (node.regex.flags.indexOf("u") !== -1) {
                    report(node, "regexpU");
                }
            }
        },

        NewExpression: function(node) {
            if (node.callee.type === "Identifier" &&
                node.callee.name === "RegExp" &&
                node.arguments.length === 2 &&
                node.arguments[1].type === "Literal" &&
                typeof node.arguments[1].value === "string"
            ) {
                if (node.arguments[1].value.indexOf("y") !== -1) {
                    report(node, "regexpY");
                }
                if (node.arguments[1].value.indexOf("u") !== -1) {
                    report(node, "regexpU");
                }
            }
        },

        ObjectPattern: function(node) {
            if (DESTRUCTURING_PARENT_TYPE.test(node.parent.type)) {
                report(node, "destructuring");
            }
        },

        Property: function(node) {
            if (node.parent.type === "ObjectExpression" &&
                (node.computed || node.shorthand || node.method)
            ) {
                report(node, "objectLiteralExtensions");
            }
        },

        SpreadElement: function(node) {
            report(node, "spreadOperators", 5);
        },

        TemplateLiteral: function(node) {
            report(node, "templateStrings");
        },

        //----------------------------------------------------------------------
        // Modules
        //----------------------------------------------------------------------

        ExportAllDeclaration: function(node) {
            report(node, "modules");
        },

        ExportDefaultDeclaration: function(node) {
            report(node, "modules");
        },

        ExportNamedDeclaration: function(node) {
            report(node, "modules");
        },

        ImportDeclaration: function(node) {
            report(node, "modules");
        }
    };
};

module.exports.schema = [
    {oneOf: [
        {
            enum: VERSIONS
        },
        {
            type: "object",
            properties: {
                version: {
                    enum: VERSIONS
                },
                ignores: {
                    type: "array",
                    items: {enum: OPTIONS},
                    uniqueItems: true
                }
            },
            additionalProperties: false,
            required: ["version"]
        }
    ]}
];
