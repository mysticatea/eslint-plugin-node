/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/vm")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/vm", rule, {
    valid: [
        {
            code: "require('vm').Module",
            options: [{ version: "9.6.0" }],
        },
        {
            code: "var vm = require('vm'); vm.Module",
            options: [{ version: "9.6.0" }],
        },
        {
            code: "var { Module } = require('vm'); Module",
            options: [{ version: "9.6.0" }],
        },
        {
            code: "import vm from 'vm'; vm.Module",
            options: [{ version: "9.6.0" }],
        },
        {
            code: "import { Module } from 'vm'; Module",
            options: [{ version: "9.6.0" }],
        },

        // Ignores
        {
            code: "require('vm').Module",
            options: [{ version: "9.5.9", ignores: ["vm.Module"] }],
        },
        {
            code: "var vm = require('vm'); vm.Module",
            options: [{ version: "9.5.9", ignores: ["vm.Module"] }],
        },
        {
            code: "var { Module } = require('vm'); Module",
            options: [{ version: "9.5.9", ignores: ["vm.Module"] }],
        },
        {
            code: "import vm from 'vm'; vm.Module",
            options: [{ version: "9.5.9", ignores: ["vm.Module"] }],
        },
        {
            code: "import { Module } from 'vm'; Module",
            options: [{ version: "9.5.9", ignores: ["vm.Module"] }],
        },
    ],
    invalid: [
        {
            code: "require('vm').Module",
            options: [{ version: "9.5.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "vm.Module",
                        supported: "9.6.0",
                        version: "9.5.9",
                    },
                },
            ],
        },
        {
            code: "var vm = require('vm'); vm.Module",
            options: [{ version: "9.5.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "vm.Module",
                        supported: "9.6.0",
                        version: "9.5.9",
                    },
                },
            ],
        },
        {
            code: "var { Module } = require('vm'); Module",
            options: [{ version: "9.5.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "vm.Module",
                        supported: "9.6.0",
                        version: "9.5.9",
                    },
                },
            ],
        },
        {
            code: "import vm from 'vm'; vm.Module",
            options: [{ version: "9.5.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "vm.Module",
                        supported: "9.6.0",
                        version: "9.5.9",
                    },
                },
            ],
        },
        {
            code: "import { Module } from 'vm'; Module",
            options: [{ version: "9.5.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "vm.Module",
                        supported: "9.6.0",
                        version: "9.5.9",
                    },
                },
            ],
        },
    ],
})
