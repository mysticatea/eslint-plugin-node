/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/exports-style")

new RuleTester().run("exports-style", rule, {
    valid: [
        {
            code: "module.exports = {foo: 1}",
            globals: { module: false, exports: true },
        },
        {
            code: "module.exports = {foo: 1}",
            options: ["module.exports"],
            globals: { module: false, exports: true },
        },
        {
            code: "exports.foo = 1",
            options: ["exports"],
            globals: { module: false, exports: true },
        },
        {
            code: "exports = module.exports = {foo: 1}",
            options: ["module.exports", { allowBatchAssign: true }],
            globals: { module: false, exports: true },
        },
        {
            code: "module.exports = exports = {foo: 1}",
            options: ["module.exports", { allowBatchAssign: true }],
            globals: { module: false, exports: true },
        },
        {
            code: "exports = module.exports = {foo: 1}",
            options: ["exports", { allowBatchAssign: true }],
            globals: { module: false, exports: true },
        },
        {
            code: "module.exports = exports = {foo: 1}",
            options: ["exports", { allowBatchAssign: true }],
            globals: { module: false, exports: true },
        },
        {
            code: "exports = module.exports = {foo: 1}; exports.bar = 2",
            options: ["exports", { allowBatchAssign: true }],
            globals: { module: false, exports: true },
        },
        {
            code: "module.exports = exports = {foo: 1}; exports.bar = 2",
            options: ["exports", { allowBatchAssign: true }],
            globals: { module: false, exports: true },
        },

        // allow accesses of `modules` except `module.exports`
        {
            code: "module = {}; module.foo = 1",
            options: ["exports"],
            globals: { module: false, exports: true },
        },

        // Ignores if it's not defined.
        { code: "exports.foo = 1", options: ["module.exports"] },
        { code: "module.exports = {foo: 1}", options: ["exports"] },
    ],
    invalid: [
        {
            code: "exports = {foo: 1}",
            output: null,
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },
        {
            code: "exports.foo = 1",
            output: null,
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },
        {
            code: "module.exports = exports = {foo: 1}",
            output: null,
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },
        {
            code: "exports = module.exports = {foo: 1}",
            output: null,
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },

        {
            code: "exports = {foo: 1}",
            output: null,
            options: ["module.exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },
        {
            code: "exports.foo = 1",
            output: null,
            options: ["module.exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },
        {
            code: "module.exports = exports = {foo: 1}",
            output: null,
            options: ["module.exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },
        {
            code: "exports = module.exports = {foo: 1}",
            output: null,
            options: ["module.exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },

        {
            code: "exports = {foo: 1}",
            output: null,
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected assignment to 'exports'. Don't modify 'exports' itself.",
            ],
        },
        {
            code: "module.exports = {foo: 1}",
            output: "exports.foo = 1;",
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports.foo = 1",
            output: null,
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = { a: 1 }",
            output: "exports.a = 1;",
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = { a: 1, b: 2 }",
            output: "exports.a = 1;\n\nexports.b = 2;",
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code:
                "module.exports = { // before a\na: 1, // between a and b\nb: 2 // after b\n}",
            output:
                "// before a\nexports.a = 1;\n\n// between a and b\nexports.b = 2;\n// after b",
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "foo(module.exports = {foo: 1})",
            output: null,
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = { get a() {} }",
            output: null,
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = { a }",
            output: null,
            options: ["exports"],
            parserOptions: { ecmaVersion: 6 },
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = { ...a }",
            output: null,
            options: ["exports"],
            parserOptions: { ecmaVersion: 9 },
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = { ['a' + 'b']: 1 }",
            output: "exports['a' + 'b'] = 1;",
            options: ["exports"],
            parserOptions: { ecmaVersion: 6 },
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = { 'foo': 1 }",
            output: "exports['foo'] = 1;",
            options: ["exports"],
            parserOptions: { ecmaVersion: 6 },
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = { foo(a) {} }",
            output: "exports.foo = function (a) {};",
            options: ["exports"],
            parserOptions: { ecmaVersion: 8 },
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = { *foo(a) {} }",
            output: "exports.foo = function* (a) {};",
            options: ["exports"],
            parserOptions: { ecmaVersion: 6 },
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = { async foo(a) {} }",
            output: "exports.foo = async function (a) {};",
            options: ["exports"],
            parserOptions: { ecmaVersion: 8 },
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = exports = {foo: 1}",
            output: null,
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
                "Unexpected assignment to 'exports'. Don't modify 'exports' itself.",
            ],
        },
        {
            code: "exports = module.exports = {foo: 1}",
            output: null,
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected assignment to 'exports'. Don't modify 'exports' itself.",
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = exports = {foo: 1}; exports = obj",
            output: null,
            options: ["exports", { allowBatchAssign: true }],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected assignment to 'exports'. Don't modify 'exports' itself.",
            ],
        },
        {
            code: "exports = module.exports = {foo: 1}; exports = obj",
            output: null,
            options: ["exports", { allowBatchAssign: true }],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected assignment to 'exports'. Don't modify 'exports' itself.",
            ],
        },
    ],
})
