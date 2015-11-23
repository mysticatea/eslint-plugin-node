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

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixtures(name) {
    return path.resolve(__dirname, "../../fixtures/shebang", name);
}

//------------------------------------------------------------------------------
// Test
//------------------------------------------------------------------------------

var ruleTester = new (require("eslint").RuleTester)();
ruleTester.run("shebang", require("../../../lib/rules/shebang"), {
    valid: [
        {
            filename: fixtures("string-bin/bin/test.js"),
            code: "#!/usr/bin/env node\nhello();"
        },
        {
            filename: fixtures("string-bin/lib/test.js"),
            code: "hello();"
        },
        {
            filename: fixtures("object-bin/bin/a.js"),
            code: "#!/usr/bin/env node\nhello();"
        },
        {
            filename: fixtures("object-bin/bin/b.js"),
            code: "#!/usr/bin/env node\nhello();"
        },
        {
            filename: fixtures("object-bin/bin/c.js"),
            code: "hello();"
        },
        {
            filename: fixtures("no-bin-field/lib/test.js"),
            code: "hello();"
        }
    ],
    invalid: [
        {
            filename: fixtures("string-bin/bin/test.js"),
            code: "hello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\""]
        },
        {
            filename: fixtures("string-bin/bin/test.js"),
            code: "#!/usr/bin/node\nhello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\""]
        },
        {
            filename: fixtures("string-bin/lib/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            errors: ["This file needs no shebang \"#!/usr/bin/env node\""]
        },
        {
            filename: fixtures("object-bin/bin/a.js"),
            code: "hello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\""]
        },
        {
            filename: fixtures("object-bin/bin/b.js"),
            code: "#!/usr/bin/node\nhello();",
            errors: ["This file needs shebang \"#!/usr/bin/env node\""]
        },
        {
            filename: fixtures("object-bin/bin/c.js"),
            code: "#!/usr/bin/env node\nhello();",
            errors: ["This file needs no shebang \"#!/usr/bin/env node\""]
        },
        {
            filename: fixtures("no-bin-field/lib/test.js"),
            code: "#!/usr/bin/env node\nhello();",
            errors: ["This file needs no shebang \"#!/usr/bin/env node\""]
        }
    ]
});
