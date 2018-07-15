/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/fs")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/fs", rule, {
    valid: [
        {
            code: "require('fs').promises",
            options: [{ version: "10.1.0" }],
        },
        {
            code: "var fs = require('fs'); fs.promises",
            options: [{ version: "10.1.0" }],
        },
        {
            code: "var { promises } = require('fs'); promises",
            options: [{ version: "10.1.0" }],
        },
        {
            code: "import fs from 'fs'; fs.promises",
            options: [{ version: "10.1.0" }],
        },
        {
            code: "import { promises } from 'fs'",
            options: [{ version: "10.1.0" }],
        },
        {
            code: "require('fs').copyFile",
            options: [{ version: "8.5.0" }],
        },
        {
            code: "require('fs').copyFileSync",
            options: [{ version: "8.5.0" }],
        },
        {
            code: "require('fs').mkdtemp",
            options: [{ version: "5.10.0" }],
        },
        {
            code: "require('fs').mkdtempSync",
            options: [{ version: "5.10.0" }],
        },
        {
            code: "require('fs').realpath.native",
            options: [{ version: "9.2.0" }],
        },
        {
            code: "require('fs').realpathSync.native",
            options: [{ version: "9.2.0" }],
        },

        // Ignores
        {
            code: "require('fs').promises",
            options: [{ version: "10.0.9", ignores: ["fs.promises"] }],
        },
        {
            code: "var fs = require('fs'); fs.promises",
            options: [{ version: "10.0.9", ignores: ["fs.promises"] }],
        },
        {
            code: "var { promises } = require('fs'); promises",
            options: [{ version: "10.0.9", ignores: ["fs.promises"] }],
        },
        {
            code: "import fs from 'fs'; fs.promises",
            options: [{ version: "10.0.9", ignores: ["fs.promises"] }],
        },
        {
            code: "import { promises } from 'fs'",
            options: [{ version: "10.0.9", ignores: ["fs.promises"] }],
        },
        {
            code: "require('fs').copyFile",
            options: [{ version: "8.4.9", ignores: ["fs.copyFile"] }],
        },
        {
            code: "require('fs').copyFileSync",
            options: [{ version: "8.4.9", ignores: ["fs.copyFileSync"] }],
        },
        {
            code: "require('fs').mkdtemp",
            options: [{ version: "5.9.9", ignores: ["fs.mkdtemp"] }],
        },
        {
            code: "require('fs').mkdtempSync",
            options: [{ version: "5.9.9", ignores: ["fs.mkdtempSync"] }],
        },
        {
            code: "require('fs').realpath.native",
            options: [{ version: "9.1.9", ignores: ["fs.realpath.native"] }],
        },
        {
            code: "require('fs').realpathSync.native",
            options: [
                { version: "9.1.9", ignores: ["fs.realpathSync.native"] },
            ],
        },
    ],
    invalid: [
        {
            code: "require('fs').promises",
            options: [{ version: "10.0.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "fs.promises",
                        supported: "10.1.0",
                        version: "10.0.9",
                    },
                },
            ],
        },
        {
            code: "var fs = require('fs'); fs.promises",
            options: [{ version: "10.0.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "fs.promises",
                        supported: "10.1.0",
                        version: "10.0.9",
                    },
                },
            ],
        },
        {
            code: "var { promises } = require('fs'); promises",
            options: [{ version: "10.0.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "fs.promises",
                        supported: "10.1.0",
                        version: "10.0.9",
                    },
                },
            ],
        },
        {
            code: "import fs from 'fs'; fs.promises",
            options: [{ version: "10.0.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "fs.promises",
                        supported: "10.1.0",
                        version: "10.0.9",
                    },
                },
            ],
        },
        {
            code: "import { promises } from 'fs'",
            options: [{ version: "10.0.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "fs.promises",
                        supported: "10.1.0",
                        version: "10.0.9",
                    },
                },
            ],
        },
        {
            code: "require('fs').copyFile",
            options: [{ version: "8.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "fs.copyFile",
                        supported: "8.5.0",
                        version: "8.4.9",
                    },
                },
            ],
        },
        {
            code: "require('fs').copyFileSync",
            options: [{ version: "8.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "fs.copyFileSync",
                        supported: "8.5.0",
                        version: "8.4.9",
                    },
                },
            ],
        },
        {
            code: "require('fs').mkdtemp",
            options: [{ version: "5.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "fs.mkdtemp",
                        supported: "5.10.0",
                        version: "5.9.9",
                    },
                },
            ],
        },
        {
            code: "require('fs').mkdtempSync",
            options: [{ version: "5.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "fs.mkdtempSync",
                        supported: "5.10.0",
                        version: "5.9.9",
                    },
                },
            ],
        },
        {
            code: "require('fs').realpath.native",
            options: [{ version: "9.1.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "fs.realpath.native",
                        supported: "9.2.0",
                        version: "9.1.9",
                    },
                },
            ],
        },
        {
            code: "require('fs').realpathSync.native",
            options: [{ version: "9.1.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "fs.realpathSync.native",
                        supported: "9.2.0",
                        version: "9.1.9",
                    },
                },
            ],
        },
    ],
})
