/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/v8")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/v8", rule, {
    valid: [
        {
            code: "require('v8')",
            options: [{ version: "1.0.0" }],
        },
        {
            code: "import hooks from 'v8'",
            options: [{ version: "1.0.0" }],
        },
        {
            code: "require('v8').cachedDataVersionTag()",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "var hooks = require('v8'); hooks.cachedDataVersionTag()",
            options: [{ version: "8.0.0" }],
        },
        {
            code:
                "var { cachedDataVersionTag } = require('v8'); cachedDataVersionTag()",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "import v8 from 'v8'; v8.cachedDataVersionTag()",
            options: [{ version: "8.0.0" }],
        },
        {
            code:
                "import { cachedDataVersionTag } from 'v8'; cachedDataVersionTag()",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "require('v8').getHeapSpaceStatistics()",
            options: [{ version: "6.0.0" }],
        },
        {
            code: "require('v8').serialize()",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "require('v8').deserialize()",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "require('v8').Serializer",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "require('v8').Deserializer",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "require('v8').DefaultSerializer",
            options: [{ version: "8.0.0" }],
        },
        {
            code: "require('v8').DefaultDeserializer",
            options: [{ version: "8.0.0" }],
        },

        // Ignores.
        {
            code: "require('v8')",
            options: [{ version: "0.12.99", ignores: ["v8"] }],
        },
        {
            code: "import hooks from 'v8'",
            options: [{ version: "0.12.99", ignores: ["v8"] }],
        },
        {
            code: "import { cachedDataVersionTag } from 'v8'",
            options: [
                {
                    version: "0.12.99",
                    ignores: ["v8", "v8.cachedDataVersionTag"],
                },
            ],
        },
        {
            code: "require('v8').cachedDataVersionTag()",
            options: [
                { version: "7.9.9", ignores: ["v8.cachedDataVersionTag"] },
            ],
        },
        {
            code: "var hooks = require('v8'); hooks.cachedDataVersionTag()",
            options: [
                { version: "7.9.9", ignores: ["v8.cachedDataVersionTag"] },
            ],
        },
        {
            code:
                "var { cachedDataVersionTag } = require('v8'); cachedDataVersionTag()",
            options: [
                { version: "7.9.9", ignores: ["v8.cachedDataVersionTag"] },
            ],
        },
        {
            code: "import v8 from 'v8'; v8.cachedDataVersionTag()",
            options: [
                { version: "7.9.9", ignores: ["v8.cachedDataVersionTag"] },
            ],
        },
        {
            code:
                "import { cachedDataVersionTag } from 'v8'; cachedDataVersionTag()",
            options: [
                { version: "7.9.9", ignores: ["v8.cachedDataVersionTag"] },
            ],
        },
        {
            code: "require('v8').getHeapSpaceStatistics()",
            options: [
                { version: "5.9.9", ignores: ["v8.getHeapSpaceStatistics"] },
            ],
        },
        {
            code: "require('v8').serialize()",
            options: [{ version: "7.9.9", ignores: ["v8.serialize"] }],
        },
        {
            code: "require('v8').deserialize()",
            options: [{ version: "7.9.9", ignores: ["v8.deserialize"] }],
        },
        {
            code: "require('v8').Serializer",
            options: [{ version: "7.9.9", ignores: ["v8.Serializer"] }],
        },
        {
            code: "require('v8').Deserializer",
            options: [{ version: "7.9.9", ignores: ["v8.Deserializer"] }],
        },
        {
            code: "require('v8').DefaultSerializer",
            options: [{ version: "7.9.9", ignores: ["v8.DefaultSerializer"] }],
        },
        {
            code: "require('v8').DefaultDeserializer",
            options: [
                { version: "7.9.9", ignores: ["v8.DefaultDeserializer"] },
            ],
        },
    ],
    invalid: [
        {
            code: "require('v8')",
            options: [{ version: "0.12.99" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8",
                        supported: "1.0.0",
                        version: "0.12.99",
                    },
                },
            ],
        },
        {
            code: "import hooks from 'v8'",
            options: [{ version: "0.12.99" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8",
                        supported: "1.0.0",
                        version: "0.12.99",
                    },
                },
            ],
        },
        {
            code: "import { cachedDataVersionTag } from 'v8'",
            options: [{ version: "0.12.99" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8",
                        supported: "1.0.0",
                        version: "0.12.99",
                    },
                },
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8.cachedDataVersionTag",
                        supported: "8.0.0",
                        version: "0.12.99",
                    },
                },
            ],
        },
        {
            code: "require('v8').cachedDataVersionTag()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8.cachedDataVersionTag",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "var hooks = require('v8'); hooks.cachedDataVersionTag()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8.cachedDataVersionTag",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code:
                "var { cachedDataVersionTag } = require('v8'); cachedDataVersionTag()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8.cachedDataVersionTag",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "import v8 from 'v8'; v8.cachedDataVersionTag()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8.cachedDataVersionTag",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code:
                "import { cachedDataVersionTag } from 'v8'; cachedDataVersionTag()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8.cachedDataVersionTag",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "require('v8').getHeapSpaceStatistics()",
            options: [{ version: "5.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8.getHeapSpaceStatistics",
                        supported: "6.0.0",
                        version: "5.9.9",
                    },
                },
            ],
        },
        {
            code: "require('v8').serialize()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8.serialize",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "require('v8').deserialize()",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8.deserialize",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "require('v8').Serializer",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8.Serializer",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "require('v8').Deserializer",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8.Deserializer",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "require('v8').DefaultSerializer",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8.DefaultSerializer",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "require('v8').DefaultDeserializer",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "v8.DefaultDeserializer",
                        supported: "8.0.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
    ],
})
