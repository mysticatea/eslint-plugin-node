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
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },
        {
            code: "exports.foo = 1",
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },
        {
            code: "module.exports = exports = {foo: 1}",
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },
        {
            code: "exports = module.exports = {foo: 1}",
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },

        {
            code: "exports = {foo: 1}",
            options: ["module.exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },
        {
            code: "exports.foo = 1",
            options: ["module.exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },
        {
            code: "module.exports = exports = {foo: 1}",
            options: ["module.exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },
        {
            code: "exports = module.exports = {foo: 1}",
            options: ["module.exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'exports'. Use 'module.exports' instead.",
            ],
        },

        {
            code: "exports = {foo: 1}",
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected assignment to 'exports'. Don't modify 'exports' itself.",
            ],
        },
        {
            code: "module.exports = {foo: 1}",
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports.foo = 1",
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = exports = {foo: 1}",
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
                "Unexpected assignment to 'exports'. Don't modify 'exports' itself.",
            ],
        },
        {
            code: "exports = module.exports = {foo: 1}",
            options: ["exports"],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected assignment to 'exports'. Don't modify 'exports' itself.",
                "Unexpected access to 'module.exports'. Use 'exports' instead.",
            ],
        },
        {
            code: "module.exports = exports = {foo: 1}; exports = obj",
            options: ["exports", { allowBatchAssign: true }],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected assignment to 'exports'. Don't modify 'exports' itself.",
            ],
        },
        {
            code: "exports = module.exports = {foo: 1}; exports = obj",
            options: ["exports", { allowBatchAssign: true }],
            globals: { module: false, exports: true },
            errors: [
                "Unexpected assignment to 'exports'. Don't modify 'exports' itself.",
            ],
        },
    ],
})
