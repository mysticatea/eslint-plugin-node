/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path"),
    RuleTester = require("eslint").RuleTester,
    rule = require("../../../lib/rules/no-unpublished-import");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-unpublished", name);
}

//------------------------------------------------------------------------------
// Test
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-unpublished-import", rule, {
    valid: [
        {
            filename: fixture("1/test.js"),
            code: "import fs from 'fs';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("1/test.js"),
            code: "import aaa from 'aaa'; aaa();",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("1/test.js"),
            code: "import c from 'aaa/a/b/c';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("1/test.js"),
            code: "import a from './a';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("1/test.js"),
            code: "import a from './a.js';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import test from './test';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import bbb from 'bbb';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import c from 'bbb/a/b/c';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import ignore2 from './ignore2';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("3/test.js"),
            code: "import a from './pub/a';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("3/test.js"),
            code: "import test2 from './test2';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("3/test.js"),
            code: "import aaa from 'aaa';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("3/test.js"),
            code: "import bbb from 'bbb';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("3/pub/ignore1.js"),
            code: "import bbb from 'bbb';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import p from '../package.json';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },

        // Ignores it if the filename is unknown.
        {
            code: "import noExistPackage0 from 'no-exist-package-0';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            code: "import b from './b';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        }
    ],
    invalid: [
        {
            filename: fixture("1/test.js"),
            code: "import noDeps from 'no-deps';",
            errors: ["\"no-deps\" is not published."],
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("1/test.js"),
            code: "import c from 'no-deps/a/b/c';",
            errors: ["\"no-deps\" is not published."],
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("2/test.js"),
            code: "import ignore1 from './ignore1.js';",
            errors: ["\"./ignore1.js\" is not published."],
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("2/test.js"),
            code: "import ignore1 from './ignore1';",
            errors: ["\"./ignore1\" is not published."],
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import noDeps from 'no-deps';",
            errors: ["\"no-deps\" is not published."],
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("3/test.js"),
            code: "import noDeps from 'no-deps';",
            errors: ["\"no-deps\" is not published."],
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import bbb from 'bbb';",
            errors: ["\"bbb\" is not published."],
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import ignore1 from './ignore1';",
            errors: ["\"./ignore1\" is not published."],
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import abc from './abc';",
            errors: ["\"./abc\" is not published."],
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import test from '../test';",
            errors: ["\"../test\" is not published."],
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        }
    ]
});
