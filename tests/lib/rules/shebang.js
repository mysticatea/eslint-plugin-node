/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path");
var RuleTester = require("eslint").RuleTester;
var rule = require("../../../lib/rules/shebang");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/shebang", name);
}

//------------------------------------------------------------------------------
// Test
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("shebang", rule, {
    valid: [
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "#!/usr/bin/env node\nhello();"
        },
        {
            filename: fixture("string-bin/lib/test.js"),
            code: "hello();"
        },
        {
            filename: fixture("object-bin/bin/a.js"),
            code: "#!/usr/bin/env node\nhello();"
        },
        {
            filename: fixture("object-bin/bin/b.js"),
            code: "#!/usr/bin/env node\nhello();"
        },
        {
            filename: fixture("object-bin/bin/c.js"),
            code: "hello();"
        },
        {
            filename: fixture("no-bin-field/lib/test.js"),
            code: "hello();"
        },
        "#!/usr/bin/env node\nhello();",
        "hello();",

        // convertPath
        {
            filename: fixture("string-bin/src/bin/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            options: [{"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}]
        },
        {
            filename: fixture("string-bin/src/lib/test.js"),
            code: "hello();",
            options: [{"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}]
        },
        {
            filename: fixture("object-bin/src/bin/a.js"),
            code: "#!/usr/bin/env node\nhello();",
            options: [{"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}]
        },
        {
            filename: fixture("object-bin/src/bin/b.js"),
            code: "#!/usr/bin/env node\nhello();",
            options: [{"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}]
        },
        {
            filename: fixture("object-bin/src/bin/c.js"),
            code: "hello();",
            options: [{"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}]
        },
        {
            filename: fixture("no-bin-field/src/lib/test.js"),
            code: "hello();",
            options: [{"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}]
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/shebang/string-bin/bin/test.js",
            code: "#!/usr/bin/env node\nhello();"
        },
        {
            filename: "tests/fixtures/shebang/string-bin/lib/test.js",
            code: "hello();"
        }
    ],
    invalid: [
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "hello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "#!/usr/bin/node\nhello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: fixture("string-bin/lib/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            errors: ["This file needs no shebang."]
        },
        {
            filename: fixture("object-bin/bin/a.js"),
            code: "hello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: fixture("object-bin/bin/b.js"),
            code: "#!/usr/bin/node\nhello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: fixture("object-bin/bin/c.js"),
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            errors: ["This file needs no shebang."]
        },
        {
            filename: fixture("no-bin-field/lib/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            errors: ["This file needs no shebang."]
        },

        // convertPath
        {
            filename: fixture("string-bin/src/bin/test.js"),
            code: "hello();",
            output: "#!/usr/bin/env node\nhello();",
            options: [{"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}],
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: fixture("string-bin/src/bin/test.js"),
            code: "hello();",
            output: "#!/usr/bin/env node\nhello();",
            settings: {"node": {"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}},
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: fixture("string-bin/src/bin/test.js"),
            code: "#!/usr/bin/node\nhello();",
            output: "#!/usr/bin/env node\nhello();",
            options: [{"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}],
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: fixture("string-bin/src/lib/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            options: [{"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}],
            errors: ["This file needs no shebang."]
        },
        {
            filename: fixture("object-bin/src/bin/a.js"),
            code: "hello();",
            output: "#!/usr/bin/env node\nhello();",
            options: [{"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}],
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: fixture("object-bin/src/bin/b.js"),
            code: "#!/usr/bin/node\nhello();",
            output: "#!/usr/bin/env node\nhello();",
            options: [{"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}],
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: fixture("object-bin/src/bin/c.js"),
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            options: [{"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}],
            errors: ["This file needs no shebang."]
        },
        {
            filename: fixture("no-bin-field/src/lib/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            options: [{"convertPath": {"src/**": ["^src/(.+)$", "$1"]}}],
            errors: ["This file needs no shebang."]
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/shebang/string-bin/bin/test.js",
            code: "hello();",
            output: "#!/usr/bin/env node\nhello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: "tests/fixtures/shebang/string-bin/lib/test.js",
            code: "#!/usr/bin/env node\nhello();",
            output: "hello();",
            errors: ["This file needs no shebang."]
        },

        // header comments
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "/* header */\nhello();",
            output: "#!/usr/bin/env node\n/* header */\nhello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        }
    ]
});
