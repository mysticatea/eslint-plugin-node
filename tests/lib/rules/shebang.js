/**
 * @fileoverview Tests for shebang rule.
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
        "hello();"
    ],
    invalid: [
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "hello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: fixture("string-bin/bin/test.js"),
            code: "#!/usr/bin/node\nhello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: fixture("string-bin/lib/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            errors: ["This file needs no shebang."]
        },
        {
            filename: fixture("object-bin/bin/a.js"),
            code: "hello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: fixture("object-bin/bin/b.js"),
            code: "#!/usr/bin/node\nhello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\"."]
        },
        {
            filename: fixture("object-bin/bin/c.js"),
            code: "#!/usr/bin/env node\nhello();",
            errors: ["This file needs no shebang."]
        },
        {
            filename: fixture("no-bin-field/lib/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            errors: ["This file needs no shebang."]
        }
    ]
});
