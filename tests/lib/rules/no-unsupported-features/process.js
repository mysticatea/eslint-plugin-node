/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/process")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        process: false,
        require: false,
    },
}).run("no-unsupported-features/process", rule, {
    valid: [
        {
            code: "process.argv0",
            options: [{ version: "6.4.0" }],
        },
        {
            code: "require('process').argv0",
            options: [{ version: "6.4.0" }],
        },
        {
            code: "var c = require('process'); c.argv0",
            options: [{ version: "6.4.0" }],
        },
        {
            code: "var { argv0 } = require('process'); argv0",
            options: [{ version: "6.4.0" }],
        },
        {
            code: "import c from 'process'; c.argv0",
            options: [{ version: "6.4.0" }],
        },
        {
            code: "process.channel",
            options: [{ version: "7.1.0" }],
        },
        {
            code: "process.cpuUsage",
            options: [{ version: "6.1.0" }],
        },
        {
            code: "process.emitWarning",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "process.getegid",
            options: [{ version: "2.0.0" }],
        },
        {
            code: "process.geteuid",
            options: [{ version: "2.0.0" }],
        },
        {
            code: "process.hasUncaughtExceptionCaptureCallback",
            options: [{ version: "9.3.0" }],
        },
        {
            code: "process.ppid",
            options: [{ version: "9.2.0" }],
        },
        {
            code: "process.release",
            options: [{ version: "3.0.0" }],
        },
        {
            code: "process.setegid",
            options: [{ version: "2.0.0" }],
        },
        {
            code: "process.seteuid",
            options: [{ version: "2.0.0" }],
        },
        {
            code: "process.setUncaughtExceptionCaptureCallback",
            options: [{ version: "9.3.0" }],
        },

        // Ignores
        {
            code: "process.argv0",
            options: [{ version: "6.3.9", ignores: ["process.argv0"] }],
        },
        {
            code: "require('process').argv0",
            options: [{ version: "6.3.9", ignores: ["process.argv0"] }],
        },
        {
            code: "var c = require('process'); c.argv0",
            options: [{ version: "6.3.9", ignores: ["process.argv0"] }],
        },
        {
            code: "var { argv0 } = require('process'); argv0",
            options: [{ version: "6.3.9", ignores: ["process.argv0"] }],
        },
        {
            code: "import c from 'process'; c.argv0",
            options: [{ version: "6.3.9", ignores: ["process.argv0"] }],
        },
        {
            code: "process.channel",
            options: [{ version: "7.0.9", ignores: ["process.channel"] }],
        },
        {
            code: "process.cpuUsage",
            options: [{ version: "6.0.9", ignores: ["process.cpuUsage"] }],
        },
        {
            code: "process.emitWarning",
            options: [{ version: "7.9.9", ignores: ["process.emitWarning"] }],
        },
        {
            code: "process.getegid",
            options: [{ version: "1.9.9", ignores: ["process.getegid"] }],
        },
        {
            code: "process.geteuid",
            options: [{ version: "1.9.9", ignores: ["process.geteuid"] }],
        },
        {
            code: "process.hasUncaughtExceptionCaptureCallback",
            options: [
                {
                    version: "9.2.9",
                    ignores: ["process.hasUncaughtExceptionCaptureCallback"],
                },
            ],
        },
        {
            code: "process.ppid",
            options: [{ version: "9.1.9", ignores: ["process.ppid"] }],
        },
        {
            code: "process.release",
            options: [{ version: "2.9.9", ignores: ["process.release"] }],
        },
        {
            code: "process.setegid",
            options: [{ version: "1.9.9", ignores: ["process.setegid"] }],
        },
        {
            code: "process.seteuid",
            options: [{ version: "1.9.9", ignores: ["process.seteuid"] }],
        },
        {
            code: "process.setUncaughtExceptionCaptureCallback",
            options: [
                {
                    version: "9.2.9",
                    ignores: ["process.setUncaughtExceptionCaptureCallback"],
                },
            ],
        },
    ],
    invalid: [
        {
            code: "process.argv0",
            options: [{ version: "6.3.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.argv0",
                        supported: "6.4.0",
                        version: "6.3.9",
                    },
                },
            ],
        },
        {
            code: "require('process').argv0",
            options: [{ version: "6.3.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.argv0",
                        supported: "6.4.0",
                        version: "6.3.9",
                    },
                },
            ],
        },
        {
            code: "var c = require('process'); c.argv0",
            options: [{ version: "6.3.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.argv0",
                        supported: "6.4.0",
                        version: "6.3.9",
                    },
                },
            ],
        },
        {
            code: "var { argv0 } = require('process'); argv0",
            options: [{ version: "6.3.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.argv0",
                        supported: "6.4.0",
                        version: "6.3.9",
                    },
                },
            ],
        },
        {
            code: "import c from 'process'; c.argv0",
            options: [{ version: "6.3.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.argv0",
                        supported: "6.4.0",
                        version: "6.3.9",
                    },
                },
            ],
        },
        {
            code: "process.channel",
            options: [{ version: "7.0.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.channel",
                        supported: "7.1.0",
                        version: "7.0.9",
                    },
                },
            ],
        },
        {
            code: "process.cpuUsage",
            options: [{ version: "6.0.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.cpuUsage",
                        supported: "6.1.0",
                        version: "6.0.9",
                    },
                },
            ],
        },
        {
            code: "process.emitWarning",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.emitWarning",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "process.getegid",
            options: [{ version: "1.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.getegid",
                        supported: "2.0.0",
                        version: "1.9.9",
                    },
                },
            ],
        },
        {
            code: "process.geteuid",
            options: [{ version: "1.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.geteuid",
                        supported: "2.0.0",
                        version: "1.9.9",
                    },
                },
            ],
        },
        {
            code: "process.hasUncaughtExceptionCaptureCallback",
            options: [{ version: "9.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.hasUncaughtExceptionCaptureCallback",
                        supported: "9.3.0",
                        version: "9.2.9",
                    },
                },
            ],
        },
        {
            code: "process.ppid",
            options: [{ version: "9.1.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.ppid",
                        supported: "9.2.0",
                        version: "9.1.9",
                    },
                },
            ],
        },
        {
            code: "process.release",
            options: [{ version: "2.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.release",
                        supported: "3.0.0",
                        version: "2.9.9",
                    },
                },
            ],
        },
        {
            code: "process.setegid",
            options: [{ version: "1.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.setegid",
                        supported: "2.0.0",
                        version: "1.9.9",
                    },
                },
            ],
        },
        {
            code: "process.seteuid",
            options: [{ version: "1.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.seteuid",
                        supported: "2.0.0",
                        version: "1.9.9",
                    },
                },
            ],
        },
        {
            code: "process.setUncaughtExceptionCaptureCallback",
            options: [{ version: "9.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "process.setUncaughtExceptionCaptureCallback",
                        supported: "9.3.0",
                        version: "9.2.9",
                    },
                },
            ],
        },
    ],
})
