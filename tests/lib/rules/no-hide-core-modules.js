/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 *
 * @deprecated since v4.2.0
 * This rule was based on an invalid assumption.
 * No meaning.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path")
const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-hide-core-modules")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const THIRD_PERTY = path.resolve(
    __dirname,
    "../../fixtures/no-hide-core-modules/thirdparty/test.js"
)
const NO_THIRD_PERTY = path.resolve(
    __dirname,
    "../../fixtures/no-hide-core-modules/no-thirdparty/test.js"
)
const INDIRECT_THIRD_PERTY = path.resolve(
    __dirname,
    "../../fixtures/no-hide-core-modules/indirect-thirdparty/test.js"
)

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const tester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: { require: false },
})

tester.run("no-hide-core-modules", rule, {
    valid: [
        "require('util')",
        {
            filename: NO_THIRD_PERTY,
            code: "require('util')",
        },
        {
            filename: THIRD_PERTY,
            code: "require('util')",
            options: [{ allow: ["util"] }],
        },
        {
            filename: INDIRECT_THIRD_PERTY,
            code: "require('util')",
            options: [{ allow: ["util"] }],
        },
        {
            filename: THIRD_PERTY,
            code: "require('util')",
            options: [{ ignoreDirectDependencies: true }],
        },
        {
            filename: INDIRECT_THIRD_PERTY,
            code: "require('util')",
            options: [{ ignoreIndirectDependencies: true }],
        },

        "import util from 'util'",
        {
            filename: NO_THIRD_PERTY,
            code: "import util from 'util'",
        },
        {
            filename: THIRD_PERTY,
            code: "import util from 'util'",
            options: [{ allow: ["util"] }],
        },
        {
            filename: INDIRECT_THIRD_PERTY,
            code: "import util from 'util'",
            options: [{ allow: ["util"] }],
        },
        {
            filename: THIRD_PERTY,
            code: "import util from 'util'",
            options: [{ ignoreDirectDependencies: true }],
        },
        {
            filename: INDIRECT_THIRD_PERTY,
            code: "import util from 'util'",
            options: [{ ignoreIndirectDependencies: true }],
        },
    ],
    invalid: [
        {
            filename: THIRD_PERTY,
            code: "require('util')",
            errors: [
                "Unexpected import of third-party module 'node_modules/util/index.js'.",
            ],
        },
        {
            filename: THIRD_PERTY,
            code: "require('util')",
            options: [{ allow: ["path"] }],
            errors: [
                "Unexpected import of third-party module 'node_modules/util/index.js'.",
            ],
        },
        {
            filename: THIRD_PERTY,
            code: "require('util')",
            options: [{ ignoreIndirectDependencies: true }],
            errors: [
                "Unexpected import of third-party module 'node_modules/util/index.js'.",
            ],
        },
        {
            filename: INDIRECT_THIRD_PERTY,
            code: "require('util')",
            errors: [
                "Unexpected import of third-party module 'node_modules/util/index.js'.",
            ],
        },
        {
            filename: INDIRECT_THIRD_PERTY,
            code: "require('util')",
            options: [{ allow: ["path"] }],
            errors: [
                "Unexpected import of third-party module 'node_modules/util/index.js'.",
            ],
        },
        {
            filename: INDIRECT_THIRD_PERTY,
            code: "require('util')",
            options: [{ ignoreDirectDependencies: true }],
            errors: [
                "Unexpected import of third-party module 'node_modules/util/index.js'.",
            ],
        },

        {
            filename: THIRD_PERTY,
            code: "import util from 'util'",
            errors: [
                "Unexpected import of third-party module 'node_modules/util/index.js'.",
            ],
        },
        {
            filename: THIRD_PERTY,
            code: "import util from 'util'",
            options: [{ allow: ["path"] }],
            errors: [
                "Unexpected import of third-party module 'node_modules/util/index.js'.",
            ],
        },
        {
            filename: THIRD_PERTY,
            code: "import util from 'util'",
            options: [{ ignoreIndirectDependencies: true }],
            errors: [
                "Unexpected import of third-party module 'node_modules/util/index.js'.",
            ],
        },
        {
            filename: INDIRECT_THIRD_PERTY,
            code: "import util from 'util'",
            errors: [
                "Unexpected import of third-party module 'node_modules/util/index.js'.",
            ],
        },
        {
            filename: INDIRECT_THIRD_PERTY,
            code: "import util from 'util'",
            options: [{ allow: ["path"] }],
            errors: [
                "Unexpected import of third-party module 'node_modules/util/index.js'.",
            ],
        },
        {
            filename: INDIRECT_THIRD_PERTY,
            code: "import util from 'util'",
            options: [{ ignoreDirectDependencies: true }],
            errors: [
                "Unexpected import of third-party module 'node_modules/util/index.js'.",
            ],
        },
    ],
})
