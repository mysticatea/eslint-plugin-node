/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path")
const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-unpublished-import")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-unpublished", name)
}

//------------------------------------------------------------------------------
// Test
//------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run("no-unpublished-import", rule, {
    valid: [
        {
            filename: fixture("1/test.js"),
            code: "import fs from 'fs';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("1/test.js"),
            code: "import aaa from 'aaa'; aaa();",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("1/test.js"),
            code: "import c from 'aaa/a/b/c';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("1/test.js"),
            code: "import a from './a';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("1/test.js"),
            code: "import a from './a.js';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import test from './test';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import bbb from 'bbb';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import c from 'bbb/a/b/c';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import ignore2 from './ignore2';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/test.js"),
            code: "import a from './pub/a';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/test.js"),
            code: "import test2 from './test2';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/test.js"),
            code: "import aaa from 'aaa';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/test.js"),
            code: "import bbb from 'bbb';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/pub/ignore1.js"),
            code: "import bbb from 'bbb';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import p from '../package.json';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/src/pub/test.js"),
            code: "import bbb from 'bbb';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/src/pub/test.js"),
            code: "import bbb from 'bbb!foo?a=b&c=d';",
            parserOptions: {sourceType: "module"},
        },

        // `convertPath` option.
        {
            filename: fixture("3/src/test.jsx"),
            code: "import a from './a';",
            parserOptions: {sourceType: "module"},
            settings: {
                node: {
                    convertPath: {"src/**/*.jsx": ["src/(.+?)\\.jsx", "pub/$1.js"]},
                    tryExtensions: [".js", ".jsx", ".json"],
                },
            },
        },
        {
            filename: fixture("3/src/test.jsx"),
            code: "import a from './a';",
            parserOptions: {sourceType: "module"},
            options: [{
                convertPath: {"src/**/*.jsx": ["src/(.+?)\\.jsx", "pub/$1.js"]},
                tryExtensions: [".js", ".jsx", ".json"],
            }],
        },

        // Ignores it if the filename is unknown.
        {
            code: "import noExistPackage0 from 'no-exist-package-0';",
            parserOptions: {sourceType: "module"},
        },
        {
            code: "import b from './b';",
            parserOptions: {sourceType: "module"},
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-unpublished/2/test.js",
            code: "import aaa from 'aaa';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: "tests/fixtures/no-unpublished/2/test.js",
            code: "import a from './a';",
            parserOptions: {sourceType: "module"},
        },

        {
            filename: fixture("1/test.js"),
            code: "import electron from 'electron';",
            options: [{allowModules: ["electron"]}],
            parserOptions: {sourceType: "module"},
        },
    ],
    invalid: [
        {
            filename: fixture("1/test.js"),
            code: "import noDeps from 'no-deps';",
            errors: ["\"no-deps\" is not published."],
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("1/test.js"),
            code: "import c from 'no-deps/a/b/c';",
            errors: ["\"no-deps\" is not published."],
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("2/test.js"),
            code: "import ignore1 from './ignore1.js';",
            errors: ["\"./ignore1.js\" is not published."],
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("2/test.js"),
            code: "import ignore1 from './ignore1';",
            errors: ["\"./ignore1\" is not published."],
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import noDeps from 'no-deps';",
            errors: ["\"no-deps\" is not published."],
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/test.js"),
            code: "import noDeps from 'no-deps';",
            errors: ["\"no-deps\" is not published."],
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import bbb from 'bbb';",
            errors: ["\"bbb\" is not published."],
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import ignore1 from './ignore1';",
            errors: ["\"./ignore1\" is not published."],
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import abc from './abc';",
            errors: ["\"./abc\" is not published."],
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import test from '../test';",
            errors: ["\"../test\" is not published."],
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import a from '../src/pub/a.js';",
            parserOptions: {sourceType: "module"},
            errors: ["\"../src/pub/a.js\" is not published."],
        },

        {
            filename: fixture("1/test.js"),
            code: "import a from '../a.js';",
            errors: ["\"../a.js\" is not published."],
            parserOptions: {sourceType: "module"},
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-unpublished/2/test.js",
            code: "import noDeps from 'no-deps';",
            errors: ["\"no-deps\" is not published."],
            parserOptions: {sourceType: "module"},
        },
        {
            filename: "tests/fixtures/no-unpublished/2/test.js",
            code: "import ignore1 from './ignore1';",
            errors: ["\"./ignore1\" is not published."],
            parserOptions: {sourceType: "module"},
        },
    ],
})
