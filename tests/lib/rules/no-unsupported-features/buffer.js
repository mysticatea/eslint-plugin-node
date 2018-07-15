/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/buffer")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        Buffer: false,
        require: false,
    },
}).run("no-unsupported-features/buffer", rule, {
    valid: [
        {
            code: "Buffer.alloc",
            options: [{ version: "4.5.0" }],
        },
        {
            code: "Buffer.allocUnsafe",
            options: [{ version: "4.5.0" }],
        },
        {
            code: "Buffer.allocUnsafeSlow",
            options: [{ version: "4.5.0" }],
        },
        {
            code: "Buffer.from",
            options: [{ version: "4.5.0" }],
        },
        {
            code: "require('buffer').constants",
            options: [{ version: "8.2.0" }],
        },
        {
            code: "var cp = require('buffer'); cp.constants",
            options: [{ version: "8.2.0" }],
        },
        {
            code: "var { constants } = require('buffer');",
            options: [{ version: "8.2.0" }],
        },
        {
            code: "import cp from 'buffer'; cp.constants",
            options: [{ version: "8.2.0" }],
        },
        {
            code: "import { constants } from 'buffer'",
            options: [{ version: "8.2.0" }],
        },
        {
            code: "var {Buffer: b} = require('buffer'); b.alloc",
            options: [{ version: "4.5.0" }],
        },
        {
            code: "var {Buffer: b} = require('buffer'); b.allocUnsafe",
            options: [{ version: "4.5.0" }],
        },
        {
            code: "var {Buffer: b} = require('buffer'); b.allocUnsafeSlow",
            options: [{ version: "4.5.0" }],
        },
        {
            code: "var {Buffer: b} = require('buffer'); b.from",
            options: [{ version: "4.5.0" }],
        },
        {
            code: "require('buffer').kMaxLength",
            options: [{ version: "3.0.0" }],
        },
        {
            code: "require('buffer').transcode",
            options: [{ version: "7.1.0" }],
        },

        // Ignores
        {
            code: "Buffer.alloc",
            options: [{ version: "4.4.9", ignores: ["Buffer.alloc"] }],
        },
        {
            code: "Buffer.allocUnsafe",
            options: [{ version: "4.4.9", ignores: ["Buffer.allocUnsafe"] }],
        },
        {
            code: "Buffer.allocUnsafeSlow",
            options: [
                { version: "4.4.9", ignores: ["Buffer.allocUnsafeSlow"] },
            ],
        },
        {
            code: "Buffer.from",
            options: [{ version: "4.4.9", ignores: ["Buffer.from"] }],
        },
        {
            code: "require('buffer').constants",
            options: [{ version: "8.1.9", ignores: ["buffer.constants"] }],
        },
        {
            code: "var cp = require('buffer'); cp.constants",
            options: [{ version: "8.1.9", ignores: ["buffer.constants"] }],
        },
        {
            code: "var { constants } = require('buffer');",
            options: [{ version: "8.1.9", ignores: ["buffer.constants"] }],
        },
        {
            code: "import cp from 'buffer'; cp.constants",
            options: [{ version: "8.1.9", ignores: ["buffer.constants"] }],
        },
        {
            code: "import { constants } from 'buffer'",
            options: [{ version: "8.1.9", ignores: ["buffer.constants"] }],
        },
        {
            code: "var {Buffer: b} = require('buffer'); b.alloc",
            options: [{ version: "4.4.9", ignores: ["buffer.Buffer.alloc"] }],
        },
        {
            code: "var {Buffer: b} = require('buffer'); b.allocUnsafe",
            options: [
                { version: "4.4.9", ignores: ["buffer.Buffer.allocUnsafe"] },
            ],
        },
        {
            code: "var {Buffer: b} = require('buffer'); b.allocUnsafeSlow",
            options: [
                {
                    version: "4.4.9",
                    ignores: ["buffer.Buffer.allocUnsafeSlow"],
                },
            ],
        },
        {
            code: "var {Buffer: b} = require('buffer'); b.from",
            options: [{ version: "4.4.9", ignores: ["buffer.Buffer.from"] }],
        },
        {
            code: "require('buffer').kMaxLength",
            options: [{ version: "2.9.9", ignores: ["buffer.kMaxLength"] }],
        },
        {
            code: "require('buffer').transcode",
            options: [{ version: "7.0.9", ignores: ["buffer.transcode"] }],
        },
    ],
    invalid: [
        {
            code: "Buffer.alloc",
            options: [{ version: "4.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "Buffer.alloc",
                        supported: "4.5.0",
                        version: "4.4.9",
                    },
                },
            ],
        },
        {
            code: "Buffer.allocUnsafe",
            options: [{ version: "4.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "Buffer.allocUnsafe",
                        supported: "4.5.0",
                        version: "4.4.9",
                    },
                },
            ],
        },
        {
            code: "Buffer.allocUnsafeSlow",
            options: [{ version: "4.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "Buffer.allocUnsafeSlow",
                        supported: "4.5.0",
                        version: "4.4.9",
                    },
                },
            ],
        },
        {
            code: "Buffer.from",
            options: [{ version: "4.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "Buffer.from",
                        supported: "4.5.0",
                        version: "4.4.9",
                    },
                },
            ],
        },
        {
            code: "require('buffer').constants",
            options: [{ version: "8.1.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "buffer.constants",
                        supported: "8.2.0",
                        version: "8.1.9",
                    },
                },
            ],
        },
        {
            code: "var cp = require('buffer'); cp.constants",
            options: [{ version: "8.1.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "buffer.constants",
                        supported: "8.2.0",
                        version: "8.1.9",
                    },
                },
            ],
        },
        {
            code: "var { constants } = require('buffer');",
            options: [{ version: "8.1.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "buffer.constants",
                        supported: "8.2.0",
                        version: "8.1.9",
                    },
                },
            ],
        },
        {
            code: "import cp from 'buffer'; cp.constants",
            options: [{ version: "8.1.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "buffer.constants",
                        supported: "8.2.0",
                        version: "8.1.9",
                    },
                },
            ],
        },
        {
            code: "import { constants } from 'buffer'",
            options: [{ version: "8.1.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "buffer.constants",
                        supported: "8.2.0",
                        version: "8.1.9",
                    },
                },
            ],
        },
        {
            code: "var {Buffer: b} = require('buffer'); b.alloc",
            options: [{ version: "4.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "buffer.Buffer.alloc",
                        supported: "4.5.0",
                        version: "4.4.9",
                    },
                },
            ],
        },
        {
            code: "var {Buffer: b} = require('buffer'); b.allocUnsafe",
            options: [{ version: "4.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "buffer.Buffer.allocUnsafe",
                        supported: "4.5.0",
                        version: "4.4.9",
                    },
                },
            ],
        },
        {
            code: "var {Buffer: b} = require('buffer'); b.allocUnsafeSlow",
            options: [{ version: "4.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "buffer.Buffer.allocUnsafeSlow",
                        supported: "4.5.0",
                        version: "4.4.9",
                    },
                },
            ],
        },
        {
            code: "var {Buffer: b} = require('buffer'); b.from",
            options: [{ version: "4.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "buffer.Buffer.from",
                        supported: "4.5.0",
                        version: "4.4.9",
                    },
                },
            ],
        },
        {
            code: "require('buffer').kMaxLength",
            options: [{ version: "2.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "buffer.kMaxLength",
                        supported: "3.0.0",
                        version: "2.9.9",
                    },
                },
            ],
        },
        {
            code: "require('buffer').transcode",
            options: [{ version: "7.0.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "buffer.transcode",
                        supported: "7.1.0",
                        version: "7.0.9",
                    },
                },
            ],
        },
    ],
})
