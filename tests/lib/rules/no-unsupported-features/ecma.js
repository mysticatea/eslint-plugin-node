/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const RuleTester = require("eslint").RuleTester
const { configs } = require("eslint-plugin-mysticatea")
const rule = require("../../../../lib/rules/no-unsupported-features/ecma")

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(
        __dirname,
        "../../../fixtures/no-unsupported-features--ecma",
        name
    )
}

/**
 * Clone given invalid patterns with adding `ignores` option.
 * @param {string[]} keywords The keywords of `ignores` option.
 * @returns {function(pattern:object):object} The cloned pattern.
 */
function ignores(keywords) {
    return original =>
        keywords.map(key => {
            const pattern = Object.assign({}, original)
            delete pattern.error

            pattern.options = pattern.options.slice()
            pattern.options[0] = Object.assign({}, pattern.options[0])
            if (pattern.options[0].ignores) {
                pattern.options[0].ignores = pattern.options[0].ignores.concat([
                    key,
                ])
            } else {
                pattern.options[0].ignores = [key]
            }

            return pattern
        })
}

/**
 * Concatenate patterns.
 * @param {Array<{valid:Array,invalid:Array}>} patterns The patterns to concat.
 * @returns {{valid:Array,invalid:Array}} The concatenated patterns.
 */
function concat(patterns) {
    const ret = {
        valid: [],
        invalid: [],
    }

    for (const { keywords, valid, invalid } of patterns) {
        ret.valid.push(...valid)
        ret.invalid.push(...invalid)

        // Add the invalid patterns with `ignores` option into the valid patterns.
        for (const ignoringPatterns of invalid.map(ignores(keywords))) {
            ret.valid.push(...ignoringPatterns)
        }
    }

    return ret
}

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 2018 },
    globals: Object.assign({}, configs.es2015.globals, configs.es2017.globals),
})
ruleTester.run(
    "no-unsupported-features/ecma",
    rule,
    concat([
        //----------------------------------------------------------------------
        // ES2015
        //----------------------------------------------------------------------
        {
            keywords: ["arrowFunctions", "syntax"],
            valid: [
                {
                    code: "function f() {}",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "!function f() {}",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "(() => 1)",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "(() => {})",
                    options: [{ version: "4.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "(() => 1)",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-arrow-functions",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "(() => {})",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-arrow-functions",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["binaryNumericLiterals", "syntax"],
            valid: [
                {
                    code: "0x01",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "1",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "0b01",
                    options: [{ version: "4.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "0b01",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-binary-numeric-literals",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["blockScopedFunctions", "syntax"],
            valid: [
                {
                    code: "'use strict'; if (a) { function f() {} }",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code:
                        "'use strict'; function wrap() { if (a) { function f() {} } }",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code:
                        "function wrap() { 'use strict'; if (a) { function f() {} } }",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "if (a) { function f() {} }",
                    options: [{ version: "6.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "'use strict'; if (a) { function f() {} }",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-block-scoped-functions-strict",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "if (a) { function f() {} }",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-block-scoped-functions-sloppy",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["blockScopedVariables", "syntax"],
            valid: [
                {
                    code: "var a = 0",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "'use strict'; let a = 0",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "'use strict'; const a = 0",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "'use strict'; function wrap() { const a = 0 }",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "function wrap() { 'use strict'; const a = 0 }",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "let a = 0",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "const a = 0",
                    options: [{ version: "6.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "'use strict'; let a = 0",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-block-scoped-variables-strict",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "'use strict'; const a = 0",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-block-scoped-variables-strict",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "let a = 0",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-block-scoped-variables-sloppy",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "const a = 0",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-block-scoped-variables-sloppy",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["classes", "syntax"],
            valid: [
                {
                    code: "'use strict'; class A {}",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "'use strict'; function wrap() { class A {} }",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "function wrap() { 'use strict'; class A {} }",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "class A {}",
                    options: [{ version: "6.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "'use strict'; class A {}",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-classes-strict",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "class A {}",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-classes-sloppy",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["computedProperties", "syntax"],
            valid: [
                {
                    code: "({ 0: 0, key: 1, 'key2': 2, key3, key4() {} })",
                    options: [
                        { version: "3.9.9", ignores: ["propertyShorthands"] },
                    ],
                },
                {
                    code: "({ [key]: 1 })",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "({ [key]() {} })",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "class A { [key]() {} }",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "(class { [key]() {} })",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
            ],
            invalid: [
                {
                    code: "({ [key]: 1 })",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-computed-properties",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "({ [key]() {} })",
                    options: [
                        { version: "3.9.9", ignores: ["propertyShorthands"] },
                    ],
                    errors: [
                        {
                            messageId: "no-computed-properties",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "class A { [key]() {} }",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-computed-properties",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "(class { [key]() {} })",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-computed-properties",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["defaultParameters", "syntax"],
            valid: [
                {
                    code: "a = 0",
                    options: [{ version: "5.9.9" }],
                },
                {
                    code: "var a = 0",
                    options: [{ version: "5.9.9" }],
                },
                {
                    code: "var [a = 0] = []",
                    options: [{ version: "5.9.9", ignores: ["destructuring"] }],
                },
                {
                    code: "var {a = 0} = {}",
                    options: [{ version: "5.9.9", ignores: ["destructuring"] }],
                },
                {
                    code: "function f(a = 0) {}",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "(function(a = 0) {})",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "((a = 0) => a)",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "({ key(a = 0) {} })",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "class A { key(a = 0) {} }",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "(class { key(a = 0) {} })",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "function f(a = 0) {}",
                    options: [{ version: "5.9.9", ignores: ["syntax"] }],
                },
                {
                    code: "(function(a = 0) {})",
                    options: [{ version: "5.9.9", ignores: ["syntax"] }],
                },
                {
                    code: "((a = 0) => a)",
                    options: [{ version: "5.9.9", ignores: ["syntax"] }],
                },
                {
                    code: "({ key(a = 0) {} })",
                    options: [{ version: "5.9.9", ignores: ["syntax"] }],
                },
                {
                    code: "class A { key(a = 0) {} }",
                    options: [{ version: "5.9.9", ignores: ["syntax"] }],
                },
                {
                    code: "(class { key(a = 0) {} })",
                    options: [{ version: "5.9.9", ignores: ["syntax"] }],
                },
                {
                    code: "function f(a = 0) {}",
                    options: [
                        { version: "5.9.9", ignores: ["defaultParameters"] },
                    ],
                },
                {
                    code: "(function(a = 0) {})",
                    options: [
                        { version: "5.9.9", ignores: ["defaultParameters"] },
                    ],
                },
                {
                    code: "((a = 0) => a)",
                    options: [
                        { version: "5.9.9", ignores: ["defaultParameters"] },
                    ],
                },
                {
                    code: "({ key(a = 0) {} })",
                    options: [
                        { version: "5.9.9", ignores: ["defaultParameters"] },
                    ],
                },
                {
                    code: "class A { key(a = 0) {} }",
                    options: [
                        {
                            version: "5.9.9",
                            ignores: ["classes", "defaultParameters"],
                        },
                    ],
                },
                {
                    code: "(class { key(a = 0) {} })",
                    options: [
                        {
                            version: "5.9.9",
                            ignores: ["classes", "defaultParameters"],
                        },
                    ],
                },
            ],
            invalid: [
                {
                    code: "function f(a = 0) {}",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-default-parameters",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "(function(a = 0) {})",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-default-parameters",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "((a = 0) => a)",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-default-parameters",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "({ key(a = 0) {} })",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-default-parameters",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "class A { key(a = 0) {} }",
                    options: [{ version: "5.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-default-parameters",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "(class { key(a = 0) {} })",
                    options: [{ version: "5.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-default-parameters",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["destructuring", "syntax"],
            valid: [
                {
                    code: "function f(a = 0) {}",
                    options: [
                        { version: "5.9.9", ignores: ["defaultParameters"] },
                    ],
                },
                {
                    code: "[...a]",
                    options: [{ version: "5.9.9" }],
                },
                {
                    code: "f(...a)",
                    options: [{ version: "5.9.9" }],
                },
                {
                    code: "new A(...a)",
                    options: [{ version: "5.9.9" }],
                },
                {
                    code: "var a = {}",
                    options: [{ version: "5.9.9" }],
                },
                {
                    code: "var {a} = {}",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "var [a] = {}",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "function f({a}) {}",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "function f([a]) {}",
                    options: [{ version: "6.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "var {a} = {}",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-destructuring",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "var [a] = {}",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-destructuring",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "function f({a}) {}",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-destructuring",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "function f([a]) {}",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-destructuring",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                // One error even if it's nested.
                {
                    code: "var {a: {b: [c = 0]}} = {}",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-destructuring",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "var [{a: [b = 0]}] = {}",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-destructuring",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "function f({a: {b: [c = 0]}}) {}",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-destructuring",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "function f([{a: [b = 0]}]) {}",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-destructuring",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["forOfLoops", "syntax"],
            valid: [
                {
                    code: "for (;;);",
                    options: [{ version: "0.11.9" }],
                },
                {
                    code: "for (a in b);",
                    options: [{ version: "0.11.9" }],
                },
                {
                    code: "for (var a in b);",
                    options: [{ version: "0.11.9" }],
                },
                {
                    code: "for (a of b);",
                    options: [{ version: "0.12.0" }],
                },
                {
                    code: "for (var a of b);",
                    options: [{ version: "0.12.0" }],
                },
            ],
            invalid: [
                {
                    code: "for (a of b);",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-for-of-loops",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
                {
                    code: "for (var a of b);",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-for-of-loops",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
                {
                    code: "async function wrap() { for await (var a of b); }",
                    options: [
                        {
                            version: "0.11.9",
                            ignores: ["asyncFunctions", "asyncIteration"],
                        },
                    ],
                    errors: [
                        {
                            messageId: "no-for-of-loops",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["generators", "syntax"],
            valid: [
                {
                    code: "function f() {}",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "async function f() {}",
                    options: [
                        { version: "3.9.9", ignores: ["asyncFunctions"] },
                    ],
                },
                {
                    code: "function* f() {}",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "(function*() {})",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "({ *f() {} })",
                    options: [
                        { version: "4.0.0", ignores: ["propertyShorthands"] },
                    ],
                },
                {
                    code: "class A { *f() {} }",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "(class { *f() {} })",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
            ],
            invalid: [
                {
                    code: "function* f() {}",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-generators",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "(function*() {})",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-generators",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "({ *f() {} })",
                    options: [
                        { version: "3.9.9", ignores: ["propertyShorthands"] },
                    ],
                    errors: [
                        {
                            messageId: "no-generators",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "class A { *f() {} }",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-generators",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "(class { *f() {} })",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-generators",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["modules", "syntax"],
            valid: [
                {
                    code: "require('a')",
                    options: [{ version: "0.0.0" }],
                },
                {
                    code: "module.exports = {}",
                    options: [{ version: "0.0.0" }],
                },
                {
                    code: "exports.a = {}",
                    options: [{ version: "0.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "import a from 'a'",
                    parserOptions: { sourceType: "module" },
                    options: [{ version: "10.0.0" }],
                    errors: [
                        {
                            messageId: "no-modules",
                            data: { version: "10.0.0" },
                        },
                    ],
                },
                {
                    code: "export default {}",
                    parserOptions: { sourceType: "module" },
                    options: [{ version: "10.0.0" }],
                    errors: [
                        {
                            messageId: "no-modules",
                            data: { version: "10.0.0" },
                        },
                    ],
                },
                {
                    code: "export const a = {}",
                    parserOptions: { sourceType: "module" },
                    options: [{ version: "10.0.0" }],
                    errors: [
                        {
                            messageId: "no-modules",
                            data: { version: "10.0.0" },
                        },
                    ],
                },
                {
                    code: "export {}",
                    parserOptions: { sourceType: "module" },
                    options: [{ version: "10.0.0" }],
                    errors: [
                        {
                            messageId: "no-modules",
                            data: { version: "10.0.0" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["new.target", "syntax"],
            valid: [
                {
                    code: "new target",
                    options: [{ version: "4.9.9" }],
                },
                {
                    code: "class A { constructor() { new.target } }",
                    options: [{ version: "5.0.0", ignores: ["classes"] }],
                },
                {
                    code: "function A() { new.target }",
                    options: [{ version: "5.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "class A { constructor() { new.target } }",
                    options: [{ version: "4.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-new-target",
                            data: { supported: "5.0.0", version: "4.9.9" },
                        },
                    ],
                },
                {
                    code: "function A() { new.target }",
                    options: [{ version: "4.9.9" }],
                    errors: [
                        {
                            messageId: "no-new-target",
                            data: { supported: "5.0.0", version: "4.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["objectSuperProperties", "syntax"],
            valid: [
                {
                    code: "class A { foo() { super.foo } }",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                },
                {
                    code: "(class { foo() { super.foo } })",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                },
                {
                    code: "class A extends B { constructor() { super() } }",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                },
                {
                    code: "({ foo() { super.foo } })",
                    options: [
                        { version: "4.0.0", ignores: ["propertyShorthands"] },
                    ],
                },
                {
                    code: "({ foo() { super.foo() } })",
                    options: [
                        { version: "4.0.0", ignores: ["propertyShorthands"] },
                    ],
                },
            ],
            invalid: [
                {
                    code: "({ foo() { super.foo } })",
                    options: [
                        { version: "3.9.9", ignores: ["propertyShorthands"] },
                    ],
                    errors: [
                        {
                            messageId: "no-object-super-properties",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "({ foo() { super.foo() } })",
                    options: [
                        { version: "3.9.9", ignores: ["propertyShorthands"] },
                    ],
                    errors: [
                        {
                            messageId: "no-object-super-properties",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["octalNumericLiterals", "syntax"],
            valid: [
                {
                    code: "0755",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "0x755",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "0X755",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "0b01",
                    options: [
                        {
                            version: "3.9.9",
                            ignores: ["binaryNumericLiterals"],
                        },
                    ],
                },
                {
                    code: "0B01",
                    options: [
                        {
                            version: "3.9.9",
                            ignores: ["binaryNumericLiterals"],
                        },
                    ],
                },
                {
                    code: "0o755",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "0O755",
                    options: [{ version: "4.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "0o755",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-octal-numeric-literals",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "0O755",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-octal-numeric-literals",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["propertyShorthands", "syntax"],
            valid: [
                {
                    code: "({ a: 1 })",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "({ get: get })",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "({ get a() {} })",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "({ a })",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "({ b() {} })",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "({ get() {} })",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "({ [c]() {} })",
                    options: [
                        { version: "4.0.0", ignores: ["computedProperties"] },
                    ],
                },
                {
                    code: "({ get })",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "({ set })",
                    options: [{ version: "6.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "({ a })",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-property-shorthands",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "({ b() {} })",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-property-shorthands",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "({ [c]() {} })",
                    options: [
                        { version: "3.9.9", ignores: ["computedProperties"] },
                    ],
                    errors: [
                        {
                            messageId: "no-property-shorthands",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "({ get })",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-property-shorthands-getset",
                            data: { supported: "6.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "({ set })",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-property-shorthands-getset",
                            data: { supported: "6.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "({ get })",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-property-shorthands-getset",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "({ set })",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-property-shorthands-getset",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["regexpU", "syntax"],
            valid: [
                {
                    code: "/foo/",
                    options: [{ version: "5.9.9" }],
                },
                {
                    code: "/foo/gmi",
                    options: [{ version: "5.9.9" }],
                },
                {
                    code: "/foo/y",
                    options: [{ version: "5.9.9", ignores: ["regexpY"] }],
                },
                {
                    code: "/foo/u",
                    options: [{ version: "6.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "/foo/u",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-regexp-u-flag",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["regexpY", "syntax"],
            valid: [
                {
                    code: "/foo/",
                    options: [{ version: "5.9.9" }],
                },
                {
                    code: "/foo/gmi",
                    options: [{ version: "5.9.9" }],
                },
                {
                    code: "/foo/u",
                    options: [{ version: "5.9.9", ignores: ["regexpU"] }],
                },
                {
                    code: "/foo/y",
                    options: [{ version: "6.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "/foo/y",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-regexp-y-flag",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["restParameters", "syntax"],
            valid: [
                {
                    code: "var [...a] = b",
                    options: [{ version: "5.9.9", ignores: ["destructuring"] }],
                },
                {
                    code: "var {...a} = b",
                    options: [
                        {
                            version: "5.9.9",
                            ignores: ["destructuring", "restSpreadProperties"],
                        },
                    ],
                },
                {
                    code: "var a = [...b]",
                    options: [{ version: "5.9.9" }],
                },
                {
                    code: "var a = {...b}",
                    options: [
                        { version: "5.9.9", ignores: ["restSpreadProperties"] },
                    ],
                },
                {
                    code: "f(...a)",
                    options: [{ version: "5.9.9" }],
                },
                {
                    code: "function f(...a) {}",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "function f(...[a, b = 0]) {}",
                    options: [{ version: "6.0.0", ignores: ["destructuring"] }],
                },
                {
                    code: "(function(...a) {})",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "((...a) => {})",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "({ f(...a) {} })",
                    options: [{ version: "6.0.0" }],
                },
                {
                    code: "class A { f(...a) {} }",
                    options: [{ version: "6.0.0", ignores: ["classes"] }],
                },
                {
                    code: "(class { f(...a) {} })",
                    options: [{ version: "6.0.0", ignores: ["classes"] }],
                },
            ],
            invalid: [
                {
                    code: "function f(...a) {}",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-rest-parameters",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "function f(...[a, b = 0]) {}",
                    options: [{ version: "5.9.9", ignores: ["destructuring"] }],
                    errors: [
                        {
                            messageId: "no-rest-parameters",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "(function(...a) {})",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-rest-parameters",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "((...a) => {})",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-rest-parameters",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "({ f(...a) {} })",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-rest-parameters",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "class A { f(...a) {} }",
                    options: [{ version: "5.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-rest-parameters",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "(class { f(...a) {} })",
                    options: [{ version: "5.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-rest-parameters",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["spreadElements", "syntax"],
            valid: [
                {
                    code: "var [...a] = b",
                    options: [{ version: "4.9.9", ignores: ["destructuring"] }],
                },
                {
                    code: "var {...a} = b",
                    options: [
                        {
                            version: "4.9.9",
                            ignores: ["destructuring", "restSpreadProperties"],
                        },
                    ],
                },
                {
                    code: "var a = {...b}",
                    options: [
                        {
                            version: "4.9.9",
                            ignores: ["restSpreadProperties"],
                        },
                    ],
                },
                {
                    code: "function f(...a) {}",
                    options: [
                        { version: "4.9.9", ignores: ["restParameters"] },
                    ],
                },
                {
                    code: "[...a]",
                    options: [{ version: "5.0.0" }],
                },
                {
                    code: "[...a, ...b]",
                    options: [{ version: "5.0.0" }],
                },
                {
                    code: "f(...a)",
                    options: [{ version: "5.0.0" }],
                },
                {
                    code: "new F(...a)",
                    options: [{ version: "5.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "[...a]",
                    options: [{ version: "4.9.9" }],
                    errors: [
                        {
                            messageId: "no-spread-elements",
                            data: { supported: "5.0.0", version: "4.9.9" },
                        },
                    ],
                },
                {
                    code: "[...a, ...b]",
                    options: [{ version: "4.9.9" }],
                    errors: [
                        {
                            messageId: "no-spread-elements",
                            data: { supported: "5.0.0", version: "4.9.9" },
                        },
                        {
                            messageId: "no-spread-elements",
                            data: { supported: "5.0.0", version: "4.9.9" },
                        },
                    ],
                },
                {
                    code: "f(...a)",
                    options: [{ version: "4.9.9" }],
                    errors: [
                        {
                            messageId: "no-spread-elements",
                            data: { supported: "5.0.0", version: "4.9.9" },
                        },
                    ],
                },
                {
                    code: "new F(...a)",
                    options: [{ version: "4.9.9" }],
                    errors: [
                        {
                            messageId: "no-spread-elements",
                            data: { supported: "5.0.0", version: "4.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            /*eslint-disable no-template-curly-in-string */
            keywords: ["templateLiterals", "syntax"],
            valid: [
                {
                    code: "'`foo`'",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "`foo`",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "`foo${a}bar`",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "tag`foo`",
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "tag`foo${a}bar`",
                    options: [{ version: "4.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "`foo`",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-template-literals",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "`foo${a}bar`",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-template-literals",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "tag`foo`",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-template-literals",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "tag`foo${a}bar`",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-template-literals",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
            ],
            /*eslint-enable no-template-curly-in-string */
        },
        {
            keywords: ["unicodeCodePointEscapes", "syntax"],
            valid: [
                {
                    code: String.raw`var a = "\x61"`,
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: String.raw`var a = "\u0061"`,
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: String.raw`var a = "\\u{61}"`,
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: String.raw`var \u{61} = 0`,
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: String.raw`var a = "\u{61}"`,
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: String.raw`var a = '\u{61}'`,
                    options: [{ version: "4.0.0" }],
                },
                {
                    code: "var a = `\\u{61}`",
                    options: [{ version: "4.0.0" }],
                },
            ],
            invalid: [
                {
                    code: String.raw`var \u{61} = 0`,
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-unicode-codepoint-escapes",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: String.raw`var a = "\u{61}"`,
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-unicode-codepoint-escapes",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: String.raw`var a = "\\\u{61}"`,
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-unicode-codepoint-escapes",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: String.raw`var a = '\u{61}'`,
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-unicode-codepoint-escapes",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
                {
                    code: "var a = `\\u{61}`",
                    options: [
                        { version: "3.9.9", ignores: ["templateLiterals"] },
                    ],
                    errors: [
                        {
                            messageId: "no-unicode-codepoint-escapes",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Array.from", "Array.*", "runtime"],
            valid: [
                {
                    code: "Array.foo(a)",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "(function(Array) { Array.from(a) }(b))",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "Array.from(a)",
                    options: [{ version: "4.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "Array.from(a)",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-array-from",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Array.of", "Array.*", "runtime"],
            valid: [
                {
                    code: "Array.foo(a)",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "(function(Array) { Array.of(a) }(b))",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "Array.of(a)",
                    options: [{ version: "4.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "Array.of(a)",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-array-of",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Map", "runtime"],
            valid: [
                {
                    code: "map",
                    options: [{ version: "0.11.9" }],
                },
                {
                    code: "(function(Map) { Map }(b))",
                    options: [{ version: "0.11.9" }],
                },
                {
                    code: "Map",
                    options: [{ version: "0.12.0" }],
                },
            ],
            invalid: [
                {
                    code: "Map",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-map",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
                {
                    code: "(function() { Map })()",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-map",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.acosh", "Math.*", "runtime"],
            valid: [
                {
                    code: "Math.foo(a)",
                    options: [{ version: "0.11.9" }],
                },
                {
                    code: "(function(Math) { Math.acosh(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                {
                    code: "Math.acosh(a)",
                    options: [{ version: "0.12.0" }],
                },
            ],
            invalid: [
                {
                    code: "Math.acosh(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-acosh",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.asinh", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.asinh(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.asinh(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.asinh(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-asinh",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.atanh", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.atanh(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.atanh(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.atanh(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-atanh",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.cbrt", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.cbrt(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.cbrt(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.cbrt(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-cbrt",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.clz32", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.clz32(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.clz32(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.clz32(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-clz32",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.cosh", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.cosh(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.cosh(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.cosh(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-cosh",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.expm1", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.expm1(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.expm1(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.expm1(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-expm1",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.fround", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.fround(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.fround(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.fround(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-fround",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.hypot", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.hypot(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.hypot(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.hypot(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-hypot",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.imul", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.imul(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.imul(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.imul(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-imul",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.log10", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.log10(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.log10(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.log10(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-log10",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.log1p", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.log1p(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.log1p(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.log1p(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-log1p",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.log2", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.log2(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.log2(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.log2(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-log2",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.sign", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.sign(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.sign(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.sign(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-sign",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.sinh", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.sinh(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.sinh(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.sinh(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-sinh",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.tanh", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.tanh(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.tanh(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.tanh(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-tanh",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Math.trunc", "Math.*", "runtime"],
            valid: [
                { code: "Math.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Math) { Math.trunc(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Math.trunc(a)", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Math.trunc(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-math-trunc",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Number.isFinite", "Number.*", "runtime"],
            valid: [
                { code: "Number.foo(a)", options: [{ version: "0.9.9" }] },
                {
                    code: "(function(Number) { Number.isFinite(a) }(b))",
                    options: [{ version: "0.9.9" }],
                },
                {
                    code: "Number.isFinite(a)",
                    options: [{ version: "0.10.0" }],
                },
            ],
            invalid: [
                {
                    code: "Number.isFinite(a)",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-number-isfinite",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Number.isInteger", "Number.*", "runtime"],
            valid: [
                { code: "Number.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Number) { Number.isInteger(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                {
                    code: "Number.isInteger(a)",
                    options: [{ version: "0.12.0" }],
                },
            ],
            invalid: [
                {
                    code: "Number.isInteger(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-number-isinteger",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Number.isNaN", "Number.*", "runtime"],
            valid: [
                { code: "Number.foo(a)", options: [{ version: "0.9.9" }] },
                {
                    code: "(function(Number) { Number.isNaN(a) }(b))",
                    options: [{ version: "0.9.9" }],
                },
                { code: "Number.isNaN(a)", options: [{ version: "0.10.0" }] },
            ],
            invalid: [
                {
                    code: "Number.isNaN(a)",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-number-isnan",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Number.isSafeInteger", "Number.*", "runtime"],
            valid: [
                { code: "Number.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Number) { Number.isSafeInteger(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                {
                    code: "Number.isSafeInteger(a)",
                    options: [{ version: "0.12.0" }],
                },
            ],
            invalid: [
                {
                    code: "Number.isSafeInteger(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-number-issafeinteger",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Number.parseFloat", "Number.*", "runtime"],
            valid: [
                { code: "Number.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Number) { Number.parseFloat(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                {
                    code: "Number.parseFloat(a)",
                    options: [{ version: "0.12.0" }],
                },
            ],
            invalid: [
                {
                    code: "Number.parseFloat(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-number-parsefloat",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Number.parseInt", "Number.*", "runtime"],
            valid: [
                { code: "Number.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Number) { Number.parseInt(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                {
                    code: "Number.parseInt(a)",
                    options: [{ version: "0.12.0" }],
                },
            ],
            invalid: [
                {
                    code: "Number.parseInt(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-number-parseint",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Object.assign", "Object.*", "runtime"],
            valid: [
                { code: "Object.foo(a)", options: [{ version: "3.9.9" }] },
                {
                    code: "(function(Object) { Object.assign(a) }(b))",
                    options: [{ version: "3.9.9" }],
                },
                { code: "Object.assign(a)", options: [{ version: "4.0.0" }] },
            ],
            invalid: [
                {
                    code: "Object.assign(a)",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-object-assign",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Object.getOwnPropertySymbols", "Object.*", "runtime"],
            valid: [
                { code: "Object.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code:
                        "(function(Object) { Object.getOwnPropertySymbols(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                {
                    code: "Object.getOwnPropertySymbols(a)",
                    options: [{ version: "0.12.0" }],
                },
            ],
            invalid: [
                {
                    code: "Object.getOwnPropertySymbols(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-object-getownpropertysymbols",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Object.is", "Object.*", "runtime"],
            valid: [
                { code: "Object.foo(a)", options: [{ version: "0.9.9" }] },
                {
                    code: "(function(Object) { Object.is(a) }(b))",
                    options: [{ version: "0.9.9" }],
                },
                { code: "Object.is(a)", options: [{ version: "0.10.0" }] },
            ],
            invalid: [
                {
                    code: "Object.is(a)",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-object-is",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Object.setPrototypeOf", "Object.*", "runtime"],
            valid: [
                { code: "Object.foo(a)", options: [{ version: "0.11.9" }] },
                {
                    code: "(function(Object) { Object.setPrototypeOf(a) }(b))",
                    options: [{ version: "0.11.9" }],
                },
                {
                    code: "Object.setPrototypeOf(a)",
                    options: [{ version: "0.12.0" }],
                },
            ],
            invalid: [
                {
                    code: "Object.setPrototypeOf(a)",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-object-setprototypeof",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Promise", "runtime"],
            valid: [
                {
                    code: "(function(Promise) { Promise }(a))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Promise", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Promise",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-promise",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Promise }",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-promise",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Proxy", "runtime"],
            valid: [
                {
                    code: "(function(Proxy) { Proxy }(a))",
                    options: [{ version: "5.9.9" }],
                },
                { code: "Proxy", options: [{ version: "6.0.0" }] },
            ],
            invalid: [
                {
                    code: "Proxy",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-proxy",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Proxy }",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-proxy",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Reflect", "runtime"],
            valid: [
                {
                    code: "(function(Reflect) { Reflect }(a))",
                    options: [{ version: "5.9.9" }],
                },
                { code: "Reflect", options: [{ version: "6.0.0" }] },
            ],
            invalid: [
                {
                    code: "Reflect",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-reflect",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Reflect }",
                    options: [{ version: "5.9.9" }],
                    errors: [
                        {
                            messageId: "no-reflect",
                            data: { supported: "6.0.0", version: "5.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Set", "runtime"],
            valid: [
                {
                    code: "(function(Set) { Set }(a))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Set", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Set",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-set",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Set }",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-set",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["String.fromCodePoint", "String.*", "runtime"],
            valid: [
                { code: "String.foo(a)", options: [{ version: "3.9.9" }] },
                {
                    code: "(function(String) { String.fromCodePoint(a) }(b))",
                    options: [{ version: "3.9.9" }],
                },
                {
                    code: "String.fromCodePoint(a)",
                    options: [{ version: "4.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "String.fromCodePoint(a)",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-string-fromcodepoint",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["String.raw", "String.*", "runtime"],
            valid: [
                { code: "String.foo(a)", options: [{ version: "3.9.9" }] },
                {
                    code: "(function(String) { String.raw(a) }(b))",
                    options: [{ version: "3.9.9" }],
                },
                { code: "String.raw(a)", options: [{ version: "4.0.0" }] },
            ],
            invalid: [
                {
                    code: "String.raw(a)",
                    options: [{ version: "3.9.9" }],
                    errors: [
                        {
                            messageId: "no-string-raw",
                            data: { supported: "4.0.0", version: "3.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["subclassingBuiltins", "runtime"],
            valid: [
                {
                    code: "class A extends Array {}",
                    options: [{ version: "6.5.0" }],
                },
                {
                    code: "(class extends Array {})",
                    options: [{ version: "6.5.0" }],
                },
                {
                    code: "class A extends Function {}",
                    options: [{ version: "6.0.0", ignores: ["classes"] }],
                },
                {
                    code: "(class extends Function {})",
                    options: [{ version: "6.0.0", ignores: ["classes"] }],
                },
                {
                    code: "class A extends String {}",
                    options: [{ version: "6.0.0", ignores: ["classes"] }],
                },
                {
                    code: "(class extends String {})",
                    options: [{ version: "6.0.0", ignores: ["classes"] }],
                },
                {
                    code: "class A extends RegExp {}",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "(class extends RegExp {})",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "class A extends Promise {}",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "(class extends Promise {})",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "class A extends Boolean {}",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "(class extends Boolean {})",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "class A extends Number {}",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "(class extends Number {})",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "class A extends Error {}",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "(class extends Error {})",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "class A extends Map {}",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "(class extends Map {})",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "class A extends Set {}",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "(class extends Set {})",
                    options: [{ version: "4.0.0", ignores: ["classes"] }],
                },
                {
                    code: "class A extends B {}",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                },
            ],
            invalid: [
                {
                    code: "class A extends Array {}",
                    options: [{ version: "6.4.9" }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins-array",
                            data: {
                                name: "Array",
                                supported: "6.5.0",
                                version: "6.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "(class extends Array {})",
                    options: [{ version: "6.4.9" }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins-array",
                            data: {
                                name: "Array",
                                supported: "6.5.0",
                                version: "6.4.9",
                            },
                        },
                    ],
                },
                {
                    code: "class A extends Function {}",
                    options: [{ version: "5.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId:
                                "no-subclassing-builtins-function-string",
                            data: {
                                name: "Function",
                                supported: "6.0.0",
                                version: "5.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "(class extends Function {})",
                    options: [{ version: "5.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId:
                                "no-subclassing-builtins-function-string",
                            data: {
                                name: "Function",
                                supported: "6.0.0",
                                version: "5.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "class A extends String {}",
                    options: [{ version: "5.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId:
                                "no-subclassing-builtins-function-string",
                            data: {
                                name: "String",
                                supported: "6.0.0",
                                version: "5.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "(class extends String {})",
                    options: [{ version: "5.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId:
                                "no-subclassing-builtins-function-string",
                            data: {
                                name: "String",
                                supported: "6.0.0",
                                version: "5.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "class A extends RegExp {}",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "RegExp",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "(class extends RegExp {})",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "RegExp",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "class A extends Promise {}",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "Promise",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "(class extends Promise {})",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "Promise",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "class A extends Boolean {}",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "Boolean",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "(class extends Boolean {})",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "Boolean",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "class A extends Number {}",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "Number",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "(class extends Number {})",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "Number",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "class A extends Error {}",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "Error",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "(class extends Error {})",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "Error",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "class A extends Map {}",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "Map",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "(class extends Map {})",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "Map",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "class A extends Set {}",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "Set",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
                {
                    code: "(class extends Set {})",
                    options: [{ version: "3.9.9", ignores: ["classes"] }],
                    errors: [
                        {
                            messageId: "no-subclassing-builtins",
                            data: {
                                name: "Set",
                                supported: "4.0.0",
                                version: "3.9.9",
                            },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Symbol", "runtime"],
            valid: [
                {
                    code: "(function(Symbol) { Symbol }(a))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "Symbol", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "Symbol",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-symbol",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Symbol }",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-symbol",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["TypedArrays", "runtime"],
            valid: [
                {
                    code: "(function(Int8Array) { Int8Array }(a))",
                    options: [{ version: "0.9.9" }],
                },
                { code: "Int8Array", options: [{ version: "0.10.0" }] },
                {
                    code: "(function(Uint8Array) { Uint8Array }(a))",
                    options: [{ version: "0.9.9" }],
                },
                { code: "Uint8Array", options: [{ version: "0.10.0" }] },
                {
                    code:
                        "(function(Uint8ClampedArray) { Uint8ClampedArray }(a))",
                    options: [{ version: "0.9.9" }],
                },
                { code: "Uint8ClampedArray", options: [{ version: "0.10.0" }] },
                {
                    code: "(function(Int16Array) { Int16Array }(a))",
                    options: [{ version: "0.9.9" }],
                },
                { code: "Int16Array", options: [{ version: "0.10.0" }] },
                {
                    code: "(function(Uint16Array) { Uint16Array }(a))",
                    options: [{ version: "0.9.9" }],
                },
                { code: "Uint16Array", options: [{ version: "0.10.0" }] },
                {
                    code: "(function(Int32Array) { Int32Array }(a))",
                    options: [{ version: "0.9.9" }],
                },
                { code: "Int32Array", options: [{ version: "0.10.0" }] },
                {
                    code: "(function(Uint32Array) { Uint32Array }(a))",
                    options: [{ version: "0.9.9" }],
                },
                { code: "Uint32Array", options: [{ version: "0.10.0" }] },
                {
                    code: "(function(Float32Array) { Float32Array }(a))",
                    options: [{ version: "0.9.9" }],
                },
                { code: "Float32Array", options: [{ version: "0.10.0" }] },
                {
                    code: "(function(Float64Array) { Float64Array }(a))",
                    options: [{ version: "0.9.9" }],
                },
                { code: "Float64Array", options: [{ version: "0.10.0" }] },
                {
                    code: "(function(DataView) { DataView }(a))",
                    options: [{ version: "0.9.9" }],
                },
                { code: "DataView", options: [{ version: "0.10.0" }] },
            ],
            invalid: [
                {
                    code: "Int8Array",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Int8Array }",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "Uint8Array",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Uint8Array }",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "Uint8ClampedArray",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Uint8ClampedArray }",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "Int16Array",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Int16Array }",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "Uint16Array",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Uint16Array }",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "Int32Array",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Int32Array }",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "Uint32Array",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Uint32Array }",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "Float32Array",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Float32Array }",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "Float64Array",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Float64Array }",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "DataView",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { DataView }",
                    options: [{ version: "0.9.9" }],
                    errors: [
                        {
                            messageId: "no-typed-arrays",
                            data: { supported: "0.10.0", version: "0.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["WeakMap", "runtime"],
            valid: [
                {
                    code: "(function(WeakMap) { WeakMap }(a))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "WeakMap", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "WeakMap",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-weak-map",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { WeakMap }",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-weak-map",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["WeakSet", "runtime"],
            valid: [
                {
                    code: "(function(WeakSet) { WeakSet }(a))",
                    options: [{ version: "0.11.9" }],
                },
                { code: "WeakSet", options: [{ version: "0.12.0" }] },
            ],
            invalid: [
                {
                    code: "WeakSet",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-weak-set",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { WeakSet }",
                    options: [{ version: "0.11.9" }],
                    errors: [
                        {
                            messageId: "no-weak-set",
                            data: { supported: "0.12.0", version: "0.11.9" },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // ES2016
        //----------------------------------------------------------------------
        {
            keywords: ["exponentialOperators", "syntax"],
            valid: [
                {
                    code: "a ** b",
                    options: [{ version: "7.0.0" }],
                },
                {
                    code: "a **= b",
                    options: [{ version: "7.0.0" }],
                },
                {
                    code: "a * b",
                    options: [{ version: "6.9.9" }],
                },
                {
                    code: "a *= b",
                    options: [{ version: "6.9.9" }],
                },
            ],
            invalid: [
                {
                    code: "a ** b",
                    options: [{ version: "6.9.9" }],
                    errors: [
                        {
                            messageId: "no-exponential-operators",
                            data: { supported: "7.0.0", version: "6.9.9" },
                        },
                    ],
                },
                {
                    code: "a **= b",
                    options: [{ version: "6.9.9" }],
                    errors: [
                        {
                            messageId: "no-exponential-operators",
                            data: { supported: "7.0.0", version: "6.9.9" },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // ES2017
        //----------------------------------------------------------------------
        {
            keywords: ["asyncFunctions", "syntax"],
            valid: [
                {
                    code: "async function f() {}",
                    options: [{ version: "7.6.0" }],
                },
                {
                    code: "async function f() { await 1 }",
                    options: [{ version: "7.6.0" }],
                },
                {
                    code: "(async function() { await 1 })",
                    options: [{ version: "7.6.0" }],
                },
                {
                    code: "(async() => { await 1 })",
                    options: [{ version: "7.6.0" }],
                },
                {
                    code: "({ async method() { await 1 } })",
                    options: [{ version: "7.6.0" }],
                },
                {
                    code: "class A { async method() { await 1 } }",
                    options: [{ version: "7.6.0" }],
                },
                {
                    code: "(class { async method() { await 1 } })",
                    options: [{ version: "7.6.0" }],
                },
            ],
            invalid: [
                {
                    code: "async function f() {}",
                    options: [{ version: "7.5.9" }],
                    errors: [
                        {
                            messageId: "no-async-functions",
                            data: { supported: "7.6.0", version: "7.5.9" },
                        },
                    ],
                },
                {
                    code: "async function f() { await 1 }",
                    options: [{ version: "7.5.9" }],
                    errors: [
                        {
                            messageId: "no-async-functions",
                            data: { supported: "7.6.0", version: "7.5.9" },
                        },
                    ],
                },
                {
                    code: "(async function() { await 1 })",
                    options: [{ version: "7.5.9" }],
                    errors: [
                        {
                            messageId: "no-async-functions",
                            data: { supported: "7.6.0", version: "7.5.9" },
                        },
                    ],
                },
                {
                    code: "(async() => { await 1 })",
                    options: [{ version: "7.5.9" }],
                    errors: [
                        {
                            messageId: "no-async-functions",
                            data: { supported: "7.6.0", version: "7.5.9" },
                        },
                    ],
                },
                {
                    code: "({ async method() { await 1 } })",
                    options: [{ version: "7.5.9" }],
                    errors: [
                        {
                            messageId: "no-async-functions",
                            data: { supported: "7.6.0", version: "7.5.9" },
                        },
                    ],
                },
                {
                    code: "class A { async method() { await 1 } }",
                    options: [{ version: "7.5.9" }],
                    errors: [
                        {
                            messageId: "no-async-functions",
                            data: { supported: "7.6.0", version: "7.5.9" },
                        },
                    ],
                },
                {
                    code: "(class { async method() { await 1 } })",
                    options: [{ version: "7.5.9" }],
                    errors: [
                        {
                            messageId: "no-async-functions",
                            data: { supported: "7.6.0", version: "7.5.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["trailingCommasInFunctions", "syntax"],
            valid: [
                {
                    code: "function f(a,) {}",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "(function(a,) {})",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "((a,) => {})",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "({ method(a,) {} })",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "class A { method(a,) {} }",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "(class { method(a,) {} })",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "f(1,)",
                    options: [{ version: "8.0.0" }],
                },
                {
                    code: "new A(1,)",
                    options: [{ version: "8.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "function f(a,) {}",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "no-trailing-function-commas",
                            data: { supported: "8.0.0", version: "7.9.9" },
                        },
                    ],
                },
                {
                    code: "(function(a,) {})",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "no-trailing-function-commas",
                            data: { supported: "8.0.0", version: "7.9.9" },
                        },
                    ],
                },
                {
                    code: "((a,) => {})",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "no-trailing-function-commas",
                            data: { supported: "8.0.0", version: "7.9.9" },
                        },
                    ],
                },
                {
                    code: "({ method(a,) {} })",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "no-trailing-function-commas",
                            data: { supported: "8.0.0", version: "7.9.9" },
                        },
                    ],
                },
                {
                    code: "class A { method(a,) {} }",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "no-trailing-function-commas",
                            data: { supported: "8.0.0", version: "7.9.9" },
                        },
                    ],
                },
                {
                    code: "(class { method(a,) {} })",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "no-trailing-function-commas",
                            data: { supported: "8.0.0", version: "7.9.9" },
                        },
                    ],
                },
                {
                    code: "f(1,)",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "no-trailing-function-commas",
                            data: { supported: "8.0.0", version: "7.9.9" },
                        },
                    ],
                },
                {
                    code: "new A(1,)",
                    options: [{ version: "7.9.9" }],
                    errors: [
                        {
                            messageId: "no-trailing-function-commas",
                            data: { supported: "8.0.0", version: "7.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Atomics", "runtime"],
            valid: [
                {
                    code: "(function(Atomics) { Atomics }(a))",
                    options: [{ version: "8.9.9" }],
                },
                { code: "Atomics", options: [{ version: "8.10.0" }] },
            ],
            invalid: [
                {
                    code: "Atomics",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "no-atomics",
                            data: { supported: "8.10.0", version: "8.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { Atomics }",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "no-atomics",
                            data: { supported: "8.10.0", version: "8.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Object.values", "Object.*", "runtime"],
            valid: [
                { code: "Object.foo(a)", options: [{ version: "6.9.9" }] },
                {
                    code: "(function(Object) { Object.values(a) }(b))",
                    options: [{ version: "6.9.9" }],
                },
                { code: "Object.values(a)", options: [{ version: "7.0.0" }] },
            ],
            invalid: [
                {
                    code: "Object.values(a)",
                    options: [{ version: "6.9.9" }],
                    errors: [
                        {
                            messageId: "no-object-values",
                            data: { supported: "7.0.0", version: "6.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["Object.entries", "Object.*", "runtime"],
            valid: [
                { code: "Object.foo(a)", options: [{ version: "6.9.9" }] },
                {
                    code: "(function(Object) { Object.entries(a) }(b))",
                    options: [{ version: "6.9.9" }],
                },
                { code: "Object.entries(a)", options: [{ version: "7.0.0" }] },
            ],
            invalid: [
                {
                    code: "Object.entries(a)",
                    options: [{ version: "6.9.9" }],
                    errors: [
                        {
                            messageId: "no-object-entries",
                            data: { supported: "7.0.0", version: "6.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: [
                "Object.getOwnPropertyDescriptors",
                "Object.*",
                "runtime",
            ],
            valid: [
                { code: "Object.foo(a)", options: [{ version: "6.9.9" }] },
                {
                    code:
                        "(function(Object) { Object.getOwnPropertyDescriptors(a) }(b))",
                    options: [{ version: "6.9.9" }],
                },
                {
                    code: "Object.getOwnPropertyDescriptors(a)",
                    options: [{ version: "7.0.0" }],
                },
            ],
            invalid: [
                {
                    code: "Object.getOwnPropertyDescriptors(a)",
                    options: [{ version: "6.9.9" }],
                    errors: [
                        {
                            messageId: "no-object-getownpropertydescriptors",
                            data: { supported: "7.0.0", version: "6.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["SharedArrayBuffer", "runtime"],
            valid: [
                {
                    code:
                        "(function(SharedArrayBuffer) { SharedArrayBuffer }(a))",
                    options: [{ version: "8.9.9" }],
                },
                { code: "SharedArrayBuffer", options: [{ version: "8.10.0" }] },
            ],
            invalid: [
                {
                    code: "SharedArrayBuffer",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "no-shared-array-buffer",
                            data: { supported: "8.10.0", version: "8.9.9" },
                        },
                    ],
                },
                {
                    code: "function wrap() { SharedArrayBuffer }",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "no-shared-array-buffer",
                            data: { supported: "8.10.0", version: "8.9.9" },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // ES2018
        //----------------------------------------------------------------------
        {
            keywords: ["asyncIteration", "syntax"],
            valid: [
                {
                    code: "async function f() { for await (const x of xs) {} }",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "async function* f() { }",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "(async function* () { })",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "({ async* method() { } })",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "class A { async* method() { } }",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "(class { async* method() { } })",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "function f() { for (const x of xs) {} }",
                    options: [{ version: "9.9.9" }],
                },
                {
                    code: "async function f() { }",
                    options: [{ version: "9.9.9" }],
                },
                {
                    code: "function* f() { }",
                    options: [{ version: "9.9.9" }],
                },
            ],
            invalid: [
                {
                    code: "async function f() { for await (const x of xs) {} }",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "no-async-iteration",
                            data: { supported: "10.0.0", version: "9.9.9" },
                        },
                    ],
                },
                {
                    code: "async function* f() { }",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "no-async-iteration",
                            data: { supported: "10.0.0", version: "9.9.9" },
                        },
                    ],
                },
                {
                    code: "(async function* () { })",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "no-async-iteration",
                            data: { supported: "10.0.0", version: "9.9.9" },
                        },
                    ],
                },
                {
                    code: "({ async* method() { } })",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "no-async-iteration",
                            data: { supported: "10.0.0", version: "9.9.9" },
                        },
                    ],
                },
                {
                    code: "class A { async* method() { } }",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "no-async-iteration",
                            data: { supported: "10.0.0", version: "9.9.9" },
                        },
                    ],
                },
                {
                    code: "(class { async* method() { } })",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "no-async-iteration",
                            data: { supported: "10.0.0", version: "9.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["malformedTemplateLiterals", "syntax"],
            valid: [
                {
                    code: "tag`\\unicode`",
                    options: [{ version: "8.10.0" }],
                },
            ],
            invalid: [
                {
                    code: "tag`\\unicode`",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "no-malformed-template-literals",
                            data: { supported: "8.10.0", version: "8.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["regexpLookbehind", "syntax"],
            valid: [
                {
                    code: "var a = /(?<=a)foo/",
                    options: [{ version: "8.10.0" }],
                },
                {
                    code: "var a = /(?<!a)foo/",
                    options: [{ version: "8.10.0" }],
                },
                {
                    code: 'var a = new RegExp("/(?<=a)foo/")',
                    options: [{ version: "8.10.0" }],
                },
                {
                    code: "var a = new RegExp(pattern)",
                    options: [{ version: "8.9.9" }],
                },
                {
                    code: 'var a = new RegExp("(?<=")',
                    options: [{ version: "8.9.9" }],
                },
                {
                    code: "var a = /\\(?<=a\\)foo/",
                    options: [{ version: "8.9.9" }],
                },
            ],
            invalid: [
                {
                    code: "var a = /(?<=a)foo/",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "no-regexp-lookbehind-assertions",
                            data: { supported: "8.10.0", version: "8.9.9" },
                        },
                    ],
                },
                {
                    code: "var a = /(?<!a)foo/",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "no-regexp-lookbehind-assertions",
                            data: { supported: "8.10.0", version: "8.9.9" },
                        },
                    ],
                },
                {
                    code: 'var a = new RegExp("/(?<=a)foo/")',
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "no-regexp-lookbehind-assertions",
                            data: { supported: "8.10.0", version: "8.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["regexpNamedCaptureGroups", "syntax"],
            valid: [
                {
                    code: "var a = /(?<key>a)foo/",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "var a = /(?<key>a)\\k<key>/",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: 'var a = new RegExp("(?<key>a)foo")',
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "var a = new RegExp(pattern)",
                    options: [{ version: "8.9.9" }],
                },
                {
                    code: 'var a = new RegExp("(?<key")',
                    options: [{ version: "8.9.9" }],
                },
                {
                    code: "var a = /\\(?<key>a\\)foo/",
                    options: [{ version: "8.9.9" }],
                },
            ],
            invalid: [
                {
                    code: "var a = /(?<key>a)foo/",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "no-regexp-named-capture-groups",
                            data: { supported: "10.0.0", version: "9.9.9" },
                        },
                    ],
                },
                {
                    code: "var a = /(?<key>a)\\k<key>/",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "no-regexp-named-capture-groups",
                            data: { supported: "10.0.0", version: "9.9.9" },
                        },
                    ],
                },
                {
                    code: 'var a = new RegExp("(?<key>a)foo")',
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "no-regexp-named-capture-groups",
                            data: { supported: "10.0.0", version: "9.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["regexpS", "syntax"],
            valid: [
                {
                    code: "var a = /foo/s",
                    options: [{ version: "8.10.0" }],
                },
                {
                    code: 'var a = new RegExp("foo", "s")',
                    options: [{ version: "8.10.0" }],
                },
                {
                    code: "var a = new RegExp(a, b)",
                    options: [{ version: "8.9.9" }],
                },
                {
                    code: 'var a = new RegExp("(aaaaa", b)',
                    options: [{ version: "8.9.9" }],
                },
            ],
            invalid: [
                {
                    code: "var a = /foo/s",
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "no-regexp-s-flag",
                            data: { supported: "8.10.0", version: "8.9.9" },
                        },
                    ],
                },
                {
                    code: 'var a = new RegExp("foo", "s")',
                    options: [{ version: "8.9.9" }],
                    errors: [
                        {
                            messageId: "no-regexp-s-flag",
                            data: { supported: "8.10.0", version: "8.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["regexpUnicodeProperties", "syntax"],
            valid: [
                {
                    code: "var a = /\\p{Letter}/u",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: "var a = /\\P{Letter}/u",
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: 'var a = new RegExp("\\\\p{Letter}", "u")',
                    options: [{ version: "10.0.0" }],
                },
                {
                    code: 'var a = new RegExp("\\\\p{Letter}")',
                    options: [{ version: "9.9.9" }],
                },
                {
                    code: 'var a = new RegExp(pattern, "u")',
                    options: [{ version: "9.9.9" }],
                },
                {
                    code: 'var a = new RegExp("\\\\p{Letter")',
                    options: [{ version: "9.9.9" }],
                },
            ],
            invalid: [
                {
                    code: "var a = /\\p{Letter}/u",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "no-regexp-unicode-property-escapes",
                            data: { supported: "10.0.0", version: "9.9.9" },
                        },
                    ],
                },
                {
                    code: "var a = /\\P{Letter}/u",
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "no-regexp-unicode-property-escapes",
                            data: { supported: "10.0.0", version: "9.9.9" },
                        },
                    ],
                },
                {
                    code: 'var a = new RegExp("\\\\p{Letter}", "u")',
                    options: [{ version: "9.9.9" }],
                    errors: [
                        {
                            messageId: "no-regexp-unicode-property-escapes",
                            data: { supported: "10.0.0", version: "9.9.9" },
                        },
                    ],
                },
            ],
        },
        {
            keywords: ["restSpreadProperties", "syntax"],
            valid: [
                {
                    code: "({ ...obj })",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "({ ...rest } = obj)",
                    options: [{ version: "8.3.0" }],
                },
                {
                    code: "({ obj })",
                    options: [{ version: "8.2.9" }],
                },
                {
                    code: "({ obj: 1 })",
                    options: [{ version: "8.2.9" }],
                },
                {
                    code: "({ obj } = a)",
                    options: [{ version: "8.2.9" }],
                },
                {
                    code: "({ obj: a } = b)",
                    options: [{ version: "8.2.9" }],
                },
                {
                    code: "([...xs])",
                    options: [{ version: "8.2.9" }],
                },
                {
                    code: "([a, ...xs] = ys)",
                    options: [{ version: "8.2.9" }],
                },
            ],
            invalid: [
                {
                    code: "({ ...obj })",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "no-rest-spread-properties",
                            data: { supported: "8.3.0", version: "8.2.9" },
                        },
                    ],
                },
                {
                    code: "({ ...rest } = obj)",
                    options: [{ version: "8.2.9" }],
                    errors: [
                        {
                            messageId: "no-rest-spread-properties",
                            data: { supported: "8.3.0", version: "8.2.9" },
                        },
                    ],
                },
            ],
        },

        //----------------------------------------------------------------------
        // MISC
        //----------------------------------------------------------------------
        {
            keywords: [],
            valid: [
                {
                    filename: fixture("gte-4.0.0/a.js"),
                    code: "var a = () => 1",
                },
                {
                    filename: fixture("gte-4.4.0-lt-5.0.0/a.js"),
                    code: "var a = () => 1",
                },
                {
                    filename: fixture("hat-4.1.2/a.js"),
                    code: "var a = () => 1",
                },
                {
                    code: "'\\\\u{0123}'",
                },
                {
                    filename: fixture("gte-4.0.0/a.js"),
                    code: "var a = async () => 1",
                    options: [{ ignores: ["asyncFunctions"] }],
                },
                {
                    filename: fixture("gte-7.6.0/a.js"),
                    code: "var a = async () => 1",
                },
                {
                    filename: fixture("gte-7.10.0/a.js"),
                    code: "var a = async () => 1",
                },
                {
                    filename: fixture("invalid/a.js"),
                    code: "var a = () => 1",
                },
                {
                    filename: fixture("nothing/a.js"),
                    code: "var a = () => 1",
                },
                {
                    code: "var a = async () => 1",
                    options: [{ version: "7.10.0" }],
                },
                {
                    filename: fixture("without-node/a.js"),
                    code: "var a = () => 1",
                },
            ],
            invalid: [
                {
                    filename: fixture("gte-0.12.8/a.js"),
                    code: "var a = () => 1",
                    errors: [
                        {
                            messageId: "no-arrow-functions",
                            data: { supported: "4.0.0", version: ">=0.12.8" },
                        },
                    ],
                },
                {
                    filename: fixture("invalid/a.js"),
                    code: "var a = (b,) => 1",
                    errors: [
                        {
                            messageId: "no-trailing-function-commas",
                            data: { supported: "8.0.0", version: ">=6.0.0" },
                        },
                    ],
                },
                {
                    filename: fixture("lt-6.0.0/a.js"),
                    code: "var a = () => 1",
                    errors: [
                        {
                            messageId: "no-arrow-functions",
                            data: { supported: "4.0.0", version: "<6.0.0" },
                        },
                    ],
                },
                {
                    filename: fixture("nothing/a.js"),
                    code: "var a = (b,) => 1",
                    errors: [
                        {
                            messageId: "no-trailing-function-commas",
                            data: { supported: "8.0.0", version: ">=6.0.0" },
                        },
                    ],
                },
                {
                    filename: fixture("gte-7.5.0/a.js"),
                    code: "var a = async () => 1",
                    errors: [
                        {
                            messageId: "no-async-functions",
                            data: { supported: "7.6.0", version: ">=7.5.0" },
                        },
                    ],
                },
                {
                    code: "var a = async () => 1",
                    options: [{ version: "7.1.0" }],
                    errors: [
                        {
                            messageId: "no-async-functions",
                            data: { supported: "7.6.0", version: "7.1.0" },
                        },
                    ],
                },
            ],
        },
    ])
)
