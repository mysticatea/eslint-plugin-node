/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-unsupported-features");
var RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var VERSIONS = Object.freeze([0.10, 0.12, 4, 5]);

/**
 * Creates test pattern.
 *
 * @param {{valid: object[], invalid: object[]}} retv - Actual test patterns.
 * @param {object} pattern - Original test pattern.
 * @returns {{valid: object[], invalid: object[]}} retv.
 */
function convertPattern(retv, pattern) {
    var i;

    // Creates error messages.
    var errors = [];
    for (i = 0; i < pattern.errors; ++i) {
        errors.push(
            pattern.name + " " + (pattern.singular ? "is" : "are") +
            " not supported yet on Node v"
        );
    }

    // Creates each pattern of Node versions.
    for (i = 0; i < VERSIONS.length; ++i) {
        var version = VERSIONS[i];
        var versionText = version < 1 ? version.toFixed(2) : version.toFixed(0);

        // Skips if ignored
        if (pattern.ignores && pattern.ignores.indexOf(version) !== -1) {
            continue;
        }

        if (version >= pattern.supported) {
            // If this is supported, add to a valid pattern.
            retv.valid.push({
                code: "/*" + pattern.name + ": " + versionText + "*/ " + pattern.code,
                env: {es6: true},
                options: [version],
                ecmaFeatures: {modules: Boolean(pattern.modules)},
                parserOptions: {sourceType: pattern.modules ? "module" : "script"}
            });
        }
        else {
            // If this is not supported, add to a valid pattern with a "ignores" option.
            retv.valid.push({
                code: "/*" + pattern.name + ": " + versionText + ", ignores: [\"" + pattern.key + "\"]*/ " + pattern.code,
                env: {es6: true},
                options: [{version: version, ignores: [pattern.key]}],
                ecmaFeatures: {modules: Boolean(pattern.modules)},
                parserOptions: {sourceType: pattern.modules ? "module" : "script"}
            });

            // If this is not supported, add to a invalid pattern.
            retv.invalid.push({
                code: "/*" + pattern.name + ": " + versionText + "*/ " + pattern.code,
                env: {es6: true},
                options: [version],
                ecmaFeatures: {modules: Boolean(pattern.modules)},
                parserOptions: {sourceType: pattern.modules ? "module" : "script"},
                errors: errors.map(function(message) { // eslint-disable-line no-loop-func
                    return message + versionText + ".";
                })
            });
        }
    }

    return retv;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-unsupported-features", rule, [
    //--------------------------------------------------------------------------
    // Syntax
    //--------------------------------------------------------------------------

    {
        key: "defaultParameters",
        name: "Default Parameters",
        code: "function foo(a = 1) {} ;(function(a = 1) {})()",
        errors: 2,
        supported: NaN
    },
    {
        key: "restParameters",
        name: "Rest Parameters",
        code: "function foo(a, ...b) {} ;(function(a, ...b) {})()",
        errors: 2,
        supported: NaN
    },
    {
        key: "spreadOperators",
        name: "Spread Operators",
        code: "foo(...a); foo([...a, ...b])",
        errors: 3,
        supported: 5
    },
    {
        key: "objectLiteralExtensions",
        name: "Object Literal Extensions",
        code: "var obj = {[a]: 0, b, c() {}, get [d]() {}, set [d](v) {}}",
        errors: 5,
        supported: 4
    },
    {
        key: "forOf",
        name: "'for..of' Loops",
        code: "for (var a of []) {}",
        errors: 1,
        supported: 0.12
    },
    {
        key: "binaryNumberLiterals",
        name: "Binary Number Literals",
        code: "var a = 0b10 === 2 && 0B10 === 2",
        errors: 2,
        supported: 4
    },
    {
        key: "octalNumberLiterals",
        name: "Octal Number Literals",
        code: "var a = 0o10 === 8 && 0O10 === 8",
        errors: 2,
        supported: 4
    },
    {
        key: "templateStrings",
        name: "Template Strings",
        code: "`hello, ${world}!`; foo`tagged`;",
        errors: 2,
        supported: 4
    },
    {
        key: "regexpY",
        name: "RegExp 'y' Flags",
        code: "new RegExp('', 'y'); (/a/y)",
        errors: 2,
        supported: NaN
    },
    {
        key: "regexpU",
        name: "RegExp 'u' Flags",
        code: "new RegExp('', 'u'); (/a/u)",
        errors: 2,
        supported: NaN
    },
    {
        key: "destructuring",
        name: "Destructuring",
        code: "var [[a], [b = 1]] = [], {c: {c}, d: {d = 1}} = {};",
        errors: 2,
        supported: NaN
    },
    {
        key: "destructuring",
        name: "Destructuring",
        code: "[[a], [b = 1]] = []; ({c: {c}, d: {d = 1}} = {})",
        errors: 2,
        supported: NaN
    },
    {
        key: "destructuring",
        name: "Destructuring",
        code: "function foo([[a], [b = 1]], {c: {c}, d: {d = 1}}) {}",
        errors: 2,
        supported: NaN
    },
    // TODO: ESLint v1 cannot parse unicode code point escapes.
    // {
    //     key: "unicodeCodePointEscapes",
    //     name: "Unicode Code Point Escapes",
    //     code: "var \\u{102C0} = { \\u{102C0} : '\\u{1d306}' };",
    //     errors: 3,
    //     supported: 4
    // },
    {
        key: "new.target",
        name: "'new.target'",
        code: "function Foo() { new.target; } ;(function() { new.target; })()",
        errors: 2,
        supported: 5
    },
    {
        key: "const",
        name: "'const' Declarations",
        code: "'use strict'; const a = 0;",
        errors: 1,
        supported: 4
    },
    {
        key: "const",
        name: "'const' Declarations",
        code: "const a = 0;",
        errors: 1,
        supported: 4,
        modules: true
    },
    {
        key: "const",
        name: "'const' Declarations in non-strict mode",
        code: "const a = 0;",
        errors: 1,
        supported: NaN,
        ignores: [0.10, 0.12]
    },
    {
        key: "let",
        name: "'let' Declarations",
        code: "'use strict'; let a = 0;",
        errors: 1,
        supported: 4
    },
    {
        key: "let",
        name: "'let' Declarations",
        code: "let a = 0;",
        errors: 1,
        supported: 4,
        modules: true
    },
    {
        key: "let",
        name: "'let' Declarations in non-strict mode",
        code: "let a = 0;",
        errors: 1,
        supported: NaN,
        ignores: [0.10, 0.12]
    },
    {
        key: "blockScopedFunctions",
        name: "Block-Scoped Functions",
        code: "'use strict'; { function foo() {} } if (a) { function foo() {} }",
        errors: 2,
        supported: 4
    },
    {
        key: "blockScopedFunctions",
        name: "Block-Scoped Functions",
        code: "{ function foo() {} } if (a) { function foo() {} }",
        errors: 2,
        supported: 4,
        modules: true
    },
    {
        key: "blockScopedFunctions",
        name: "Block-Scoped Functions in non-strict mode",
        code: "{ function foo() {} } if (a) { function foo() {} }",
        errors: 2,
        supported: NaN,
        ignores: [0.10, 0.12]
    },
    {
        key: "arrowFunctions",
        name: "Arrow Functions",
        code: "var a = () => 1",
        errors: 1,
        supported: 4
    },
    {
        key: "classes",
        name: "Classes",
        code: "'use strict'; class A {} new (class{})()",
        errors: 2,
        supported: 4
    },
    {
        key: "classes",
        name: "Classes",
        code: "class A {} new (class{})()",
        errors: 2,
        supported: 4,
        modules: true
    },
    {
        key: "classes",
        name: "Classes in non-strict mode",
        code: "class A {} new (class{})()",
        errors: 2,
        supported: NaN,
        ignores: [0.10, 0.12]
    },
    {
        key: "generatorFunctions",
        name: "Generator Functions",
        code: "function* foo() {} ;(function*() {})();",
        errors: 2,
        supported: 4
    },
    {
        key: "modules",
        name: "Import and Export Declarations",
        code: "import foo from 'foo'; export default 0; export {foo}; export * from 'foo';",
        errors: 4,
        supported: NaN,
        modules: true
    },

    //--------------------------------------------------------------------------
    // Runtime
    //--------------------------------------------------------------------------

    {
        key: "Object.assign",
        name: "'Object.assign'",
        code: "Object.assign; Object['assign']",
        errors: 2,
        supported: 4,
        singular: true
    },
    {
        key: "Object.is",
        name: "'Object.is'",
        code: "Object.is",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Object.getOwnPropertySymbols",
        name: "'Object.getOwnPropertySymbols'",
        code: "Object.getOwnPropertySymbols",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Object.setPrototypeOf",
        name: "'Object.setPrototypeOf'",
        code: "Object.setPrototypeOf",
        errors: 1,
        supported: 0.12,
        singular: true
    },

    {
        key: "String.raw",
        name: "'String.raw'",
        code: "String.raw",
        errors: 1,
        supported: 4,
        singular: true
    },
    {
        key: "String.fromCodePoint",
        name: "'String.fromCodePoint'",
        code: "String.fromCodePoint",
        errors: 1,
        supported: 4,
        singular: true
    },

    {
        key: "Array.from",
        name: "'Array.from'",
        code: "Array.from",
        errors: 1,
        supported: 4,
        singular: true
    },
    {
        key: "Array.of",
        name: "'Array.of'",
        code: "Array.of",
        errors: 1,
        supported: 4,
        singular: true
    },

    {
        key: "Number.isFinite",
        name: "'Number.isFinite'",
        code: "Number.isFinite",
        errors: 1,
        supported: 0.10,
        singular: true
    },
    {
        key: "Number.isInteger",
        name: "'Number.isInteger'",
        code: "Number.isInteger",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Number.isSafeInteger",
        name: "'Number.isSafeInteger'",
        code: "Number.isSafeInteger",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Number.isNaN",
        name: "'Number.isNaN'",
        code: "Number.isNaN",
        errors: 1,
        supported: 0.10,
        singular: true
    },
    {
        key: "Number.EPSILON",
        name: "'Number.EPSILON'",
        code: "Number.EPSILON",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Number.MIN_SAFE_INTEGER",
        name: "'Number.MIN_SAFE_INTEGER'",
        code: "Number.MIN_SAFE_INTEGER",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Number.MAX_SAFE_INTEGER",
        name: "'Number.MAX_SAFE_INTEGER'",
        code: "Number.MAX_SAFE_INTEGER",
        errors: 1,
        supported: 0.12,
        singular: true
    },

    {
        key: "Math.clz32",
        name: "'Math.clz32'",
        code: "Math.clz32",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.imul",
        name: "'Math.imul'",
        code: "Math.imul",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.sign",
        name: "'Math.sign'",
        code: "Math.sign",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.log10",
        name: "'Math.log10'",
        code: "Math.log10",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.log2",
        name: "'Math.log2'",
        code: "Math.log2",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.log1p",
        name: "'Math.log1p'",
        code: "Math.log1p",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.expm1",
        name: "'Math.expm1'",
        code: "Math.expm1",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.cosh",
        name: "'Math.cosh'",
        code: "Math.cosh",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.sinh",
        name: "'Math.sinh'",
        code: "Math.sinh",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.tanh",
        name: "'Math.tanh'",
        code: "Math.tanh",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.acosh",
        name: "'Math.acosh'",
        code: "Math.acosh",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.asinh",
        name: "'Math.asinh'",
        code: "Math.asinh",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.atanh",
        name: "'Math.atanh'",
        code: "Math.atanh",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.trunc",
        name: "'Math.trunc'",
        code: "Math.trunc",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.fround",
        name: "'Math.fround'",
        code: "Math.fround",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.cbrt",
        name: "'Math.cbrt'",
        code: "Math.cbrt",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Math.hypot",
        name: "'Math.hypot'",
        code: "Math.hypot",
        errors: 1,
        supported: 0.12,
        singular: true
    },

    {
        key: "Int8Array",
        name: "'Int8Array'",
        code: "Int8Array",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Uint8Array",
        name: "'Uint8Array'",
        code: "Uint8Array",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Uint8ClampedArray",
        name: "'Uint8ClampedArray'",
        code: "Uint8ClampedArray",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Int16Array",
        name: "'Int16Array'",
        code: "Int16Array",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Uint16Array",
        name: "'Uint16Array'",
        code: "Uint16Array",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Int32Array",
        name: "'Int32Array'",
        code: "Int32Array",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Uint32Array",
        name: "'Uint32Array'",
        code: "Uint32Array",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Float32Array",
        name: "'Float32Array'",
        code: "Float32Array",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Float64Array",
        name: "'Float64Array'",
        code: "Float64Array",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "DataView",
        name: "'DataView'",
        code: "DataView",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Map",
        name: "'Map'",
        code: "Map",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Set",
        name: "'Set'",
        code: "Set",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "WeakMap",
        name: "'WeakMap'",
        code: "WeakMap",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "WeakSet",
        name: "'WeakSet'",
        code: "WeakSet",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Proxy",
        name: "'Proxy'",
        code: "Proxy",
        errors: 1,
        supported: NaN,
        singular: true
    },
    {
        key: "Reflect",
        name: "'Reflect'",
        code: "Reflect",
        errors: 1,
        supported: NaN,
        singular: true
    },
    {
        key: "Promise",
        name: "'Promise'",
        code: "Promise",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "Promise",
        name: "'Promise'",
        code: "var Promise = require('promise'); new Promise()",
        errors: 0,
        supported: 0,
        singular: true
    },
    {
        key: "Symbol",
        name: "'Symbol'",
        code: "Symbol",
        errors: 1,
        supported: 0.12,
        singular: true
    },

    {
        key: "Symbol.hasInstance",
        name: "'Symbol.hasInstance'",
        code: "Symbol.hasInstance",
        errors: 1,
        supported: NaN,
        ignores: [0.10],
        singular: true
    },
    {
        key: "Symbol.isConcatSpreadablec",
        name: "'Symbol.isConcatSpreadablec'",
        code: "Symbol.isConcatSpreadablec",
        errors: 1,
        supported: NaN,
        ignores: [0.10],
        singular: true
    },
    {
        key: "Symbol.iterator",
        name: "'Symbol.iterator'",
        code: "Symbol.iterator",
        errors: 1,
        supported: 0.12,
        ignores: [0.10],
        singular: true
    },
    {
        key: "Symbol.species",
        name: "'Symbol.species'",
        code: "Symbol.species",
        errors: 1,
        supported: NaN,
        ignores: [0.10],
        singular: true
    },
    {
        key: "Symbol.replace",
        name: "'Symbol.replace'",
        code: "Symbol.replace",
        errors: 1,
        supported: NaN,
        ignores: [0.10],
        singular: true
    },
    {
        key: "Symbol.search",
        name: "'Symbol.search'",
        code: "Symbol.search",
        errors: 1,
        supported: NaN,
        ignores: [0.10],
        singular: true
    },
    {
        key: "Symbol.split",
        name: "'Symbol.split'",
        code: "Symbol.split",
        errors: 1,
        supported: NaN,
        ignores: [0.10],
        singular: true
    },
    {
        key: "Symbol.match",
        name: "'Symbol.match'",
        code: "Symbol.match",
        errors: 1,
        supported: NaN,
        ignores: [0.10],
        singular: true
    },
    {
        key: "Symbol.toPrimitive",
        name: "'Symbol.toPrimitive'",
        code: "Symbol.toPrimitive",
        errors: 1,
        supported: NaN,
        ignores: [0.10],
        singular: true
    },
    {
        key: "Symbol.toStringTag",
        name: "'Symbol.toStringTag'",
        code: "Symbol.toStringTag",
        errors: 1,
        supported: NaN,
        ignores: [0.10],
        singular: true
    },
    {
        key: "Symbol.unscopables",
        name: "'Symbol.unscopables'",
        code: "Symbol.unscopables",
        errors: 1,
        supported: 4,
        ignores: [0.10],
        singular: true
    },

    {
        key: "extendsArray",
        name: "Subclassing of 'Array'",
        code: "'use strict'; class X extends Array {}",
        errors: 1,
        supported: NaN,
        ignores: [0.10, 0.12],
        singular: true
    },
    {
        key: "extendsRegExp",
        name: "Subclassing of 'RegExp'",
        code: "'use strict'; class X extends RegExp {}",
        errors: 1,
        supported: 5,
        ignores: [0.10, 0.12],
        singular: true
    },
    {
        key: "extendsFunction",
        name: "Subclassing of 'Function'",
        code: "'use strict'; class X extends Function {}",
        errors: 1,
        supported: NaN,
        ignores: [0.10, 0.12],
        singular: true
    },
    {
        key: "extendsPromise",
        name: "Subclassing of 'Promise'",
        code: "'use strict'; class X extends Promise {}",
        errors: 1,
        supported: 5,
        ignores: [0.10, 0.12],
        singular: true
    },
    {
        key: "extendsBoolean",
        name: "Subclassing of 'Boolean'",
        code: "'use strict'; class X extends Boolean {}",
        errors: 1,
        supported: 4,
        ignores: [0.10, 0.12],
        singular: true
    },
    {
        key: "extendsNumber",
        name: "Subclassing of 'Number'",
        code: "'use strict'; class X extends Number {}",
        errors: 1,
        supported: 4,
        ignores: [0.10, 0.12],
        singular: true
    },
    {
        key: "extendsString",
        name: "Subclassing of 'String'",
        code: "'use strict'; class X extends String {}",
        errors: 1,
        supported: 4,
        ignores: [0.10, 0.12],
        singular: true
    },
    {
        key: "extendsMap",
        name: "Subclassing of 'Map'",
        code: "'use strict'; class X extends Map {}",
        errors: 1,
        supported: 4,
        ignores: [0.10, 0.12],
        singular: true
    },
    {
        key: "extendsSet",
        name: "Subclassing of 'Set'",
        code: "'use strict'; class X extends Set {}",
        errors: 1,
        supported: 4,
        ignores: [0.10, 0.12],
        singular: true
    }
].reduce(convertPattern, {valid: [], invalid: []}));
