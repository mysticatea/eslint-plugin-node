/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/url")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        URL: false,
        URLSearchParams: false,
        require: false,
    },
}).run("no-unsupported-features/url", rule, {
    valid: [
        {
            code: "URL",
            options: [{ version: "10.0.0" }],
        },
        {
            code: "URLSearchParams",
            options: [{ version: "10.0.0" }],
        },
        {
            code: "require('url').URL",
            options: [{ version: "7.0.0" }],
        },
        {
            code: "var cp = require('url'); cp.URL",
            options: [{ version: "7.0.0" }],
        },
        {
            code: "var { URL } = require('url');",
            options: [{ version: "7.0.0" }],
        },
        {
            code: "import cp from 'url'; cp.URL",
            options: [{ version: "7.0.0" }],
        },
        {
            code: "import { URL } from 'url'",
            options: [{ version: "7.0.0" }],
        },
        {
            code: "require('url').URLSearchParams",
            options: [{ version: "7.5.0" }],
        },
        {
            code: "require('url').domainToASCII",
            options: [{ version: "7.4.0" }],
        },
        {
            code: "require('url').domainToUnicode",
            options: [{ version: "7.4.0" }],
        },

        // Ignores
        {
            code: "URL",
            options: [{ version: "9.9.9", ignores: ["URL"] }],
        },
        {
            code: "URLSearchParams",
            options: [{ version: "9.9.9", ignores: ["URLSearchParams"] }],
        },
        {
            code: "require('url').URL",
            options: [{ version: "6.9.9", ignores: ["url.URL"] }],
        },
        {
            code: "var cp = require('url'); cp.URL",
            options: [{ version: "6.9.9", ignores: ["url.URL"] }],
        },
        {
            code: "var { URL } = require('url');",
            options: [{ version: "6.9.9", ignores: ["url.URL"] }],
        },
        {
            code: "import cp from 'url'; cp.URL",
            options: [{ version: "6.9.9", ignores: ["url.URL"] }],
        },
        {
            code: "import { URL } from 'url'",
            options: [{ version: "6.9.9", ignores: ["url.URL"] }],
        },
        {
            code: "require('url').URLSearchParams",
            options: [{ version: "7.4.9", ignores: ["url.URLSearchParams"] }],
        },
        {
            code: "require('url').domainToASCII",
            options: [{ version: "7.3.9", ignores: ["url.domainToASCII"] }],
        },
        {
            code: "require('url').domainToUnicode",
            options: [{ version: "7.3.9", ignores: ["url.domainToUnicode"] }],
        },
    ],
    invalid: [
        {
            code: "URL",
            options: [{ version: "9.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "URL",
                        supported: "10.0.0",
                        version: "9.9.9",
                    },
                },
            ],
        },
        {
            code: "URLSearchParams",
            options: [{ version: "9.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "URLSearchParams",
                        supported: "10.0.0",
                        version: "9.9.9",
                    },
                },
            ],
        },
        {
            code: "require('url').URL",
            options: [{ version: "6.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "url.URL",
                        supported: "7.0.0",
                        version: "6.9.9",
                    },
                },
            ],
        },
        {
            code: "var cp = require('url'); cp.URL",
            options: [{ version: "6.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "url.URL",
                        supported: "7.0.0",
                        version: "6.9.9",
                    },
                },
            ],
        },
        {
            code: "var { URL } = require('url');",
            options: [{ version: "6.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "url.URL",
                        supported: "7.0.0",
                        version: "6.9.9",
                    },
                },
            ],
        },
        {
            code: "import cp from 'url'; cp.URL",
            options: [{ version: "6.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "url.URL",
                        supported: "7.0.0",
                        version: "6.9.9",
                    },
                },
            ],
        },
        {
            code: "import { URL } from 'url'",
            options: [{ version: "6.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "url.URL",
                        supported: "7.0.0",
                        version: "6.9.9",
                    },
                },
            ],
        },
        {
            code: "require('url').URLSearchParams",
            options: [{ version: "7.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "url.URLSearchParams",
                        supported: "7.5.0",
                        version: "7.4.9",
                    },
                },
            ],
        },
        {
            code: "require('url').domainToASCII",
            options: [{ version: "7.3.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "url.domainToASCII",
                        supported: "7.4.0",
                        version: "7.3.9",
                    },
                },
            ],
        },
        {
            code: "require('url').domainToUnicode",
            options: [{ version: "7.3.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "url.domainToUnicode",
                        supported: "7.4.0",
                        version: "7.3.9",
                    },
                },
            ],
        },
    ],
})
