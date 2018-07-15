/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/console")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        console: false,
        require: false,
    },
}).run("no-unsupported-features/console", rule, {
    valid: [
        {
            code: "console.clear()",
            options: [{ version: "8.3.0" }],
        },
        {
            code: "require('console').clear()",
            options: [{ version: "8.3.0" }],
        },
        {
            code: "var c = require('console'); c.clear()",
            options: [{ version: "8.3.0" }],
        },
        {
            code: "var { clear } = require('console'); clear()",
            options: [{ version: "8.3.0" }],
        },
        {
            code: "import c from 'console'; c.clear()",
            options: [{ version: "8.3.0" }],
        },
        {
            code: "console.count()",
            options: [{ version: "8.3.0" }],
        },
        {
            code: "console.countReset()",
            options: [{ version: "8.3.0" }],
        },
        {
            code: "console.debug()",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "console.dirxml()",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "console.group()",
            options: [{ version: "8.5.0" }],
        },
        {
            code: "console.groupCollapsed()",
            options: [{ version: "8.5.0" }],
        },
        {
            code: "console.groupEnd()",
            options: [{ version: "8.5.0" }],
        },
        {
            code: "console.table()",
            options: [{ version: "10.0.0" }],
        },
        {
            code: "console.markTimeline()",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "console.profile()",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "console.profileEnd()",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "console.timeStamp()",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "console.timeline()",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "console.timelineEnd()",
            options: [{ version: "8.0.0" }],
        },

        // Ignores.
        {
            code: "console.clear()",
            options: [{ version: "8.2.9", ignores: ["console.clear"] }],
        },
        {
            code: "require('console').clear()",
            options: [{ version: "8.2.9", ignores: ["console.clear"] }],
        },
        {
            code: "var c = require('console'); c.clear()",
            options: [{ version: "8.2.9", ignores: ["console.clear"] }],
        },
        {
            code: "var { clear } = require('console'); clear()",
            options: [{ version: "8.2.9", ignores: ["console.clear"] }],
        },
        {
            code: "import c from 'console'; c.clear()",
            options: [{ version: "8.2.9", ignores: ["console.clear"] }],
        },
        {
            code: "console.count()",
            options: [{ version: "8.2.9", ignores: ["console.count"] }],
        },
        {
            code: "console.countReset()",
            options: [{ version: "8.2.9", ignores: ["console.countReset"] }],
        },
        {
            code: "console.debug()",
            options: [{ version: "7.9.9", ignores: ["console.debug"] }],
        },
        {
            code: "console.dirxml()",
            options: [{ version: "7.9.9", ignores: ["console.dirxml"] }],
        },
        {
            code: "console.group()",
            options: [{ version: "8.4.9", ignores: ["console.group"] }],
        },
        {
            code: "console.groupCollapsed()",
            options: [
                { version: "8.4.9", ignores: ["console.groupCollapsed"] },
            ],
        },
        {
            code: "console.groupEnd()",
            options: [{ version: "8.4.9", ignores: ["console.groupEnd"] }],
        },
        {
            code: "console.table()",
            options: [{ version: "9.9.9", ignores: ["console.table"] }],
        },
        {
            code: "console.markTimeline()",
            options: [{ version: "7.9.9", ignores: ["console.markTimeline"] }],
        },
        {
            code: "console.profile()",
            options: [{ version: "7.9.9", ignores: ["console.profile"] }],
        },
        {
            code: "console.profileEnd()",
            options: [{ version: "7.9.9", ignores: ["console.profileEnd"] }],
        },
        {
            code: "console.timeStamp()",
            options: [{ version: "7.9.9", ignores: ["console.timeStamp"] }],
        },
        {
            code: "console.timeline()",
            options: [{ version: "7.9.9", ignores: ["console.timeline"] }],
        },
        {
            code: "console.timelineEnd()",
            options: [{ version: "7.9.9", ignores: ["console.timelineEnd"] }],
        },
    ],
    invalid: [
        {
            code: "console.clear()",
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.clear",
                        supported: "8.3.0",
                        version: "8.2.9",
                    },
                },
            ],
        },
        {
            code: "require('console').clear()",
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.clear",
                        supported: "8.3.0",
                        version: "8.2.9",
                    },
                },
            ],
        },
        {
            code: "var c = require('console'); c.clear()",
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.clear",
                        supported: "8.3.0",
                        version: "8.2.9",
                    },
                },
            ],
        },
        {
            code: "var { clear } = require('console'); clear()",
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.clear",
                        supported: "8.3.0",
                        version: "8.2.9",
                    },
                },
            ],
        },
        {
            code: "import c from 'console'; c.clear()",
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.clear",
                        supported: "8.3.0",
                        version: "8.2.9",
                    },
                },
            ],
        },
        {
            code: "console.count()",
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.count",
                        supported: "8.3.0",
                        version: "8.2.9",
                    },
                },
            ],
        },
        {
            code: "console.countReset()",
            options: [{ version: "8.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.countReset",
                        supported: "8.3.0",
                        version: "8.2.9",
                    },
                },
            ],
        },
        {
            code: "console.debug()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.debug",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "console.dirxml()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.dirxml",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "console.group()",
            options: [{ version: "8.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.group",
                        supported: "8.5.0",
                        version: "8.4.9",
                    },
                },
            ],
        },
        {
            code: "console.groupCollapsed()",
            options: [{ version: "8.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.groupCollapsed",
                        supported: "8.5.0",
                        version: "8.4.9",
                    },
                },
            ],
        },
        {
            code: "console.groupEnd()",
            options: [{ version: "8.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.groupEnd",
                        supported: "8.5.0",
                        version: "8.4.9",
                    },
                },
            ],
        },
        {
            code: "console.table()",
            options: [{ version: "9.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.table",
                        supported: "10.0.0",
                        version: "9.9.9",
                    },
                },
            ],
        },
        {
            code: "console.markTimeline()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.markTimeline",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "console.profile()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.profile",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "console.profileEnd()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.profileEnd",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "console.timeStamp()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.timeStamp",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "console.timeline()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.timeline",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "console.timelineEnd()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "console.timelineEnd",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
    ],
})
