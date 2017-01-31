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

const ruleTester = new RuleTester({parserOptions: {sourceType: "module"}})
ruleTester.run("no-unpublished-import", rule, {
    valid: [
        {
            filename: fixture("1/test.js"),
            code: "import fs from 'fs';",
        },
        {
            filename: fixture("1/test.js"),
            code: "import aaa from 'aaa'; aaa();",
        },
        {
            filename: fixture("1/test.js"),
            code: "import c from 'aaa/a/b/c';",
        },
        {
            filename: fixture("1/test.js"),
            code: "import a from './a';",
        },
        {
            filename: fixture("1/test.js"),
            code: "import a from './a.js';",
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import test from './test';",
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import bbb from 'bbb';",
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import c from 'bbb/a/b/c';",
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import ignore2 from './ignore2';",
        },
        {
            filename: fixture("3/test.js"),
            code: "import a from './pub/a';",
        },
        {
            filename: fixture("3/test.js"),
            code: "import test2 from './test2';",
        },
        {
            filename: fixture("3/test.js"),
            code: "import aaa from 'aaa';",
        },
        {
            filename: fixture("3/test.js"),
            code: "import bbb from 'bbb';",
        },
        {
            filename: fixture("3/pub/ignore1.js"),
            code: "import bbb from 'bbb';",
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import p from '../package.json';",
        },
        {
            filename: fixture("3/src/pub/test.js"),
            code: "import bbb from 'bbb';",
        },
        {
            filename: fixture("3/src/pub/test.js"),
            code: "import bbb from 'bbb!foo?a=b&c=d';",
        },

        // Ignores it if the filename is unknown.
        "import noExistPackage0 from 'no-exist-package-0';",
        "import b from './b';",

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-unpublished/2/test.js",
            code: "import aaa from 'aaa';",
        },
        {
            filename: "tests/fixtures/no-unpublished/2/test.js",
            code: "import a from './a';",
        },

        {
            filename: fixture("1/test.js"),
            code: "import electron from 'electron';",
            options: [{allowModules: ["electron"]}],
        },
    ],
    invalid: [
        {
            filename: fixture("1/test.js"),
            code: "import noDeps from 'no-deps';",
            errors: ["\"no-deps\" is not published."],
        },
        {
            filename: fixture("1/test.js"),
            code: "import c from 'no-deps/a/b/c';",
            errors: ["\"no-deps\" is not published."],
        },
        {
            filename: fixture("2/test.js"),
            code: "import ignore1 from './ignore1.js';",
            errors: ["\"./ignore1.js\" is not published."],
        },
        {
            filename: fixture("2/test.js"),
            code: "import ignore1 from './ignore1';",
            errors: ["\"./ignore1\" is not published."],
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "import noDeps from 'no-deps';",
            errors: ["\"no-deps\" is not published."],
        },
        {
            filename: fixture("3/test.js"),
            code: "import noDeps from 'no-deps';",
            errors: ["\"no-deps\" is not published."],
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import bbb from 'bbb';",
            errors: ["\"bbb\" is not published."],
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import ignore1 from './ignore1';",
            errors: ["\"./ignore1\" is not published."],
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import abc from './abc';",
            errors: ["\"./abc\" is not published."],
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import test from '../test';",
            errors: ["\"../test\" is not published."],
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "import a from '../src/pub/a.js';",
            errors: ["\"../src/pub/a.js\" is not published."],
        },

        {
            filename: fixture("1/test.js"),
            code: "import a from '../a.js';",
            errors: ["\"../a.js\" is not published."],
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-unpublished/2/test.js",
            code: "import noDeps from 'no-deps';",
            errors: ["\"no-deps\" is not published."],
        },
        {
            filename: "tests/fixtures/no-unpublished/2/test.js",
            code: "import ignore1 from './ignore1';",
            errors: ["\"./ignore1\" is not published."],
        },

        // `convertPath` option.
        {
            filename: fixture("3/src/test.jsx"),
            code: "import a from '../test';",
            errors: ["\"../test\" is not published."],
            settings: {
                node: {
                    convertPath: {"src/**/*.jsx": ["src/(.+?)\\.jsx", "pub/$1.js"]},
                    tryExtensions: [".js", ".jsx", ".json"],
                },
            },
        },
        {
            filename: fixture("3/src/test.jsx"),
            code: "import a from '../test';",
            errors: ["\"../test\" is not published."],
            options: [{
                convertPath: {"src/**/*.jsx": ["src/(.+?)\\.jsx", "pub/$1.js"]},
                tryExtensions: [".js", ".jsx", ".json"],
            }],
        },
        {
            filename: fixture("3/src/test.jsx"),
            code: "import a from '../test';",
            errors: ["\"../test\" is not published."],
            settings: {
                node: {
                    convertPath: [
                        {
                            include: ["src/**/*.jsx"],
                            replace: ["src/(.+?)\\.jsx", "pub/$1.js"],
                        },
                    ],
                    tryExtensions: [".js", ".jsx", ".json"],
                },
            },
        },
        {
            filename: fixture("3/src/test.jsx"),
            code: "import a from '../test';",
            errors: ["\"../test\" is not published."],
            options: [{
                convertPath: [
                    {
                        include: ["src/**/*.jsx"],
                        replace: ["src/(.+?)\\.jsx", "pub/$1.js"],
                    },
                ],
                tryExtensions: [".js", ".jsx", ".json"],
            }],
        },
    ],
})
