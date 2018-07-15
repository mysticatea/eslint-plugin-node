/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/dns")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/dns", rule, {
    valid: [
        {
            code: "require('dns').Resolver",
            options: [{ version: "8.3.0" }],
        },
        {
            code: "var hooks = require('dns'); hooks.Resolver",
            options: [{ version: "8.3.0" }],
        },
        {
            code: "var { Resolver } = require('dns'); Resolver",
            options: [{ version: "8.3.0" }],
        },
        {
            code: "import dns from 'dns'; dns.Resolver",
            options: [{ version: "8.3.0" }],
        },
        {
            code: "import { Resolver } from 'dns'; Resolver",
            options: [{ version: "8.3.0" }],
        },
        {
            code: "require('dns').resolvePtr",
            options: [{ version: "6.0.0" }],
        },
        {
            code: "require('dns').promises",
            options: [{ version: "10.6.0" }],
        },

        // Ignores
        {
            code: "require('dns').Resolver",
            options: [{ version: "8.2.9", ignores: ["dns.Resolver"] }],
        },
        {
            code: "var hooks = require('dns'); hooks.Resolver",
            options: [{ version: "8.2.9", ignores: ["dns.Resolver"] }],
        },
        {
            code: "var { Resolver } = require('dns'); Resolver",
            options: [{ version: "8.2.9", ignores: ["dns.Resolver"] }],
        },
        {
            code: "import dns from 'dns'; dns.Resolver",
            options: [{ version: "8.2.9", ignores: ["dns.Resolver"] }],
        },
        {
            code: "import { Resolver } from 'dns'; Resolver",
            options: [{ version: "8.2.9", ignores: ["dns.Resolver"] }],
        },
        {
            code: "require('dns').resolvePtr",
            options: [{ version: "5.9.9", ignores: ["dns.resolvePtr"] }],
        },
        {
            code: "require('dns').promises",
            options: [{ version: "10.5.9", ignores: ["dns.promises"] }],
        },
    ],
    invalid: [
        {
            code: "require('dns').Resolver",
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "dns.Resolver",
                        supported: "8.3.0",
                        version: "8.2.9",
                    },
                },
            ],
        },
        {
            code: "var hooks = require('dns'); hooks.Resolver",
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "dns.Resolver",
                        supported: "8.3.0",
                        version: "8.2.9",
                    },
                },
            ],
        },
        {
            code: "var { Resolver } = require('dns'); Resolver",
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "dns.Resolver",
                        supported: "8.3.0",
                        version: "8.2.9",
                    },
                },
            ],
        },
        {
            code: "import dns from 'dns'; dns.Resolver",
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "dns.Resolver",
                        supported: "8.3.0",
                        version: "8.2.9",
                    },
                },
            ],
        },
        {
            code: "import { Resolver } from 'dns'; Resolver",
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "dns.Resolver",
                        supported: "8.3.0",
                        version: "8.2.9",
                    },
                },
            ],
        },
        {
            code: "require('dns').resolvePtr",
            options: [{ version: "5.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "dns.resolvePtr",
                        supported: "6.0.0",
                        version: "5.9.9",
                    },
                },
            ],
        },
        {
            code: "require('dns').promises",
            options: [{ version: "10.5.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "dns.promises",
                        supported: "10.6.0",
                        version: "10.5.9",
                    },
                },
            ],
        },
    ],
})
