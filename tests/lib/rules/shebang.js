/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/shebang")

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/shebang", name)
}

const ruleTester = new RuleTester()
ruleTester.run("shebang", rule, {
    valid: [
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "#!/usr/bin/env node\nhello();",
        },
        {
            filename: fixture("string-bin/lib/test.js"),
            code: "hello();",
        },
        {
            filename: fixture("object-bin/bin/a.js"),
            code: "#!/usr/bin/env node\nhello();",
        },
        {
            filename: fixture("object-bin/bin/b.js"),
            code: "#!/usr/bin/env node\nhello();",
        },
        {
            filename: fixture("object-bin/bin/c.js"),
            code: "hello();",
        },
        {
            filename: fixture("no-bin-field/lib/test.js"),
            code: "hello();",
        },
        "#!/usr/bin/env node\nhello();",
        "hello();",

        // convertPath
        {
            filename: fixture("string-bin/src/bin/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            options: [{ convertPath: { "src/**": ["^src/(.+)$", "$1"] } }],
        },
        {
            filename: fixture("string-bin/src/lib/test.js"),
            code: "hello();",
            options: [{ convertPath: { "src/**": ["^src/(.+)$", "$1"] } }],
        },
        {
            filename: fixture("object-bin/src/bin/a.js"),
            code: "#!/usr/bin/env node\nhello();",
            options: [{ convertPath: { "src/**": ["^src/(.+)$", "$1"] } }],
        },
        {
            filename: fixture("object-bin/src/bin/b.js"),
            code: "#!/usr/bin/env node\nhello();",
            options: [{ convertPath: { "src/**": ["^src/(.+)$", "$1"] } }],
        },
        {
            filename: fixture("object-bin/src/bin/c.js"),
            code: "hello();",
            options: [{ convertPath: { "src/**": ["^src/(.+)$", "$1"] } }],
        },
        {
            filename: fixture("no-bin-field/src/lib/test.js"),
            code: "hello();",
            options: [{ convertPath: { "src/**": ["^src/(.+)$", "$1"] } }],
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/shebang/string-bin/bin/test.js",
            code: "#!/usr/bin/env node\nhello();",
        },
        {
            filename: "tests/fixtures/shebang/string-bin/lib/test.js",
            code: "hello();",
        },

        // BOM and \r\n
        {
            filename: fixture("string-bin/lib/test.js"),
            code: "\uFEFFhello();",
        },
        {
            filename: fixture("string-bin/lib/test.js"),
            code: "\uFEFFhello();\n",
        },
        {
            filename: fixture("string-bin/lib/test.js"),
            code: "hello();\r\n",
        },
        {
            filename: fixture("string-bin/lib/test.js"),
            code: "\uFEFFhello();\r\n",
        },

        // blank lines on the top of files.
        {
            filename: fixture("string-bin/lib/test.js"),
            code: "\n\n\nhello();",
        },

        // https://github.com/mysticatea/eslint-plugin-node/issues/51
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "#!/usr/bin/env node --harmony\nhello();",
        },

        // use node resolution
        {
            filename: fixture("object-bin/bin/index.js"),
            code: "#!/usr/bin/env node\nhello();",
        },
    ],
    invalid: [
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "hello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "#!/usr/bin/node\nhello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: fixture("string-bin/lib/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            errors: ["This file needs no shebang."],
        },
        {
            filename: fixture("object-bin/bin/a.js"),
            code: "hello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: fixture("object-bin/bin/b.js"),
            code: "#!/usr/bin/node\nhello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: fixture("object-bin/bin/c.js"),
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            errors: ["This file needs no shebang."],
        },
        {
            filename: fixture("no-bin-field/lib/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            errors: ["This file needs no shebang."],
        },

        // convertPath
        {
            filename: fixture("string-bin/src/bin/test.js"),
            code: "hello();",
            output: "#!/usr/bin/env node\nhello();",
            options: [{ convertPath: { "src/**": ["^src/(.+)$", "$1"] } }],
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: fixture("string-bin/src/bin/test.js"),
            code: "hello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
            settings: {
                node: { convertPath: { "src/**": ["^src/(.+)$", "$1"] } },
            },
        },
        {
            filename: fixture("string-bin/src/bin/test.js"),
            code: "#!/usr/bin/node\nhello();",
            output: "#!/usr/bin/env node\nhello();",
            options: [{ convertPath: { "src/**": ["^src/(.+)$", "$1"] } }],
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: fixture("string-bin/src/lib/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            options: [{ convertPath: { "src/**": ["^src/(.+)$", "$1"] } }],
            errors: ["This file needs no shebang."],
        },
        {
            filename: fixture("object-bin/src/bin/a.js"),
            code: "hello();",
            output: "#!/usr/bin/env node\nhello();",
            options: [{ convertPath: { "src/**": ["^src/(.+)$", "$1"] } }],
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: fixture("object-bin/src/bin/b.js"),
            code: "#!/usr/bin/node\nhello();",
            output: "#!/usr/bin/env node\nhello();",
            options: [{ convertPath: { "src/**": ["^src/(.+)$", "$1"] } }],
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: fixture("object-bin/src/bin/c.js"),
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            options: [{ convertPath: { "src/**": ["^src/(.+)$", "$1"] } }],
            errors: ["This file needs no shebang."],
        },
        {
            filename: fixture("no-bin-field/src/lib/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            options: [{ convertPath: { "src/**": ["^src/(.+)$", "$1"] } }],
            errors: ["This file needs no shebang."],
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/shebang/string-bin/bin/test.js",
            code: "hello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: "tests/fixtures/shebang/string-bin/lib/test.js",
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            errors: ["This file needs no shebang."],
        },

        // header comments
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "/* header */\nhello();",
            output: "#!/usr/bin/env node\n/* header */\nhello();",
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },

        // BOM and \r\n
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "\uFEFFhello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "hello();\n",
            output: "#!/usr/bin/env node\nhello();\n",
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "hello();\r\n",
            output: "#!/usr/bin/env node\nhello();\r\n",
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "\uFEFFhello();\n",
            output: "#!/usr/bin/env node\nhello();\n",
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "\uFEFFhello();\r\n",
            output: "#!/usr/bin/env node\nhello();\r\n",
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "#!/usr/bin/env node\r\nhello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ["This file must have Unix linebreaks (LF)."],
        },
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "\uFEFF#!/usr/bin/env node\nhello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ["This file must not have Unicode BOM."],
        },
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "\uFEFF#!/usr/bin/env node\r\nhello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: [
                "This file must not have Unicode BOM.",
                "This file must have Unix linebreaks (LF).",
            ],
        },

        // https://github.com/mysticatea/eslint-plugin-node/issues/51
        {
            filename: fixture("string-bin/lib/test.js"),
            code: "#!/usr/bin/env node --harmony\nhello();",
            output: "hello();",
            errors: ["This file needs no shebang."],
        },

        // use node resolution
        {
            filename: fixture("object-bin/bin/index.js"),
            code: "hello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ['This file needs shebang "#!/usr/bin/env node".'],
        },
    ],
})
