/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path")
var rule = require("../../../lib/rules/no-unsupported-features")
var RuleTester = require("eslint").RuleTester

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var VERSIONS = Object.freeze([0.10, 0.12, 4, 5, 6])

/**
 * Creates test pattern.
 *
 * @param {{valid: object[], invalid: object[]}} retv - Actual test patterns.
 * @param {object} pattern - Original test pattern.
 * @returns {{valid: object[], invalid: object[]}} retv.
 */
function convertPattern(retv, pattern) {
    var i = 0

    // Creates error messages.
    var errors = []
    for (i = 0; i < pattern.errors; ++i) {
        errors.push(
            pattern.name + " " + (pattern.singular ? "is" : "are") +
            " not supported yet on Node v"
        )
    }

    // Creates each pattern of Node versions.
    VERSIONS.forEach(function(version) {
        var versionText = version < 1 ? version.toFixed(2) : version.toFixed(0)

        // Skips if ignored
        if (pattern.ignores && pattern.ignores.indexOf(version) !== -1) {
            return
        }

        if (version >= pattern.supported) {
            // If this is supported, add to a valid pattern.
            retv.valid.push({
                code: "/*" + pattern.name + ": " + versionText + "*/ " + pattern.code,
                env: {es6: true},
                options: [version],
                parserOptions: {sourceType: pattern.modules ? "module" : "script"},
            })
        }
        else {
            // If this is not supported, add to a valid pattern with a "ignores" option.
            [].push.apply(retv.valid, pattern.keys.map(function(key) {
                return {
                    code: "/*" + pattern.name + ": " + versionText + ", ignores: [\"" + key + "\"]*/ " + pattern.code,
                    env: {es6: true},
                    options: [{version: version, ignores: [key]}],
                    parserOptions: {sourceType: pattern.modules ? "module" : "script"},
                }
            }))

            // If this is not supported, add to a invalid pattern.
            retv.invalid.push({
                code: "/*" + pattern.name + ": " + versionText + "*/ " + pattern.code,
                env: {es6: true},
                options: [version],
                parserOptions: {sourceType: pattern.modules ? "module" : "script"},
                errors: errors.map(function(message) {
                    return message + versionText + "."
                }),
            })
        }
    })

    return retv
}

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-unsupported-features", name)
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester()
ruleTester.run("no-unsupported-features", rule, [
    //--------------------------------------------------------------------------
    // Syntax
    //--------------------------------------------------------------------------

    {
        keys: ["defaultParameters", "syntax"],
        name: "Default Parameters",
        code: "function foo(a = 1) {} ;(function(a = 1) {})()",
        errors: 2,
        supported: 6,
    },
    {
        keys: ["restParameters", "syntax"],
        name: "Rest Parameters",
        code: "function foo(a, ...b) {} ;(function(a, ...b) {})()",
        errors: 2,
        supported: 6,
    },
    {
        keys: ["spreadOperators", "syntax"],
        name: "Spread Operators",
        code: "foo(...a); foo([...a, ...b])",
        errors: 3,
        supported: 5,
    },
    {
        keys: ["objectLiteralExtensions", "syntax"],
        name: "Object Literal Extensions",
        code: "var obj = {[a]: 0, b, c() {}, get [d]() {}, set [d](v) {}}",
        errors: 5,
        supported: 4,
    },
    {
        keys: ["objectPropertyShorthandOfGetSet", "objectLiteralExtensions", "syntax"],
        name: "Property Shorthand of 'get' and 'set'",
        code: "var obj = {get, set}",
        errors: 2,
        supported: 6,
    },
    {
        keys: ["forOf", "syntax"],
        name: "'for..of' Loops",
        code: "for (var a of []) {}",
        errors: 1,
        supported: 0.12,
    },
    {
        keys: ["binaryNumberLiterals", "syntax"],
        name: "Binary Number Literals",
        code: "var a = 0b10 === 2 && 0B10 === 2",
        errors: 2,
        supported: 4,
    },
    {
        keys: ["octalNumberLiterals", "syntax"],
        name: "Octal Number Literals",
        code: "var a = 0o10 === 8 && 0O10 === 8",
        errors: 2,
        supported: 4,
    },
    {
        keys: ["templateStrings", "syntax"],
        name: "Template Strings",
        code: "`hello, ${world}!`; foo`tagged`;",
        errors: 2,
        supported: 4,
    },
    {
        keys: ["regexpY", "syntax"],
        name: "RegExp 'y' Flags",
        code: "new RegExp('', 'y'); (/a/y)",
        errors: 2,
        supported: 6,
    },
    {
        keys: ["regexpU", "syntax"],
        name: "RegExp 'u' Flags",
        code: "new RegExp('', 'u'); (/a/u)",
        errors: 2,
        supported: 6,
    },
    {
        keys: ["destructuring", "syntax"],
        name: "Destructuring",
        code: "var [[a], [b = 1]] = [], {c: {c}, d: {d = 1}} = {};",
        errors: 2,
        supported: 6,
    },
    {
        keys: ["destructuring", "syntax"],
        name: "Destructuring",
        code: "[[a], [b = 1]] = []; ({c: {c}, d: {d = 1}} = {})",
        errors: 2,
        supported: 6,
    },
    {
        keys: ["destructuring", "syntax"],
        name: "Destructuring",
        code: "function foo([[a], [b = 1]], {c: {c}, d: {d = 1}}) {}",
        errors: 2,
        supported: 6,
    },
    {
        keys: ["unicodeCodePointEscapes", "syntax"],
        name: "Unicode Code Point Escapes",
        code: "var \\u{102C0} = { \\u{102C0} : '\\u{1d306}' };", // eslint-disable-line node/no-unsupported-features
        errors: 3,
        supported: 4,
    },
    {
        keys: ["new.target", "syntax"],
        name: "'new.target'",
        code: "function Foo() { new.target; } ;(function() { new.target; })()",
        errors: 2,
        supported: 5,
    },
    {
        keys: ["const", "syntax"],
        name: "'const' Declarations",
        code: "'use strict'; const a = 0;",
        errors: 1,
        supported: 4,
    },
    {
        keys: ["const", "syntax"],
        name: "'const' Declarations",
        code: "const a = 0;",
        errors: 1,
        supported: 4,
        modules: true,
    },
    {
        keys: ["const", "syntax"],
        name: "'const' Declarations in non-strict mode",
        code: "const a = 0;",
        errors: 1,
        supported: 6,
        ignores: [0.10, 0.12],
    },
    {
        keys: ["let", "syntax"],
        name: "'let' Declarations",
        code: "'use strict'; let a = 0;",
        errors: 1,
        supported: 4,
    },
    {
        keys: ["let", "syntax"],
        name: "'let' Declarations",
        code: "let a = 0;",
        errors: 1,
        supported: 4,
        modules: true,
    },
    {
        keys: ["let", "syntax"],
        name: "'let' Declarations in non-strict mode",
        code: "let a = 0;",
        errors: 1,
        supported: 6,
        ignores: [0.10, 0.12],
    },
    {
        keys: ["blockScopedFunctions", "syntax"],
        name: "Block-Scoped Functions",
        code: "'use strict'; { function foo() {} } if (a) { function foo() {} }",
        errors: 2,
        supported: 4,
    },
    {
        keys: ["blockScopedFunctions", "syntax"],
        name: "Block-Scoped Functions",
        code: "{ function foo() {} } if (a) { function foo() {} }",
        errors: 2,
        supported: 4,
        modules: true,
    },
    {
        keys: ["blockScopedFunctions", "syntax"],
        name: "Block-Scoped Functions in non-strict mode",
        code: "{ function foo() {} } if (a) { function foo() {} }",
        errors: 2,
        supported: 6,
        ignores: [0.10, 0.12],
    },
    {
        keys: ["arrowFunctions", "syntax"],
        name: "Arrow Functions",
        code: "var a = () => 1",
        errors: 1,
        supported: 4,
    },
    {
        keys: ["classes", "syntax"],
        name: "Classes",
        code: "'use strict'; class A {} new (class{})()",
        errors: 2,
        supported: 4,
    },
    {
        keys: ["classes", "syntax"],
        name: "Classes",
        code: "class A {} new (class{})()",
        errors: 2,
        supported: 4,
        modules: true,
    },
    {
        keys: ["classes", "syntax"],
        name: "Classes in non-strict mode",
        code: "class A {} new (class{})()",
        errors: 2,
        supported: 6,
        ignores: [0.10, 0.12],
    },
    {
        keys: ["generatorFunctions", "syntax"],
        name: "Generator Functions",
        code: "function* foo() {} ;(function*() {})();",
        errors: 2,
        supported: 4,
    },
    {
        keys: ["modules", "syntax"],
        name: "Import and Export Declarations",
        code: "import foo from 'foo'; export default 0; export {foo}; export * from 'foo';",
        errors: 4,
        supported: 6,
        modules: true,
    },

    //--------------------------------------------------------------------------
    // Runtime
    //--------------------------------------------------------------------------

    {
        keys: ["Int8Array", "typedArrays", "globalObjects", "runtime"],
        name: "'Int8Array'",
        code: "Int8Array",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Uint8Array", "typedArrays", "globalObjects", "runtime"],
        name: "'Uint8Array'",
        code: "Uint8Array",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Uint8ClampedArray", "typedArrays", "globalObjects", "runtime"],
        name: "'Uint8ClampedArray'",
        code: "Uint8ClampedArray",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Int16Array", "typedArrays", "globalObjects", "runtime"],
        name: "'Int16Array'",
        code: "Int16Array",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Uint16Array", "typedArrays", "globalObjects", "runtime"],
        name: "'Uint16Array'",
        code: "Uint16Array",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Int32Array", "typedArrays", "globalObjects", "runtime"],
        name: "'Int32Array'",
        code: "Int32Array",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Uint32Array", "typedArrays", "globalObjects", "runtime"],
        name: "'Uint32Array'",
        code: "Uint32Array",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Float32Array", "typedArrays", "globalObjects", "runtime"],
        name: "'Float32Array'",
        code: "Float32Array",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Float64Array", "typedArrays", "globalObjects", "runtime"],
        name: "'Float64Array'",
        code: "Float64Array",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["DataView", "typedArrays", "globalObjects", "runtime"],
        name: "'DataView'",
        code: "DataView",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Map", "globalObjects", "runtime"],
        name: "'Map'",
        code: "Map",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Set", "globalObjects", "runtime"],
        name: "'Set'",
        code: "Set",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["WeakMap", "globalObjects", "runtime"],
        name: "'WeakMap'",
        code: "WeakMap",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["WeakSet", "globalObjects", "runtime"],
        name: "'WeakSet'",
        code: "WeakSet",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Proxy", "globalObjects", "runtime"],
        name: "'Proxy'",
        code: "Proxy",
        errors: 1,
        supported: 6,
        singular: true,
    },
    {
        keys: ["Reflect", "globalObjects", "runtime"],
        name: "'Reflect'",
        code: "Reflect",
        errors: 1,
        supported: 6,
        singular: true,
    },
    {
        keys: ["Promise", "globalObjects", "runtime"],
        name: "'Promise'",
        code: "Promise",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Promise", "globalObjects", "runtime"],
        name: "'Promise'",
        code: "var Promise = require('promise'); new Promise()",
        errors: 0,
        supported: 0,
        singular: true,
    },
    {
        keys: ["Symbol", "globalObjects", "runtime"],
        name: "'Symbol'",
        code: "Symbol",
        errors: 1,
        supported: 0.12,
        singular: true,
    },

    {
        keys: ["Object.assign", "Object.*", "staticMethods", "runtime"],
        name: "'Object.assign'",
        code: "Object.assign; Object['assign']",
        errors: 2,
        supported: 4,
        singular: true,
    },
    {
        keys: ["Object.is", "Object.*", "staticMethods", "runtime"],
        name: "'Object.is'",
        code: "Object.is",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Object.getOwnPropertySymbols", "Object.*", "staticMethods", "runtime"],
        name: "'Object.getOwnPropertySymbols'",
        code: "Object.getOwnPropertySymbols",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Object.setPrototypeOf", "Object.*", "staticMethods", "runtime"],
        name: "'Object.setPrototypeOf'",
        code: "Object.setPrototypeOf",
        errors: 1,
        supported: 0.12,
        singular: true,
    },

    {
        keys: ["String.raw", "String.*", "staticMethods", "runtime"],
        name: "'String.raw'",
        code: "String.raw",
        errors: 1,
        supported: 4,
        singular: true,
    },
    {
        keys: ["String.fromCodePoint", "String.*", "staticMethods", "runtime"],
        name: "'String.fromCodePoint'",
        code: "String.fromCodePoint",
        errors: 1,
        supported: 4,
        singular: true,
    },

    {
        keys: ["Array.from", "Array.*", "staticMethods", "runtime"],
        name: "'Array.from'",
        code: "Array.from",
        errors: 1,
        supported: 4,
        singular: true,
    },
    {
        keys: ["Array.of", "Array.*", "staticMethods", "runtime"],
        name: "'Array.of'",
        code: "Array.of",
        errors: 1,
        supported: 4,
        singular: true,
    },

    {
        keys: ["Number.isFinite", "Number.*", "staticMethods", "runtime"],
        name: "'Number.isFinite'",
        code: "Number.isFinite",
        errors: 1,
        supported: 0.10,
        singular: true,
    },
    {
        keys: ["Number.isInteger", "Number.*", "staticMethods", "runtime"],
        name: "'Number.isInteger'",
        code: "Number.isInteger",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Number.isSafeInteger", "Number.*", "staticMethods", "runtime"],
        name: "'Number.isSafeInteger'",
        code: "Number.isSafeInteger",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Number.isNaN", "Number.*", "staticMethods", "runtime"],
        name: "'Number.isNaN'",
        code: "Number.isNaN",
        errors: 1,
        supported: 0.10,
        singular: true,
    },
    {
        keys: ["Number.EPSILON", "Number.*", "staticMethods", "runtime"],
        name: "'Number.EPSILON'",
        code: "Number.EPSILON",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Number.MIN_SAFE_INTEGER", "Number.*", "staticMethods", "runtime"],
        name: "'Number.MIN_SAFE_INTEGER'",
        code: "Number.MIN_SAFE_INTEGER",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Number.MAX_SAFE_INTEGER", "Number.*", "staticMethods", "runtime"],
        name: "'Number.MAX_SAFE_INTEGER'",
        code: "Number.MAX_SAFE_INTEGER",
        errors: 1,
        supported: 0.12,
        singular: true,
    },

    {
        keys: ["Math.clz32", "Math.*", "staticMethods", "runtime"],
        name: "'Math.clz32'",
        code: "Math.clz32",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.imul", "Math.*", "staticMethods", "runtime"],
        name: "'Math.imul'",
        code: "Math.imul",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.sign", "Math.*", "staticMethods", "runtime"],
        name: "'Math.sign'",
        code: "Math.sign",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.log10", "Math.*", "staticMethods", "runtime"],
        name: "'Math.log10'",
        code: "Math.log10",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.log2", "Math.*", "staticMethods", "runtime"],
        name: "'Math.log2'",
        code: "Math.log2",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.log1p", "Math.*", "staticMethods", "runtime"],
        name: "'Math.log1p'",
        code: "Math.log1p",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.expm1", "Math.*", "staticMethods", "runtime"],
        name: "'Math.expm1'",
        code: "Math.expm1",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.cosh", "Math.*", "staticMethods", "runtime"],
        name: "'Math.cosh'",
        code: "Math.cosh",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.sinh", "Math.*", "staticMethods", "runtime"],
        name: "'Math.sinh'",
        code: "Math.sinh",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.tanh", "Math.*", "staticMethods", "runtime"],
        name: "'Math.tanh'",
        code: "Math.tanh",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.acosh", "Math.*", "staticMethods", "runtime"],
        name: "'Math.acosh'",
        code: "Math.acosh",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.asinh", "Math.*", "staticMethods", "runtime"],
        name: "'Math.asinh'",
        code: "Math.asinh",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.atanh", "Math.*", "staticMethods", "runtime"],
        name: "'Math.atanh'",
        code: "Math.atanh",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.trunc", "Math.*", "staticMethods", "runtime"],
        name: "'Math.trunc'",
        code: "Math.trunc",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.fround", "Math.*", "staticMethods", "runtime"],
        name: "'Math.fround'",
        code: "Math.fround",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.cbrt", "Math.*", "staticMethods", "runtime"],
        name: "'Math.cbrt'",
        code: "Math.cbrt",
        errors: 1,
        supported: 0.12,
        singular: true,
    },
    {
        keys: ["Math.hypot", "Math.*", "staticMethods", "runtime"],
        name: "'Math.hypot'",
        code: "Math.hypot",
        errors: 1,
        supported: 0.12,
        singular: true,
    },

    {
        keys: ["Symbol.hasInstance", "Symbol.*", "staticMethods", "runtime"],
        name: "'Symbol.hasInstance'",
        code: "Symbol.hasInstance",
        errors: 1,
        supported: NaN,
        ignores: [0.10],
        singular: true,
    },
    {
        keys: ["Symbol.isConcatSpreadablec", "Symbol.*", "staticMethods", "runtime"],
        name: "'Symbol.isConcatSpreadablec'",
        code: "Symbol.isConcatSpreadablec",
        errors: 1,
        supported: 6,
        ignores: [0.10],
        singular: true,
    },
    {
        keys: ["Symbol.iterator", "Symbol.*", "staticMethods", "runtime"],
        name: "'Symbol.iterator'",
        code: "Symbol.iterator",
        errors: 1,
        supported: 0.12,
        ignores: [0.10],
        singular: true,
    },
    {
        keys: ["Symbol.species", "Symbol.*", "staticMethods", "runtime"],
        name: "'Symbol.species'",
        code: "Symbol.species",
        errors: 1,
        supported: NaN,
        ignores: [0.10],
        singular: true,
    },
    {
        keys: ["Symbol.replace", "Symbol.*", "staticMethods", "runtime"],
        name: "'Symbol.replace'",
        code: "Symbol.replace",
        errors: 1,
        supported: 6,
        ignores: [0.10],
        singular: true,
    },
    {
        keys: ["Symbol.search", "Symbol.*", "staticMethods", "runtime"],
        name: "'Symbol.search'",
        code: "Symbol.search",
        errors: 1,
        supported: 6,
        ignores: [0.10],
        singular: true,
    },
    {
        keys: ["Symbol.split", "Symbol.*", "staticMethods", "runtime"],
        name: "'Symbol.split'",
        code: "Symbol.split",
        errors: 1,
        supported: 6,
        ignores: [0.10],
        singular: true,
    },
    {
        keys: ["Symbol.match", "Symbol.*", "staticMethods", "runtime"],
        name: "'Symbol.match'",
        code: "Symbol.match",
        errors: 1,
        supported: 6,
        ignores: [0.10],
        singular: true,
    },
    {
        keys: ["Symbol.toPrimitive", "Symbol.*", "staticMethods", "runtime"],
        name: "'Symbol.toPrimitive'",
        code: "Symbol.toPrimitive",
        errors: 1,
        supported: 6,
        ignores: [0.10],
        singular: true,
    },
    {
        keys: ["Symbol.toStringTag", "Symbol.*", "staticMethods", "runtime"],
        name: "'Symbol.toStringTag'",
        code: "Symbol.toStringTag",
        errors: 1,
        supported: 6,
        ignores: [0.10],
        singular: true,
    },
    {
        keys: ["Symbol.unscopables", "Symbol.*", "staticMethods", "runtime"],
        name: "'Symbol.unscopables'",
        code: "Symbol.unscopables",
        errors: 1,
        supported: 4,
        ignores: [0.10],
        singular: true,
    },

    {
        keys: ["extendsArray", "extends", "runtime"],
        name: "Subclassing of 'Array'",
        code: "'use strict'; class X extends Array {}",
        errors: 1,
        supported: 6,
        ignores: [0.10, 0.12],
        singular: true,
    },
    {
        keys: ["extendsRegExp", "extends", "runtime"],
        name: "Subclassing of 'RegExp'",
        code: "'use strict'; class X extends RegExp {}",
        errors: 1,
        supported: 5,
        ignores: [0.10, 0.12],
        singular: true,
    },
    {
        keys: ["extendsFunction", "extends", "runtime"],
        name: "Subclassing of 'Function'",
        code: "'use strict'; class X extends Function {}",
        errors: 1,
        supported: 6,
        ignores: [0.10, 0.12],
        singular: true,
    },
    {
        keys: ["extendsPromise", "extends", "runtime"],
        name: "Subclassing of 'Promise'",
        code: "'use strict'; class X extends Promise {}",
        errors: 1,
        supported: 5,
        ignores: [0.10, 0.12],
        singular: true,
    },
    {
        keys: ["extendsBoolean", "extends", "runtime"],
        name: "Subclassing of 'Boolean'",
        code: "'use strict'; class X extends Boolean {}",
        errors: 1,
        supported: 4,
        ignores: [0.10, 0.12],
        singular: true,
    },
    {
        keys: ["extendsNumber", "extends", "runtime"],
        name: "Subclassing of 'Number'",
        code: "'use strict'; class X extends Number {}",
        errors: 1,
        supported: 4,
        ignores: [0.10, 0.12],
        singular: true,
    },
    {
        keys: ["extendsString", "extends", "runtime"],
        name: "Subclassing of 'String'",
        code: "'use strict'; class X extends String {}",
        errors: 1,
        supported: 4,
        ignores: [0.10, 0.12],
        singular: true,
    },
    {
        keys: ["extendsMap", "extends", "runtime"],
        name: "Subclassing of 'Map'",
        code: "'use strict'; class X extends Map {}",
        errors: 1,
        supported: 4,
        ignores: [0.10, 0.12],
        singular: true,
    },
    {
        keys: ["extendsSet", "extends", "runtime"],
        name: "Subclassing of 'Set'",
        code: "'use strict'; class X extends Set {}",
        errors: 1,
        supported: 4,
        ignores: [0.10, 0.12],
        singular: true,
    },
].reduce(convertPattern, {
    valid: [
        {
            filename: fixture("gte-4.0.0/a.js"),
            code: "var a = () => 1",
            env: {es6: true},
        },
        {
            filename: fixture("gte-4.4.0-lt-5.0.0/a.js"),
            code: "var a = () => 1",
            env: {es6: true},
        },
        {
            filename: fixture("hat-4.1.2/a.js"),
            code: "var a = () => 1",
            env: {es6: true},
        },
    ],
    invalid: [
        {
            filename: fixture("gte-0.12.8/a.js"),
            code: "var a = () => 1",
            env: {es6: true},
            errors: ["Arrow Functions are not supported yet on Node v0.12."],
        },
        {
            filename: fixture("invalid/a.js"),
            code: "var a = () => 1",
            env: {es6: true},
            errors: ["Arrow Functions are not supported yet on Node v0.10."],
        },
        {
            filename: fixture("lt-6.0.0/a.js"),
            code: "var a = () => 1",
            env: {es6: true},
            errors: ["Arrow Functions are not supported yet on Node v0.10."],
        },
        {
            filename: fixture("nothing/a.js"),
            code: "var a = () => 1",
            env: {es6: true},
            errors: ["Arrow Functions are not supported yet on Node v0.10."],
        },
    ],
}))
