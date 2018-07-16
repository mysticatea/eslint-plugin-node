/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/path")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/path", rule, {
    valid: [
        {
            code: "require('path').toNamespacedPath()",
            options: [{ version: "9.0.0" }],
        },
        {
            code: "var path = require('path'); path.toNamespacedPath()",
            options: [{ version: "9.0.0" }],
        },
        {
            code:
                "var { toNamespacedPath } = require('path'); toNamespacedPath()",
            options: [{ version: "9.0.0" }],
        },
        {
            code: "import path from 'path'; path.toNamespacedPath()",
            options: [{ version: "9.0.0" }],
        },
        {
            code: "import { toNamespacedPath } from 'path'; toNamespacedPath()",
            options: [{ version: "9.0.0" }],
        },

        // Ignores
        {
            code: "require('path').toNamespacedPath()",
            options: [{ version: "8.9.9", ignores: ["path.toNamespacedPath"] }],
        },
        {
            code: "var path = require('path'); path.toNamespacedPath()",
            options: [{ version: "8.9.9", ignores: ["path.toNamespacedPath"] }],
        },
        {
            code:
                "var { toNamespacedPath } = require('path'); toNamespacedPath()",
            options: [{ version: "8.9.9", ignores: ["path.toNamespacedPath"] }],
        },
        {
            code: "import path from 'path'; path.toNamespacedPath()",
            options: [{ version: "8.9.9", ignores: ["path.toNamespacedPath"] }],
        },
        {
            code: "import { toNamespacedPath } from 'path'; toNamespacedPath()",
            options: [{ version: "8.9.9", ignores: ["path.toNamespacedPath"] }],
        },
    ],
    invalid: [
        {
            code: "require('path').toNamespacedPath()",
            options: [{ version: "8.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "path.toNamespacedPath",
                        supported: "9.0.0",
                        version: "8.9.9",
                    },
                },
            ],
        },
        {
            code: "var path = require('path'); path.toNamespacedPath()",
            options: [{ version: "8.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "path.toNamespacedPath",
                        supported: "9.0.0",
                        version: "8.9.9",
                    },
                },
            ],
        },
        {
            code:
                "var { toNamespacedPath } = require('path'); toNamespacedPath()",
            options: [{ version: "8.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "path.toNamespacedPath",
                        supported: "9.0.0",
                        version: "8.9.9",
                    },
                },
            ],
        },
        {
            code: "import path from 'path'; path.toNamespacedPath()",
            options: [{ version: "8.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "path.toNamespacedPath",
                        supported: "9.0.0",
                        version: "8.9.9",
                    },
                },
            ],
        },
        {
            code: "import { toNamespacedPath } from 'path'; toNamespacedPath()",
            options: [{ version: "8.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "path.toNamespacedPath",
                        supported: "9.0.0",
                        version: "8.9.9",
                    },
                },
            ],
        },
    ],
})
