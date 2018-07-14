/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const semver = require("semver")
const { rules: esRules } = require("eslint-plugin-es")
const { getInnermostScope } = require("eslint-utils")
const getPackageJson = require("../../util/get-package-json")

const DEFAULT_VERSION = ">=6.0.0"
const GET_OR_SET = /^(?:g|s)et$/
const FEATURES = [
    //--------------------------------------------------------------------------
    // ES2015
    //--------------------------------------------------------------------------
    {
        ruleId: "no-arrow-functions",
        keywords: ["arrowFunctions", "syntax"],
        cases: [
            {
                supported: "4.0.0",
                messageId: "no-arrow-functions",
            },
        ],
    },
    {
        ruleId: "no-binary-numeric-literals",
        keywords: ["binaryNumericLiterals", "syntax"],
        cases: [
            {
                supported: "4.0.0",
                messageId: "no-binary-numeric-literals",
            },
        ],
    },
    {
        ruleId: "no-block-scoped-functions",
        keywords: ["blockScopedFunctions", "syntax"],
        cases: [
            {
                supported: "6.0.0",
                test: ({ isStrict }) => !isStrict,
                messageId: "no-block-scoped-functions-sloppy",
            },
            {
                supported: "4.0.0",
                messageId: "no-block-scoped-functions-strict",
            },
        ],
    },
    {
        ruleId: "no-block-scoped-variables",
        keywords: ["blockScopedVariables", "syntax"],
        cases: [
            {
                supported: "6.0.0",
                test: ({ isStrict }) => !isStrict,
                messageId: "no-block-scoped-variables-sloppy",
            },
            {
                supported: "4.0.0",
                messageId: "no-block-scoped-variables-strict",
            },
        ],
    },
    {
        ruleId: "no-classes",
        keywords: ["classes", "syntax"],
        cases: [
            {
                supported: "6.0.0",
                test: ({ isStrict }) => !isStrict,
                messageId: "no-classes-sloppy",
            },
            {
                supported: "4.0.0",
                messageId: "no-classes-strict",
            },
        ],
    },
    {
        ruleId: "no-computed-properties",
        keywords: ["computedProperties", "syntax"],
        cases: [
            {
                supported: "4.0.0",
                messageId: "no-computed-properties",
            },
        ],
    },
    {
        ruleId: "no-default-parameters",
        keywords: ["defaultParameters", "syntax"],
        cases: [
            {
                supported: "6.0.0",
                messageId: "no-default-parameters",
            },
        ],
    },
    {
        ruleId: "no-destructuring",
        keywords: ["destructuring", "syntax"],
        cases: [
            {
                supported: "6.0.0",
                messageId: "no-destructuring",
            },
        ],
    },
    {
        ruleId: "no-for-of-loops",
        keywords: ["forOfLoops", "syntax"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-for-of-loops",
            },
        ],
    },
    {
        ruleId: "no-generators",
        keywords: ["generators", "syntax"],
        cases: [
            {
                supported: "4.0.0",
                messageId: "no-generators",
            },
        ],
    },
    {
        ruleId: "no-modules",
        keywords: ["modules", "syntax"],
        cases: [
            {
                supported: null,
                messageId: "no-modules",
            },
        ],
    },
    {
        ruleId: "no-new-target",
        keywords: ["new.target", "syntax"],
        cases: [
            {
                supported: "5.0.0",
                messageId: "no-new-target",
            },
        ],
    },
    {
        ruleId: "no-object-super-properties",
        keywords: ["objectSuperProperties", "syntax"],
        cases: [
            {
                supported: "4.0.0",
                messageId: "no-object-super-properties",
            },
        ],
    },
    {
        ruleId: "no-octal-numeric-literals",
        keywords: ["octalNumericLiterals", "syntax"],
        cases: [
            {
                supported: "4.0.0",
                messageId: "no-octal-numeric-literals",
            },
        ],
    },
    {
        ruleId: "no-property-shorthands",
        keywords: ["propertyShorthands", "syntax"],
        cases: [
            {
                supported: "6.0.0",
                test: ({ node }) =>
                    node.shorthand && GET_OR_SET.test(node.key.name),
                messageId: "no-property-shorthands-getset",
            },
            {
                supported: "4.0.0",
                messageId: "no-property-shorthands",
            },
        ],
    },
    {
        ruleId: "no-regexp-u-flag",
        keywords: ["regexpU", "syntax"],
        cases: [
            {
                supported: "6.0.0",
                messageId: "no-regexp-u-flag",
            },
        ],
    },
    {
        ruleId: "no-regexp-y-flag",
        keywords: ["regexpY", "syntax"],
        cases: [
            {
                supported: "6.0.0",
                messageId: "no-regexp-y-flag",
            },
        ],
    },
    {
        ruleId: "no-rest-parameters",
        keywords: ["restParameters", "syntax"],
        cases: [
            {
                supported: "6.0.0",
                messageId: "no-rest-parameters",
            },
        ],
    },
    {
        ruleId: "no-spread-elements",
        keywords: ["spreadElements", "syntax"],
        cases: [
            {
                supported: "5.0.0",
                messageId: "no-spread-elements",
            },
        ],
    },
    {
        ruleId: "no-template-literals",
        keywords: ["templateLiterals", "syntax"],
        cases: [
            {
                supported: "4.0.0",
                messageId: "no-template-literals",
            },
        ],
    },
    {
        ruleId: "no-unicode-codepoint-escapes",
        keywords: ["unicodeCodePointEscapes", "syntax"],
        cases: [
            {
                supported: "4.0.0",
                messageId: "no-unicode-codepoint-escapes",
            },
        ],
    },
    {
        ruleId: "no-array-from",
        keywords: ["Array.from", "Array.*", "runtime"],
        cases: [
            {
                supported: "4.0.0",
                messageId: "no-array-from",
            },
        ],
    },
    {
        ruleId: "no-array-of",
        keywords: ["Array.of", "Array.*", "runtime"],
        cases: [
            {
                supported: "4.0.0",
                messageId: "no-array-of",
            },
        ],
    },
    {
        ruleId: "no-map",
        keywords: ["Map", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-map",
            },
        ],
    },
    {
        ruleId: "no-math-acosh",
        keywords: ["Math.acosh", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-acosh",
            },
        ],
    },
    {
        ruleId: "no-math-asinh",
        keywords: ["Math.asinh", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-asinh",
            },
        ],
    },
    {
        ruleId: "no-math-atanh",
        keywords: ["Math.atanh", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-atanh",
            },
        ],
    },
    {
        ruleId: "no-math-cbrt",
        keywords: ["Math.cbrt", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-cbrt",
            },
        ],
    },
    {
        ruleId: "no-math-clz32",
        keywords: ["Math.clz32", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-clz32",
            },
        ],
    },
    {
        ruleId: "no-math-cosh",
        keywords: ["Math.cosh", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-cosh",
            },
        ],
    },
    {
        ruleId: "no-math-expm1",
        keywords: ["Math.expm1", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-expm1",
            },
        ],
    },
    {
        ruleId: "no-math-fround",
        keywords: ["Math.fround", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-fround",
            },
        ],
    },
    {
        ruleId: "no-math-hypot",
        keywords: ["Math.hypot", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-hypot",
            },
        ],
    },
    {
        ruleId: "no-math-imul",
        keywords: ["Math.imul", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-imul",
            },
        ],
    },
    {
        ruleId: "no-math-log10",
        keywords: ["Math.log10", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-log10",
            },
        ],
    },
    {
        ruleId: "no-math-log1p",
        keywords: ["Math.log1p", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-log1p",
            },
        ],
    },
    {
        ruleId: "no-math-log2",
        keywords: ["Math.log2", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-log2",
            },
        ],
    },
    {
        ruleId: "no-math-sign",
        keywords: ["Math.sign", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-sign",
            },
        ],
    },
    {
        ruleId: "no-math-sinh",
        keywords: ["Math.sinh", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-sinh",
            },
        ],
    },
    {
        ruleId: "no-math-tanh",
        keywords: ["Math.tanh", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-tanh",
            },
        ],
    },
    {
        ruleId: "no-math-trunc",
        keywords: ["Math.trunc", "Math.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-math-trunc",
            },
        ],
    },
    {
        ruleId: "no-number-epsilon",
        keywords: ["Number.EPSILON", "Number.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-number-epsilon",
            },
        ],
    },
    {
        ruleId: "no-number-isfinite",
        keywords: ["Number.isFinite", "Number.*", "runtime"],
        cases: [
            {
                supported: "0.10.0",
                messageId: "no-number-isfinite",
            },
        ],
    },
    {
        ruleId: "no-number-isinteger",
        keywords: ["Number.isInteger", "Number.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-number-isinteger",
            },
        ],
    },
    {
        ruleId: "no-number-isnan",
        keywords: ["Number.isNaN", "Number.*", "runtime"],
        cases: [
            {
                supported: "0.10.0",
                messageId: "no-number-isnan",
            },
        ],
    },
    {
        ruleId: "no-number-issafeinteger",
        keywords: ["Number.isSafeInteger", "Number.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-number-issafeinteger",
            },
        ],
    },
    {
        ruleId: "no-number-maxsafeinteger",
        keywords: ["Number.MAX_SAFE_INTEGER", "Number.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-number-maxsafeinteger",
            },
        ],
    },
    {
        ruleId: "no-number-minsafeinteger",
        keywords: ["Number.MIN_SAFE_INTEGER", "Number.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-number-minsafeinteger",
            },
        ],
    },
    {
        ruleId: "no-number-parsefloat",
        keywords: ["Number.parseFloat", "Number.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-number-parsefloat",
            },
        ],
    },
    {
        ruleId: "no-number-parseint",
        keywords: ["Number.parseInt", "Number.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-number-parseint",
            },
        ],
    },
    {
        ruleId: "no-object-assign",
        keywords: ["Object.assign", "Object.*", "runtime"],
        cases: [
            {
                supported: "4.0.0",
                messageId: "no-object-assign",
            },
        ],
    },
    {
        ruleId: "no-object-getownpropertysymbols",
        keywords: ["Object.getOwnPropertySymbols", "Object.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-object-getownpropertysymbols",
            },
        ],
    },
    {
        ruleId: "no-object-is",
        keywords: ["Object.is", "Object.*", "runtime"],
        cases: [
            {
                supported: "0.10.0",
                messageId: "no-object-is",
            },
        ],
    },
    {
        ruleId: "no-object-setprototypeof",
        keywords: ["Object.setPrototypeOf", "Object.*", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-object-setprototypeof",
            },
        ],
    },
    {
        ruleId: "no-promise",
        keywords: ["Promise", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-promise",
            },
        ],
    },
    {
        ruleId: "no-proxy",
        keywords: ["Proxy", "runtime"],
        cases: [
            {
                supported: "6.0.0",
                messageId: "no-proxy",
            },
        ],
    },
    {
        ruleId: "no-reflect",
        keywords: ["Reflect", "runtime"],
        cases: [
            {
                supported: "6.0.0",
                messageId: "no-reflect",
            },
        ],
    },
    {
        ruleId: "no-set",
        keywords: ["Set", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-set",
            },
        ],
    },
    {
        ruleId: "no-string-fromcodepoint",
        keywords: ["String.fromCodePoint", "String.*", "runtime"],
        cases: [
            {
                supported: "4.0.0",
                messageId: "no-string-fromcodepoint",
            },
        ],
    },
    {
        ruleId: "no-string-raw",
        keywords: ["String.raw", "String.*", "runtime"],
        cases: [
            {
                supported: "4.0.0",
                messageId: "no-string-raw",
            },
        ],
    },
    {
        ruleId: "no-subclassing-builtins",
        keywords: ["subclassingBuiltins", "runtime"],
        cases: [
            {
                supported: "6.5.0",
                test: ({ node }) => node.name === "Array",
                messageId: "no-subclassing-builtins-array",
            },
            {
                supported: "6.0.0",
                test: ({ node }) =>
                    node.name === "Function" || node.name === "String",
                messageId: "no-subclassing-builtins-function-string",
            },
            {
                supported: "4.0.0",
                messageId: "no-subclassing-builtins",
            },
        ],
    },
    {
        ruleId: "no-symbol",
        keywords: ["Symbol", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-symbol",
            },
        ],
    },
    {
        ruleId: "no-typed-arrays",
        keywords: ["TypedArrays", "runtime"],
        cases: [
            {
                supported: "0.10.0",
                messageId: "no-typed-arrays",
            },
        ],
    },
    {
        ruleId: "no-weak-map",
        keywords: ["WeakMap", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-weak-map",
            },
        ],
    },
    {
        ruleId: "no-weak-set",
        keywords: ["WeakSet", "runtime"],
        cases: [
            {
                supported: "0.12.0",
                messageId: "no-weak-set",
            },
        ],
    },

    //--------------------------------------------------------------------------
    // ES2016
    //--------------------------------------------------------------------------
    {
        ruleId: "no-exponential-operators",
        keywords: ["exponentialOperators", "syntax"],
        cases: [
            {
                supported: "7.0.0",
                messageId: "no-exponential-operators",
            },
        ],
    },

    //--------------------------------------------------------------------------
    // ES2017
    //--------------------------------------------------------------------------
    {
        ruleId: "no-async-functions",
        keywords: ["asyncFunctions", "syntax"],
        cases: [
            {
                supported: "7.6.0",
                messageId: "no-async-functions",
            },
        ],
    },
    {
        ruleId: "no-trailing-function-commas",
        keywords: ["trailingCommasInFunctions", "syntax"],
        cases: [
            {
                supported: "8.0.0",
                messageId: "no-trailing-function-commas",
            },
        ],
    },
    {
        ruleId: "no-atomics",
        keywords: ["Atomics", "runtime"],
        cases: [
            {
                supported: "8.10.0",
                messageId: "no-atomics",
            },
        ],
    },
    {
        ruleId: "no-object-values",
        keywords: ["Object.values", "Object.*", "runtime"],
        cases: [
            {
                supported: "7.0.0",
                messageId: "no-object-values",
            },
        ],
    },
    {
        ruleId: "no-object-entries",
        keywords: ["Object.entries", "Object.*", "runtime"],
        cases: [
            {
                supported: "7.0.0",
                messageId: "no-object-entries",
            },
        ],
    },
    {
        ruleId: "no-object-getownpropertydescriptors",
        keywords: ["Object.getOwnPropertyDescriptors", "Object.*", "runtime"],
        cases: [
            {
                supported: "7.0.0",
                messageId: "no-object-getownpropertydescriptors",
            },
        ],
    },
    {
        ruleId: "no-shared-array-buffer",
        keywords: ["SharedArrayBuffer", "runtime"],
        cases: [
            {
                supported: "8.10.0",
                messageId: "no-shared-array-buffer",
            },
        ],
    },

    //--------------------------------------------------------------------------
    // ES2018
    //--------------------------------------------------------------------------
    {
        ruleId: "no-async-iteration",
        keywords: ["asyncIteration", "syntax"],
        cases: [
            {
                supported: "10.0.0",
                messageId: "no-async-iteration",
            },
        ],
    },
    {
        ruleId: "no-malformed-template-literals",
        keywords: ["malformedTemplateLiterals", "syntax"],
        cases: [
            {
                supported: "8.10.0",
                messageId: "no-malformed-template-literals",
            },
        ],
    },
    {
        ruleId: "no-regexp-lookbehind-assertions",
        keywords: ["regexpLookbehind", "syntax"],
        cases: [
            {
                supported: "8.10.0",
                messageId: "no-regexp-lookbehind-assertions",
            },
        ],
    },
    {
        ruleId: "no-regexp-named-capture-groups",
        keywords: ["regexpNamedCaptureGroups", "syntax"],
        cases: [
            {
                supported: "10.0.0",
                messageId: "no-regexp-named-capture-groups",
            },
        ],
    },
    {
        ruleId: "no-regexp-s-flag",
        keywords: ["regexpS", "syntax"],
        cases: [
            {
                supported: "8.10.0",
                messageId: "no-regexp-s-flag",
            },
        ],
    },
    {
        ruleId: "no-regexp-unicode-property-escapes",
        keywords: ["regexpUnicodeProperties", "syntax"],
        cases: [
            {
                supported: "10.0.0",
                messageId: "no-regexp-unicode-property-escapes",
            },
        ],
    },
    {
        ruleId: "no-rest-spread-properties",
        keywords: ["restSpreadProperties", "syntax"],
        cases: [
            {
                supported: "8.3.0",
                messageId: "no-rest-spread-properties",
            },
        ],
    },
]

/**
 * Gets default version configuration of this rule.
 *
 * This finds and reads 'package.json' file, then parses 'engines.node' field.
 * If it's nothing, this returns null.
 *
 * @param {string} filename - The file name of the current linting file.
 * @returns {string} The default version configuration.
 */
function getDefaultVersion(filename) {
    const info = getPackageJson(filename)
    const nodeVersion = info && info.engines && info.engines.node

    return semver.validRange(nodeVersion) || DEFAULT_VERSION
}

/**
 * Parses the options.
 * @param {object|undefined} options - An option object to parse.
 * @param {string} defaultVersion - The default version to use if the version option was omitted.
 * @returns {{version:string,ignores:Set<string>}} Parsed value.
 */
function parseOptions(options, defaultVersion) {
    const version =
        semver.validRange(options && options.version) || defaultVersion
    const ignores = new Set((options && options.ignores) || [])

    return Object.freeze({ version, ignores })
}

/**
 * Define the case selector with given information.
 * @param {RuleContext} context The rule context to get scopes.
 * @param {string} version The configured version range.
 * @param {Node|null} node The node at the current location, for additional conditions.
 * @returns {function(aCase:object):boolean} The case selector.
 */
function defineSelector(context, version, node) {
    return aCase =>
        // Version.
        (!aCase.supported ||
            semver.intersects(`<${aCase.supported}`, version)) &&
        // Additional conditions.
        (!aCase.test ||
            aCase.test({
                node,
                get isStrict() {
                    return Boolean(
                        node && nomalizeScope(context.getScope(), node).isStrict
                    )
                },
            }))
}

/**
 * Find the scope that a given node belongs to.
 * @param {Scope} initialScope The initial scope to find.
 * @param {Node} node The AST node.
 * @returns {Scope} The scope that the node belongs to.
 */
function nomalizeScope(initialScope, node) {
    let scope = getInnermostScope(initialScope, node)

    while (scope && scope.block === node) {
        scope = scope.upper
    }

    return scope
}

/**
 * Merge two visitors.
 * @param {Visitor} x The visitor which is assigned.
 * @param {Visitor} y The visitor which is assigning.
 * @returns {Visitor} `x`.
 */
function merge(x, y) {
    for (const key of Object.keys(y)) {
        if (typeof x[key] === "function") {
            if (x[key]._handlers == null) {
                const fs = [x[key], y[key]]
                x[key] = dispatch.bind(null, fs)
                x[key]._handlers = fs
            } else {
                x[key]._handlers.push(y[key])
            }
        } else {
            x[key] = y[key]
        }
    }
    return x
}

/**
 * Dispatch all given functions with a node.
 * @param {function[]} handlers The function list to call.
 * @param {Node} node The AST node to be handled.
 * @returns {void}
 */
function dispatch(handlers, node) {
    for (const h of handlers) {
        h(node)
    }
}

/**
 * Define the visitor object as merging the rules of eslint-plugin-es.
 * @param {RuleContext} context The rule context.
 * @param {{version:string,ignores:Set<string>}} options The options.
 * @returns {object} The defined visitor.
 */
function defineVisitor(context, options) {
    return FEATURES.filter(
        // Omit full-supported features and ignored features by options because
        // this rule never reports those.
        f =>
            !f.keywords.some(Set.prototype.has, options.ignores) &&
            f.cases.some(
                c =>
                    !c.supported ||
                    semver.intersects(options.version, `<${c.supported}`)
            )
    ).reduce((visitor, f) => {
        const rule = esRules[f.ruleId]
        const thisContext = {
            __proto__: context,

            // Override `context.report()` then:
            // - ignore if it's supported.
            // - override reporting messages.
            report(descriptor) {
                // Set additional information.
                if (descriptor.data) {
                    descriptor.data.version = options.version
                } else {
                    descriptor.data = { version: options.version }
                }
                descriptor.fix = undefined

                // Test and report.
                const hitCase = f.cases.find(
                    defineSelector(this, options.version, descriptor.node)
                )
                if (hitCase) {
                    descriptor.messageId = hitCase.messageId
                    descriptor.data.supported = hitCase.supported
                    super.report(descriptor)
                }
            },
        }
        return merge(visitor, rule.create(thisContext))
    }, {})
}

module.exports = {
    meta: {
        docs: {
            description:
                "disallow unsupported ECMAScript features on the specified version",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v6.0.1/docs/rules/no-unsupported-features/ecma.md",
        },
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    version: {
                        type: "string",
                    },
                    ignores: {
                        type: "array",
                        items: {
                            enum: Array.from(
                                new Set(
                                    [].concat(...FEATURES.map(f => f.keywords))
                                )
                            ),
                        },
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            //--------------------------------------------------------------------------
            // ES2015
            //--------------------------------------------------------------------------
            "no-arrow-functions":
                "Arrow functions are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-binary-numeric-literals":
                "Binary numeric literals are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-block-scoped-functions-strict":
                "Block-scoped functions in strict mode are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-block-scoped-functions-sloppy":
                "Block-scoped functions in non-strict mode are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-block-scoped-variables-strict":
                "Block-scoped variables in strict mode are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-block-scoped-variables-sloppy":
                "Block-scoped variables in non-strict mode are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-classes-strict":
                "Classes in strict mode are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-classes-sloppy":
                "Classes in non-strict mode are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-computed-properties":
                "Computed properties are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-default-parameters":
                "Default parameters are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-destructuring":
                "Destructuring is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-for-of-loops":
                "'for-of' loops are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-generators":
                "Generator functions are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-modules":
                "Import and export declarations are not supported yet.",
            "no-new-target":
                "'new.target' is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-object-super-properties":
                "'super' in object literals is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-octal-numeric-literals":
                "Octal numeric literals are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-property-shorthands":
                "Property shorthands are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-property-shorthands-getset":
                "Property shorthands of 'get' and 'set' are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-regexp-u-flag":
                "RegExp 'u' flag is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-regexp-y-flag":
                "RegExp 'y' flag is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-rest-parameters":
                "Rest parameters are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-spread-elements":
                "Spread elements are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-template-literals":
                "Template literals are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-unicode-codepoint-escapes":
                "Unicode code point escapes are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-array-from":
                "The 'Array.from' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-array-of":
                "The 'Array.of' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-map":
                "The 'Map' class is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-acosh":
                "The 'Math.acosh' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-asinh":
                "The 'Math.asinh' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-atanh":
                "The 'Math.atanh' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-cbrt":
                "The 'Math.cbrt' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-clz32":
                "The 'Math.clz32' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-cosh":
                "The 'Math.cosh' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-expm1":
                "The 'Math.expm1' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-fround":
                "The 'Math.fround' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-hypot":
                "The 'Math.hypot' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-imul":
                "The 'Math.imul' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-log10":
                "The 'Math.log10' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-log1p":
                "The 'Math.log1p' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-log2":
                "The 'Math.log2' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-sign":
                "The 'Math.sign' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-sinh":
                "The 'Math.sinh' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-tanh":
                "The 'Math.tanh' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-math-trunc":
                "The 'Math.trunc' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-number-epsilon":
                "The 'Number.EPSILON' property is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-number-isfinite":
                "The 'Number.isFinite' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-number-isinteger":
                "The 'Number.isInteger' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-number-isnan":
                "The 'Number.isNaN' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-number-issafeinteger":
                "The 'Number.isSafeInteger' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-number-maxsafeinteger":
                "The 'Number.MAX_SAFE_INTEGER' property is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-number-minsafeinteger":
                "The 'Number.MIN_SAFE_INTEGER' property is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-number-parsefloat":
                "The 'Number.parseFloat' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-number-parseint":
                "The 'Number.parseInt' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-object-assign":
                "The 'Object.assign' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-object-getownpropertysymbols":
                "The 'Object.getOwnPropertySymbols' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-object-is":
                "The 'Object.is' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-object-setprototypeof":
                "The 'Object.setPrototypeOf' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-promise":
                "The 'Promise' class is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-proxy":
                "The 'Proxy' class is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-reflect":
                "The 'Reflect' class is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-set":
                "The 'Set' class is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-string-fromcodepoint":
                "The 'String.fromCodePoint' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-string-raw":
                "The 'String.raw' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-subclassing-builtins-array":
                "Subclassing '{{name}}' class is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-subclassing-builtins-function-string":
                "Subclassing '{{name}}' class is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-subclassing-builtins":
                "Subclassing '{{name}}' class is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-symbol":
                "The 'Symbol' class is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-typed-arrays":
                "Typed array classes are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-weak-map":
                "The 'WeakMap' class is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-weak-set":
                "The 'WeakSet' class is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",

            //--------------------------------------------------------------------------
            // ES2016
            //--------------------------------------------------------------------------
            "no-exponential-operators":
                "Exponential operators are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",

            //--------------------------------------------------------------------------
            // ES2017
            //--------------------------------------------------------------------------
            "no-async-functions":
                "Async functions are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-trailing-function-commas":
                "Trailing commas in function syntax are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-atomics":
                "The 'Atomics' class is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-object-values":
                "The 'Object.values' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-object-entries":
                "The 'Object.entries' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-object-getownpropertydescriptors":
                "The 'Object.getOwnPropertyDescriptors' method is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-shared-array-buffer":
                "The 'SharedArrayBuffer' class is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",

            //--------------------------------------------------------------------------
            // ES2018
            //--------------------------------------------------------------------------
            "no-async-iteration":
                "Async iteration is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-malformed-template-literals":
                "Malformed template literals are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-regexp-lookbehind-assertions":
                "RegExp lookbehind assertions are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-regexp-named-capture-groups":
                "RegExp named capture groups are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-regexp-s-flag":
                "RegExp 's' flag is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-regexp-unicode-property-escapes":
                "RegExp Unicode property escapes are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
            "no-rest-spread-properties":
                "Rest/spread properties are not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
        },
    },
    create(context) {
        const defaultVersion = getDefaultVersion(context.getFilename())
        const options = parseOptions(context.options[0], defaultVersion)
        return defineVisitor(context, options)
    },
}
