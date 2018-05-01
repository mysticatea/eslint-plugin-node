/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-unsupported-features")

const VERSION_MAP = new Map([
    [0.1, "0.10.0"],
    [0.12, "0.12.0"],
    [4, "4.0.0"],
    [5, "5.0.0"],
    [6, "6.0.0"],
    [6.5, "6.5.0"],
    [7, "7.0.0"],
    [7.6, "7.6.0"],
    [8, "8.0.0"],
    [8.3, "8.3.0"],
    [9, "9.0.0"],
    [10, "10.0.0"],
])

/**
 * Creates test pattern.
 *
 * @param {{valid: object[], invalid: object[]}} retv - Actual test patterns.
 * @param {object} pattern - Original test pattern.
 * @returns {{valid: object[], invalid: object[]}} retv.
 */
function convertPattern(retv, pattern) {
    let i = 0

    // If this test is on script mode, it should do this test on module mode as well.
    if (
        !pattern.modules &&
        pattern.code.indexOf("'use strict'") !== 0 &&
        pattern.name.indexOf("non-strict") === -1
    ) {
        convertPattern(
            retv,
            Object.create(pattern, { modules: { value: true } })
        )
    }

    // Creates error messages.
    const errors = []
    for (i = 0; i < pattern.errors; ++i) {
        errors.push(
            `${pattern.name} ${
                pattern.singular ? "is" : "are"
            } not supported yet on Node `
        )
    }

    // Creates each pattern of Node versions.
    for (const version of VERSION_MAP.keys()) {
        const versionText = VERSION_MAP.get(version)

        // Skips if ignored
        if (pattern.ignores && pattern.ignores.indexOf(version) !== -1) {
            continue
        }

        if (version >= pattern.supported) {
            // If this is supported, add to a valid pattern.
            retv.valid.push({
                code: `/*${pattern.name}: ${versionText}*/ ${pattern.code}`,
                env: { es6: true },
                globals: { SharedArrayBuffer: false, Atomics: false },
                options: [version],
                parserOptions: {
                    ecmaVersion: 2018,
                    sourceType: pattern.modules ? "module" : "script",
                },
            })
        } else {
            // If this is not supported, add to a valid pattern with a "ignores" option.
            ;[].push.apply(
                retv.valid,
                pattern.keys.map(key => ({
                    code: `/*${
                        pattern.name
                    }: ${versionText}, ignores: ["${key}"]*/ ${pattern.code}`,
                    env: { es6: true },
                    globals: { SharedArrayBuffer: false, Atomics: false },
                    options: [{ version, ignores: [key] }],
                    parserOptions: {
                        ecmaVersion: 2018,
                        sourceType: pattern.modules ? "module" : "script",
                    },
                }))
            )

            // If this is not supported, add to a invalid pattern.
            retv.invalid.push({
                code: `/*${pattern.name}: ${versionText}*/ ${pattern.code}`,
                env: { es6: true },
                globals: { SharedArrayBuffer: false, Atomics: false },
                options: [version],
                parserOptions: {
                    ecmaVersion: 2018,
                    sourceType: pattern.modules ? "module" : "script",
                },
                errors: errors.map(message => `${message + versionText}.`),
            })
        }
    }

    return retv
}

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(
        __dirname,
        "../../fixtures/no-unsupported-features",
        name
    )
}

const ruleTester = new RuleTester()
ruleTester.run(
    "no-unsupported-features",
    rule,
    [
        {
            keys: ["defaultParameters", "syntax"],
            name: "Default parameters",
            code: "function foo(a = 1) {} ;(function(a = 1) {})()",
            errors: 2,
            supported: 6,
        },
        {
            keys: ["restParameters", "syntax"],
            name: "Rest parameters",
            code: "function foo(a, ...b) {} ;(function(a, ...b) {})()",
            errors: 2,
            supported: 6,
        },
        {
            keys: ["spreadOperators", "syntax"],
            name: "Spread operators",
            code: "foo(...a); foo([...a, ...b])",
            errors: 3,
            supported: 5,
        },
        {
            keys: ["objectLiteralExtensions", "syntax"],
            name: "Object literal extensions",
            code: "var obj = {[a]: 0, b, c() {}, get [d]() {}, set [d](v) {}}",
            errors: 5,
            supported: 4,
        },
        {
            keys: [
                "objectPropertyShorthandOfGetSet",
                "objectLiteralExtensions",
                "syntax",
            ],
            name: "Property shorthand of 'get' and 'set'",
            code: "var obj = {get, set}",
            errors: 2,
            supported: 6,
        },
        {
            keys: ["forOf", "syntax"],
            name: "'for..of' loops",
            code: "for (var a of []) {}",
            errors: 1,
            supported: 0.12,
        },
        {
            keys: ["binaryNumberLiterals", "syntax"],
            name: "Binary number literals",
            code: "var a = 0b10 === 2 && 0B10 === 2",
            errors: 2,
            supported: 4,
        },
        {
            keys: ["octalNumberLiterals", "syntax"],
            name: "Octal number literals",
            code: "var a = 0o10 === 8 && 0O10 === 8",
            errors: 2,
            supported: 4,
        },
        {
            keys: ["templateStrings", "syntax"],
            name: "Template strings",
            code: "`hello, ${world}!`; foo`tagged`;", //eslint-disable-line no-template-curly-in-string
            errors: 2,
            supported: 4,
        },
        {
            keys: ["regexpY", "syntax"],
            name: "RegExp 'y' flags",
            code: "new RegExp('', 'y'); (/a/y)",
            errors: 2,
            supported: 6,
        },
        {
            keys: ["regexpU", "syntax"],
            name: "RegExp 'u' flags",
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
            name: "Unicode code point escapes",
            code: "var \\u{102C0} = { \\u{102C0} : '\\u{1d306}' };",
            errors: 3,
            supported: 4,
        },
        {
            keys: ["new.target", "syntax"],
            name: "'new.target'",
            code:
                "function Foo() { new.target; } ;(function() { new.target; })()",
            errors: 2,
            supported: 5,
        },
        {
            keys: ["const", "syntax"],
            name: "'const' declarations",
            code: "'use strict'; const a = 0;",
            errors: 1,
            supported: 4,
        },
        {
            keys: ["const", "syntax"],
            name: "'const' declarations",
            code: "const a = 0;",
            errors: 1,
            supported: 4,
            modules: true,
        },
        {
            keys: ["const", "syntax"],
            name: "'const' declarations in non-strict mode",
            code: "const a = 0;",
            errors: 1,
            supported: 6,
            ignores: [0.1, 0.12],
        },
        {
            keys: ["let", "syntax"],
            name: "'let' declarations",
            code: "'use strict'; let a = 0;",
            errors: 1,
            supported: 4,
        },
        {
            keys: ["let", "syntax"],
            name: "'let' declarations",
            code: "let a = 0;",
            errors: 1,
            supported: 4,
            modules: true,
        },
        {
            keys: ["let", "syntax"],
            name: "'let' declarations in non-strict mode",
            code: "let a = 0;",
            errors: 1,
            supported: 6,
            ignores: [0.1, 0.12],
        },
        {
            keys: ["blockScopedFunctions", "syntax"],
            name: "Block-scoped functions",
            code:
                "'use strict'; { function foo() {} } if (a) { function foo() {} }",
            errors: 2,
            supported: 4,
        },
        {
            keys: ["blockScopedFunctions", "syntax"],
            name: "Block-scoped functions",
            code: "{ function foo() {} } if (a) { function foo() {} }",
            errors: 2,
            supported: 4,
            modules: true,
        },
        {
            keys: ["blockScopedFunctions", "syntax"],
            name: "Block-scoped functions in non-strict mode",
            code: "{ function foo() {} } if (a) { function foo() {} }",
            errors: 2,
            supported: 6,
            ignores: [0.1, 0.12],
        },
        {
            keys: ["arrowFunctions", "syntax"],
            name: "Arrow functions",
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
            ignores: [0.1, 0.12],
        },
        {
            keys: ["generatorFunctions", "syntax"],
            name: "Generator functions",
            code: "function* foo() {} ;(function*() {})();",
            errors: 2,
            supported: 4,
        },
        {
            keys: ["modules", "syntax"],
            name: "Import and export declarations",
            code:
                "import foo from 'foo'; export default 0; export {foo}; export * from 'foo';",
            errors: 4,
            supported: NaN,
            modules: true,
        },
        {
            keys: ["exponentialOperators", "syntax"],
            name: "Exponential operators (**)",
            code: "var a = 2 ** 10; a **= 10;",
            errors: 2,
            supported: 7,
        },
        {
            keys: ["asyncAwait", "syntax"],
            name: "Async functions",
            code: [
                "async function foo() { await obj; };",
                "(async function() { await obj; });",
                "(async () => { await obj; });",
                "({async foo() { await obj; }});",
                "class A { async foo() { await obj; } };",
            ].join("\n"),
            errors: 10,
            supported: 7.6,
            ignores: [0.1, 0.12, 4, 5],
        },
        {
            keys: ["trailingCommasInFunctions", "syntax"],
            name: "Trailing commas in functions",
            code: [
                "function foo(a,) {}",
                "(function(a,) {});",
                "((a,) => {});",
                "({ foo(a,) {} });",
                "class A { foo(a,) {} };",
                "foo(a,);",
                "new Foo(a,);",
            ].join("\n"),
            errors: 7,
            supported: 8,
            ignores: [0.1, 0.12, 4, 5],
        },
        {
            keys: ["templateLiteralRevision", "syntax"],
            name: "Illegal escape sequences in taggled templates",
            code: [
                //eslint-disable-next-line no-template-curly-in-string
                "tag`\\01\\1\\xg\\xAg\\u0\\u0g\\u00g\\u000g\\u{g\\u{0\\u{110000}${0}\\0`",
            ].join("\n"),
            errors: 1,
            supported: 9,
            ignores: [0.1, 0.12, 4, 5],
        },
        {
            keys: ["regexpS", "syntax"],
            name: "RegExp 's' flags",
            code: "new RegExp('', 's'); (/a/s)",
            errors: 2,
            supported: 9,
        },
        {
            keys: ["regexpNamedCaptureGroups", "syntax"],
            name: "RegExp named capture groups",
            code: [
                "new RegExp('(?<a>b)');",
                //TODO: Espree has not supported this syntax yet.
                // ";(/(?<a>b)/)",
            ].join("\n"),
            errors: 1,
            supported: 10,
        },
        {
            keys: ["regexpLookbehind", "syntax"],
            name: "RegExp lookbehind assertions",
            code: [
                "new RegExp('(?<=a)b')",
                "new RegExp('(?<!a)b')",
                //TODO: Espree has not supported this syntax yet.
                // ";(/(?<=a)b/)",
                // ";(/(?<!a)b/)",
            ].join("\n"),
            errors: 2,
            supported: 9,
        },
        {
            keys: ["regexpUnicodeProperties", "syntax"],
            name: "RegExp Unicode property escapes",
            code: [
                "new RegExp('\\\\p{Script=Greek}');",
                ";(/\\p{Script=Greek}/)",
            ].join("\n"),
            errors: 2,
            supported: 10,
        },
        {
            keys: ["restProperties", "syntax"],
            name: "Rest properties",
            code: ["({...rest} = obj)", "function f({...rest}) {}"].join("\n"),
            errors: 2,
            supported: 8.3,
            ignores: [0.1, 0.12, 4, 5],
        },
        {
            keys: ["spreadProperties", "syntax"],
            name: "Spread properties",
            code: ["obj = {...a, ...b}"].join("\n"),
            errors: 2,
            supported: 8.3,
            ignores: [0.1, 0.12, 4, 5],
        },
        {
            keys: ["asyncGenerators", "syntax"],
            name: "Async generators",
            code: [
                "async function* f1() {}",
                ";(async function*() {})",
                ";({ async* f() {} })",
                "class A { async* f() {} }",
                "class B { static async* f() {} }",
                ";(class { async* f() {} })",
                ";(class { static async* f() {} })",
            ].join("\n"),
            errors: 7,
            supported: 10,
            ignores: [0.1, 0.12, 4, 5, 6, 6.5, 7],
        },
        {
            keys: ["forAwaitOf", "syntax"],
            name: "for-await-of loops",
            code: ["async function f1() { for await (const x of xs) {} }"].join(
                "\n"
            ),
            errors: 1,
            supported: 10,
            ignores: [0.1, 0.12, 4, 5, 6, 6.5, 7],
        },

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
            keys: [
                "Uint8ClampedArray",
                "typedArrays",
                "globalObjects",
                "runtime",
            ],
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
            keys: ["SharedArrayBuffer", "globalObjects", "runtime"],
            name: "'SharedArrayBuffer'",
            code: "SharedArrayBuffer",
            errors: 1,
            supported: 9,
            singular: true,
        },
        {
            keys: ["Atomics", "globalObjects", "runtime"],
            name: "'Atomics'",
            code: "Atomics",
            errors: 1,
            supported: 9,
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
            keys: [
                "Object.getOwnPropertySymbols",
                "Object.*",
                "staticMethods",
                "runtime",
            ],
            name: "'Object.getOwnPropertySymbols'",
            code: "Object.getOwnPropertySymbols",
            errors: 1,
            supported: 0.12,
            singular: true,
        },
        {
            keys: [
                "Object.setPrototypeOf",
                "Object.*",
                "staticMethods",
                "runtime",
            ],
            name: "'Object.setPrototypeOf'",
            code: "Object.setPrototypeOf",
            errors: 1,
            supported: 0.12,
            singular: true,
        },
        {
            keys: ["Object.values", "Object.*", "staticMethods", "runtime"],
            name: "'Object.values'",
            code: "Object.values",
            errors: 1,
            supported: 7,
            singular: true,
        },
        {
            keys: ["Object.entries", "Object.*", "staticMethods", "runtime"],
            name: "'Object.entries'",
            code: "Object.entries",
            errors: 1,
            supported: 7,
            singular: true,
        },
        {
            keys: [
                "Object.getOwnPropertyDescriptors",
                "Object.*",
                "staticMethods",
                "runtime",
            ],
            name: "'Object.getOwnPropertyDescriptors'",
            code: "Object.getOwnPropertyDescriptors",
            errors: 1,
            supported: 7,
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
            keys: [
                "String.fromCodePoint",
                "String.*",
                "staticMethods",
                "runtime",
            ],
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
            supported: 0.1,
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
            keys: [
                "Number.isSafeInteger",
                "Number.*",
                "staticMethods",
                "runtime",
            ],
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
            supported: 0.1,
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
            keys: [
                "Number.MIN_SAFE_INTEGER",
                "Number.*",
                "staticMethods",
                "runtime",
            ],
            name: "'Number.MIN_SAFE_INTEGER'",
            code: "Number.MIN_SAFE_INTEGER",
            errors: 1,
            supported: 0.12,
            singular: true,
        },
        {
            keys: [
                "Number.MAX_SAFE_INTEGER",
                "Number.*",
                "staticMethods",
                "runtime",
            ],
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
            keys: [
                "Symbol.hasInstance",
                "Symbol.*",
                "staticMethods",
                "runtime",
            ],
            name: "'Symbol.hasInstance'",
            code: "Symbol.hasInstance",
            errors: 1,
            supported: 6.5,
            singular: true,
        },
        {
            keys: [
                "Symbol.isConcatSpreadablec",
                "Symbol.*",
                "staticMethods",
                "runtime",
            ],
            name: "'Symbol.isConcatSpreadablec'",
            code: "Symbol.isConcatSpreadablec",
            errors: 1,
            supported: 6,
            singular: true,
        },
        {
            keys: ["Symbol.iterator", "Symbol.*", "staticMethods", "runtime"],
            name: "'Symbol.iterator'",
            code: "Symbol.iterator",
            errors: 1,
            supported: 0.12,
            singular: true,
        },
        {
            keys: ["Symbol.species", "Symbol.*", "staticMethods", "runtime"],
            name: "'Symbol.species'",
            code: "Symbol.species",
            errors: 1,
            supported: 6.5,
            singular: true,
        },
        {
            keys: ["Symbol.replace", "Symbol.*", "staticMethods", "runtime"],
            name: "'Symbol.replace'",
            code: "Symbol.replace",
            errors: 1,
            supported: 6,
            singular: true,
        },
        {
            keys: ["Symbol.search", "Symbol.*", "staticMethods", "runtime"],
            name: "'Symbol.search'",
            code: "Symbol.search",
            errors: 1,
            supported: 6,
            singular: true,
        },
        {
            keys: ["Symbol.split", "Symbol.*", "staticMethods", "runtime"],
            name: "'Symbol.split'",
            code: "Symbol.split",
            errors: 1,
            supported: 6,
            singular: true,
        },
        {
            keys: ["Symbol.match", "Symbol.*", "staticMethods", "runtime"],
            name: "'Symbol.match'",
            code: "Symbol.match",
            errors: 1,
            supported: 6,
            singular: true,
        },
        {
            keys: [
                "Symbol.toPrimitive",
                "Symbol.*",
                "staticMethods",
                "runtime",
            ],
            name: "'Symbol.toPrimitive'",
            code: "Symbol.toPrimitive",
            errors: 1,
            supported: 6,
            singular: true,
        },
        {
            keys: [
                "Symbol.toStringTag",
                "Symbol.*",
                "staticMethods",
                "runtime",
            ],
            name: "'Symbol.toStringTag'",
            code: "Symbol.toStringTag",
            errors: 1,
            supported: 6,
            singular: true,
        },
        {
            keys: [
                "Symbol.unscopables",
                "Symbol.*",
                "staticMethods",
                "runtime",
            ],
            name: "'Symbol.unscopables'",
            code: "Symbol.unscopables",
            errors: 1,
            supported: 4,
            singular: true,
        },

        {
            keys: ["Atomics.add", "Atomics.*", "staticMethods", "runtime"],
            name: "'Atomics.add'",
            code: "Atomics.add",
            errors: 1,
            supported: 9,
            singular: true,
        },
        {
            keys: ["Atomics.and", "Atomics.*", "staticMethods", "runtime"],
            name: "'Atomics.and'",
            code: "Atomics.and",
            errors: 1,
            supported: 9,
            singular: true,
        },
        {
            keys: [
                "Atomics.compareExchange",
                "Atomics.*",
                "staticMethods",
                "runtime",
            ],
            name: "'Atomics.compareExchange'",
            code: "Atomics.compareExchange",
            errors: 1,
            supported: 9,
            singular: true,
        },
        {
            keys: ["Atomics.exchange", "Atomics.*", "staticMethods", "runtime"],
            name: "'Atomics.exchange'",
            code: "Atomics.exchange",
            errors: 1,
            supported: 9,
            singular: true,
        },
        {
            keys: ["Atomics.wait", "Atomics.*", "staticMethods", "runtime"],
            name: "'Atomics.wait'",
            code: "Atomics.wait",
            errors: 1,
            supported: 9,
            singular: true,
        },
        {
            keys: ["Atomics.wake", "Atomics.*", "staticMethods", "runtime"],
            name: "'Atomics.wake'",
            code: "Atomics.wake",
            errors: 1,
            supported: 9,
            singular: true,
        },
        {
            keys: [
                "Atomics.isLockFree",
                "Atomics.*",
                "staticMethods",
                "runtime",
            ],
            name: "'Atomics.isLockFree'",
            code: "Atomics.isLockFree",
            errors: 1,
            supported: 9,
            singular: true,
        },
        {
            keys: ["Atomics.load", "Atomics.*", "staticMethods", "runtime"],
            name: "'Atomics.load'",
            code: "Atomics.load",
            errors: 1,
            supported: 9,
            singular: true,
        },
        {
            keys: ["Atomics.or", "Atomics.*", "staticMethods", "runtime"],
            name: "'Atomics.or'",
            code: "Atomics.or",
            errors: 1,
            supported: 9,
            singular: true,
        },
        {
            keys: ["Atomics.store", "Atomics.*", "staticMethods", "runtime"],
            name: "'Atomics.store'",
            code: "Atomics.store",
            errors: 1,
            supported: 9,
            singular: true,
        },
        {
            keys: ["Atomics.sub", "Atomics.*", "staticMethods", "runtime"],
            name: "'Atomics.sub'",
            code: "Atomics.sub",
            errors: 1,
            supported: 9,
            singular: true,
        },
        {
            keys: ["Atomics.xor", "Atomics.*", "staticMethods", "runtime"],
            name: "'Atomics.xor'",
            code: "Atomics.xor",
            errors: 1,
            supported: 9,
            singular: true,
        },

        {
            keys: ["extendsArray", "extends", "runtime"],
            name: "Subclassing of 'Array'",
            code: "'use strict'; class X extends Array {}",
            errors: 1,
            supported: 6,
            ignores: [0.1, 0.12],
            singular: true,
        },
        {
            keys: ["extendsRegExp", "extends", "runtime"],
            name: "Subclassing of 'RegExp'",
            code: "'use strict'; class X extends RegExp {}",
            errors: 1,
            supported: 5,
            ignores: [0.1, 0.12],
            singular: true,
        },
        {
            keys: ["extendsFunction", "extends", "runtime"],
            name: "Subclassing of 'Function'",
            code: "'use strict'; class X extends Function {}",
            errors: 1,
            supported: 6,
            ignores: [0.1, 0.12],
            singular: true,
        },
        {
            keys: ["extendsPromise", "extends", "runtime"],
            name: "Subclassing of 'Promise'",
            code: "'use strict'; class X extends Promise {}",
            errors: 1,
            supported: 5,
            ignores: [0.1, 0.12],
            singular: true,
        },
        {
            keys: ["extendsBoolean", "extends", "runtime"],
            name: "Subclassing of 'Boolean'",
            code: "'use strict'; class X extends Boolean {}",
            errors: 1,
            supported: 4,
            ignores: [0.1, 0.12],
            singular: true,
        },
        {
            keys: ["extendsNumber", "extends", "runtime"],
            name: "Subclassing of 'Number'",
            code: "'use strict'; class X extends Number {}",
            errors: 1,
            supported: 4,
            ignores: [0.1, 0.12],
            singular: true,
        },
        {
            keys: ["extendsString", "extends", "runtime"],
            name: "Subclassing of 'String'",
            code: "'use strict'; class X extends String {}",
            errors: 1,
            supported: 4,
            ignores: [0.1, 0.12],
            singular: true,
        },
        {
            keys: ["extendsMap", "extends", "runtime"],
            name: "Subclassing of 'Map'",
            code: "'use strict'; class X extends Map {}",
            errors: 1,
            supported: 4,
            ignores: [0.1, 0.12],
            singular: true,
        },
        {
            keys: ["extendsSet", "extends", "runtime"],
            name: "Subclassing of 'Set'",
            code: "'use strict'; class X extends Set {}",
            errors: 1,
            supported: 4,
            ignores: [0.1, 0.12],
            singular: true,
        },
        {
            keys: ["extendsNull", "extends", "runtime"],
            name: "'extends null'",
            code: "'use strict'; class X extends null {}",
            errors: 1,
            supported: NaN,
            ignores: [0.1, 0.12],
            singular: true,
        },
    ].reduce(convertPattern, {
        valid: [
            {
                filename: fixture("gte-4.0.0/a.js"),
                code: "var a = () => 1",
                env: { es6: true },
            },
            {
                filename: fixture("gte-4.4.0-lt-5.0.0/a.js"),
                code: "var a = () => 1",
                env: { es6: true },
            },
            {
                filename: fixture("hat-4.1.2/a.js"),
                code: "var a = () => 1",
                env: { es6: true },
            },
            {
                code: "'\\\\u{0123}'",
                env: { es6: true },
            },
            {
                filename: fixture("gte-4.0.0/a.js"),
                code: "var a = async () => 1",
                parserOptions: { ecmaVersion: 2017 },
                options: [{ ignores: ["asyncAwait"] }],
            },
            {
                filename: fixture("gte-7.6.0/a.js"),
                code: "var a = async () => 1",
                parserOptions: { ecmaVersion: 2017 },
            },
            {
                filename: fixture("gte-7.10.0/a.js"),
                code: "var a = async () => 1",
                parserOptions: { ecmaVersion: 2017 },
            },
            {
                filename: fixture("invalid/a.js"),
                code: "var a = () => 1",
                env: { es6: true },
            },
            {
                filename: fixture("nothing/a.js"),
                code: "var a = () => 1",
                env: { es6: true },
            },
            {
                code: "var a = async () => 1",
                parserOptions: { ecmaVersion: 2017 },
                options: ["7.10.0"],
            },
            {
                filename: fixture("without-node/a.js"),
                code: "var a = () => 1",
                env: { es6: true },
            },
        ],
        invalid: [
            {
                filename: fixture("gte-0.12.8/a.js"),
                code: "var a = () => 1",
                env: { es6: true },
                errors: [
                    "Arrow functions are not supported yet on Node >=0.12.8.",
                ],
            },
            {
                filename: fixture("invalid/a.js"),
                code: "var a = (b,) => 1",
                parserOptions: { ecmaVersion: 2017 },
                env: { es6: true },
                errors: [
                    "Trailing commas in functions are not supported yet on Node 4.0.0.",
                ],
            },
            {
                filename: fixture("lt-6.0.0/a.js"),
                code: "var a = () => 1",
                parserOptions: { ecmaVersion: 2017 },
                env: { es6: true },
                errors: [
                    "Arrow functions are not supported yet on Node <6.0.0.",
                ],
            },
            {
                filename: fixture("nothing/a.js"),
                code: "var a = (b,) => 1",
                parserOptions: { ecmaVersion: 2017 },
                env: { es6: true },
                errors: [
                    "Trailing commas in functions are not supported yet on Node 4.0.0.",
                ],
            },
            {
                filename: fixture("gte-7.5.0/a.js"),
                code: "var a = async () => 1",
                parserOptions: { ecmaVersion: 2017 },
                errors: [
                    "Async functions are not supported yet on Node >=7.5.0.",
                ],
            },
            {
                code: "var a = async () => 1",
                parserOptions: { ecmaVersion: 2017 },
                options: ["7.1.0"],
                errors: [
                    "Async functions are not supported yet on Node 7.1.0.",
                ],
            },
        ],
    })
)
