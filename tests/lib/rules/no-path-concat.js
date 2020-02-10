/**
 * @author Nicholas C. Zakas
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-path-concat")

new RuleTester().run("no-path-concat", rule, {
    valid: [
        'var fullPath = dirname + "foo.js";',
        'var fullPath = __dirname == "foo.js";',
        "if (fullPath === __dirname) {}",
        "if (__dirname === fullPath) {}",
    ],

    invalid: [
        {
            code: 'var fullPath = __dirname + "/foo.js";',
            errors: [
                {
                    messageId: "usePathFunctions",
                    type: "BinaryExpression",
                },
            ],
        },
        {
            code: 'var fullPath = __filename + "/foo.js";',
            errors: [
                {
                    messageId: "usePathFunctions",
                    type: "BinaryExpression",
                },
            ],
        },
        {
            code: 'var fullPath = "/foo.js" + __filename;',
            errors: [
                {
                    messageId: "usePathFunctions",
                    type: "BinaryExpression",
                },
            ],
        },
        {
            code: 'var fullPath = "/foo.js" + __dirname;',
            errors: [
                {
                    messageId: "usePathFunctions",
                    type: "BinaryExpression",
                },
            ],
        },
    ],
})
