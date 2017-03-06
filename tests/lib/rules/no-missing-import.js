/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path")
const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-missing-import")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-missing", name)
}

//------------------------------------------------------------------------------
// Test
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions: {sourceType: "module"}})
ruleTester.run("no-missing-import", rule, {
    valid: [
        {
            filename: fixture("test.js"),
            code: "import eslint from 'eslint';",
        },
        {
            filename: fixture("test.js"),
            code: "import fs from 'fs';",
        },
        {
            filename: fixture("test.js"),
            code: "import eslint from 'eslint/lib/ast-utils';",
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a'; a();",
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a.js';",
        },
        {
            filename: fixture("test.js"),
            code: "import aConfig from './a.config';",
        },
        {
            filename: fixture("test.js"),
            code: "import aConfig from './a.config.js';",
        },
        {
            filename: fixture("test.js"),
            code: "import b from './b';",
        },
        {
            filename: fixture("test.js"),
            code: "import b from './b.json';",
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c.coffee';",
        },
        {
            filename: fixture("test.js"),
            code: "import mocha from 'mocha';",
        },
        {
            filename: fixture("test.js"),
            code: "import mocha from 'mocha!foo?a=b&c=d';",
        },

        // tryExtensions
        {
            filename: fixture("test.js"),
            code: "import c from './c';",
            options: [{tryExtensions: [".coffee"]}],
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c';",
            settings: {node: {tryExtensions: [".coffee"]}},
        },

        // Ignores it if the filename is unknown.
        "import abc from 'no-exist-package-0';",
        "import b from './b';",

        // no source.
        {
            filename: fixture("test.js"),
            code: "export {foo, bar};",
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import eslint from 'eslint'",
        },
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import a from './a';",
        },

        // Relative paths to a directory should work.
        {
            filename: fixture("test.js"),
            code: "import a from '.';",
        },
        {
            filename: fixture("test.js"),
            code: "import a from './';",
        },
        {
            filename: fixture("test.js"),
            code: "import a from './foo';",
        },
        {
            filename: fixture("test.js"),
            code: "import a from './foo/';",
        },

        // allow option.
        {
            filename: fixture("test.js"),
            code: "import electron from 'electron';",
            options: [{allowModules: ["electron"]}],
        },
    ],
    invalid: [
        {
            filename: fixture("test.js"),
            code: "import abc from 'no-exist-package-0';",
            errors: ["\"no-exist-package-0\" is not found."],
        },
        {
            filename: fixture("test.js"),
            code: "import test from '@mysticatea/test';",
            errors: ["\"@mysticatea/test\" is not found."],
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c';",
            errors: ["\"./c\" is not found."],
        },
        {
            filename: fixture("test.js"),
            code: "import d from './d';",
            errors: ["\"./d\" is not found."],
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a.json';",
            errors: ["\"./a.json\" is not found."],
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import eslint from 'no-exist-package-0';",
            errors: ["\"no-exist-package-0\" is not found."],
        },
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import c from './c';",
            errors: ["\"./c\" is not found."],
        },

        // Relative paths to a directory should work.
        {
            filename: fixture("test.js"),
            code: "import a from './bar';",
            errors: ["\"./bar\" is not found."],
        },
        {
            filename: fixture("test.js"),
            code: "import a from './bar/';",
            errors: ["\"./bar/\" is not found."],
        },

        // Case sensitive
        {
            filename: fixture("test.js"),
            code: "import a from './A.js';",
            errors: ["\"./A.js\" is not found."],
        },
    ],
})
