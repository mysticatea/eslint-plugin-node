/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/os")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/os", rule, {
    valid: [
        {
            code: "require('os').constants",
            options: [{ version: "6.3.0" }],
        },
        {
            code: "var hooks = require('os'); hooks.constants",
            options: [{ version: "6.3.0" }],
        },
        {
            code: "var { constants } = require('os'); constants",
            options: [{ version: "6.3.0" }],
        },
        {
            code: "import os from 'os'; os.constants",
            options: [{ version: "6.3.0" }],
        },
        {
            code: "import { constants } from 'os'; constants",
            options: [{ version: "6.3.0" }],
        },
        {
            code: "require('os').homedir",
            options: [{ version: "2.3.0" }],
        },
        {
            code: "require('os').userInfo",
            options: [{ version: "6.0.0" }],
        },

        // Ignores
        {
            code: "require('os').constants",
            options: [{ version: "6.2.9", ignores: ["os.constants"] }],
        },
        {
            code: "var hooks = require('os'); hooks.constants",
            options: [{ version: "6.2.9", ignores: ["os.constants"] }],
        },
        {
            code: "var { constants } = require('os'); constants",
            options: [{ version: "6.2.9", ignores: ["os.constants"] }],
        },
        {
            code: "import os from 'os'; os.constants",
            options: [{ version: "6.2.9", ignores: ["os.constants"] }],
        },
        {
            code: "import { constants } from 'os'; constants",
            options: [{ version: "6.2.9", ignores: ["os.constants"] }],
        },
        {
            code: "require('os').homedir",
            options: [{ version: "2.2.9", ignores: ["os.homedir"] }],
        },
        {
            code: "require('os').userInfo",
            options: [{ version: "5.9.9", ignores: ["os.userInfo"] }],
        },
    ],
    invalid: [
        {
            code: "require('os').constants",
            options: [{ version: "6.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "os.constants",
                        supported: "6.3.0",
                        version: "6.2.9",
                    },
                },
            ],
        },
        {
            code: "var hooks = require('os'); hooks.constants",
            options: [{ version: "6.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "os.constants",
                        supported: "6.3.0",
                        version: "6.2.9",
                    },
                },
            ],
        },
        {
            code: "var { constants } = require('os'); constants",
            options: [{ version: "6.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "os.constants",
                        supported: "6.3.0",
                        version: "6.2.9",
                    },
                },
            ],
        },
        {
            code: "import os from 'os'; os.constants",
            options: [{ version: "6.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "os.constants",
                        supported: "6.3.0",
                        version: "6.2.9",
                    },
                },
            ],
        },
        {
            code: "import { constants } from 'os'; constants",
            options: [{ version: "6.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "os.constants",
                        supported: "6.3.0",
                        version: "6.2.9",
                    },
                },
            ],
        },
        {
            code: "require('os').homedir",
            options: [{ version: "2.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "os.homedir",
                        supported: "2.3.0",
                        version: "2.2.9",
                    },
                },
            ],
        },
        {
            code: "require('os').userInfo",
            options: [{ version: "5.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "os.userInfo",
                        supported: "6.0.0",
                        version: "5.9.9",
                    },
                },
            ],
        },
    ],
})
