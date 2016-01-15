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

    var errors = [];
    for (i = 0; i < pattern.errors; ++i) {
        errors.push(
            pattern.name + " " + (pattern.singular ? "is" : "are") +
            " not supported yet on Node v"
        );
    }

    for (i = 0; i < VERSIONS.length; ++i) {
        var version = VERSIONS[i];
        var versionText = version < 1 ? version.toFixed(2) : version.toFixed(0);

        if (pattern.ignores && pattern.ignores.indexOf(version) !== -1) {
            continue;
        }

        if (version >= pattern.supported) {
            retv.valid.push({
                code: "/*" + pattern.name + ": " + versionText + "*/ " + pattern.code,
                env: {es6: true},
                options: [version],
                ecmaFeatures: {modules: Boolean(pattern.modules)},
                parserOptions: {sourceType: pattern.modules ? "module" : "script"}
            });
        }
        else {
            retv.valid.push({
                code: "/*" + pattern.name + ": " + versionText + ", ignores: [\"" + pattern.key + "\"]*/ " + pattern.code,
                env: {es6: true},
                options: [{version: version, ignores: [pattern.key]}],
                ecmaFeatures: {modules: Boolean(pattern.modules)},
                parserOptions: {sourceType: pattern.modules ? "module" : "script"}
            });
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
        name: "For..of Loops",
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
        name: "RegExp \"y\" Flags",
        code: "new RegExp('', 'y'); (/a/y)",
        errors: 2,
        supported: NaN
    },
    {
        key: "regexpU",
        name: "RegExp \"u\" Flags",
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
    // TODO: ESLint cannot parse unicode code point escapes.
    // {
    //     key: "unicodeCodePointEscapes",
    //     name: "Unicode Code Point Escapes",
    //     code: "var \\u{102C0} = { \\u{102C0} : '\\u{1d306}' };",
    //     errors: 3,
    //     supported: 4
    // },
    {
        key: "newTarget",
        name: "\"new.target\"",
        code: "function Foo() { new.target; } ;(function() { new.target; })()",
        errors: 2,
        supported: 5
    },
    {
        key: "const",
        name: "\"const\" Declarations",
        code: "'use strict'; const a = 0;",
        errors: 1,
        supported: 4
    },
    {
        key: "const",
        name: "\"const\" Declarations",
        code: "const a = 0;",
        errors: 1,
        supported: 4,
        modules: true
    },
    {
        key: "const",
        name: "\"const\" Declarations in non-strict mode",
        code: "const a = 0;",
        errors: 1,
        supported: NaN,
        ignores: [0.10, 0.12]
    },
    {
        key: "let",
        name: "\"let\" Declarations",
        code: "'use strict'; let a = 0;",
        errors: 1,
        supported: 4
    },
    {
        key: "let",
        name: "\"let\" Declarations",
        code: "let a = 0;",
        errors: 1,
        supported: 4,
        modules: true
    },
    {
        key: "let",
        name: "\"let\" Declarations in non-strict mode",
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
        key: "typedArrays",
        name: "Typed Arrays",
        code: "Int8Array; Uint8Array; Uint8ClampedArray; Int16Array; Uint16Array; Int32Array; Uint32Array; Float32Array; Float64Array; DataView",
        errors: 10,
        supported: 0.12
    },
    {
        key: "mapSet",
        name: "Map and Set",
        code: "Map; Set",
        errors: 2,
        supported: 0.12
    },
    {
        key: "weakMapSet",
        name: "WeakMap and WeakSet",
        code: "WeakMap; WeakSet",
        errors: 2,
        supported: 0.12
    },
    {
        key: "proxy",
        name: "Proxy",
        code: "Proxy",
        errors: 1,
        supported: NaN,
        singular: true
    },
    {
        key: "reflect",
        name: "Reflect",
        code: "Reflect",
        errors: 1,
        supported: NaN,
        singular: true
    },
    {
        key: "promise",
        name: "Promise",
        code: "Promise",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "promise",
        name: "Promise",
        code: "var Promise = require('promise'); new Promise()",
        errors: 0,
        supported: 0,
        singular: true
    },
    {
        key: "symbol",
        name: "Symbol",
        code: "Symbol",
        errors: 1,
        supported: 0.12,
        singular: true
    },
    {
        key: "modules",
        name: "Import and Export Declarations",
        code: "import foo from 'foo'; export default 0; export {foo}; export * from 'foo';",
        errors: 4,
        supported: NaN,
        modules: true
    }
].reduce(convertPattern, {valid: [], invalid: []}));
