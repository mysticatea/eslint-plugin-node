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


const ruleTester = new RuleTester()
ruleTester.run("no-missing-import", rule, {
    valid: [
        {
            filename: fixture("test.js"),
            code: "import eslint from 'eslint';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import fs from 'fs';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import eslint from 'eslint/lib/ast-utils';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a'; a();",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a.js';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import aConfig from './a.config';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import aConfig from './a.config.js';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import b from './b';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import b from './b.json';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c.coffee';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import mocha from 'mocha';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import mocha from 'mocha!foo?a=b&c=d';",
            parserOptions: {sourceType: "module"},
        },

        // tryExtensions
        {
            filename: fixture("test.js"),
            code: "import c from './c';",
            options: [{tryExtensions: [".coffee"]}],
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c';",
            settings: {node: {tryExtensions: [".coffee"]}},
            parserOptions: {sourceType: "module"},
        },

        // Ignores it if the filename is unknown.
        {
            code: "import abc from 'no-exist-package-0';",
            parserOptions: {sourceType: "module"},
        },
        {
            code: "import b from './b';",
            parserOptions: {sourceType: "module"},
        },

        // no source.
        {
            filename: fixture("test.js"),
            code: "export {foo, bar};",
            parserOptions: {sourceType: "module"},
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import eslint from 'eslint'",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import a from './a';",
            parserOptions: {sourceType: "module"},
        },

        // Relative paths to a directory should work.
        {
            filename: fixture("test.js"),
            code: "import a from '.';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import a from './';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import a from './foo';",
            parserOptions: {sourceType: "module"},
        },
        {
            filename: fixture("test.js"),
            code: "import a from './foo/';",
            parserOptions: {sourceType: "module"},
        },

        // allow option.
        {
            filename: fixture("test.js"),
            code: "import electron from 'electron';",
            options: [{allowModules: ["electron"]}],
            parserOptions: {sourceType: "module"},
        },
    ],
    invalid: [
        {
            filename: fixture("test.js"),
            code: "import abc from 'no-exist-package-0';",
            parserOptions: {sourceType: "module"},
            errors: ["\"no-exist-package-0\" is not found."],
        },
        {
            filename: fixture("test.js"),
            code: "import test from '@mysticatea/test';",
            parserOptions: {sourceType: "module"},
            errors: ["\"@mysticatea/test\" is not found."],
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c';",
            parserOptions: {sourceType: "module"},
            errors: ["\"./c\" is not found."],
        },
        {
            filename: fixture("test.js"),
            code: "import d from './d';",
            parserOptions: {sourceType: "module"},
            errors: ["\"./d\" is not found."],
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a.json';",
            parserOptions: {sourceType: "module"},
            errors: ["\"./a.json\" is not found."],
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import eslint from 'no-exist-package-0';",
            parserOptions: {sourceType: "module"},
            errors: ["\"no-exist-package-0\" is not found."],
        },
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import c from './c';",
            parserOptions: {sourceType: "module"},
            errors: ["\"./c\" is not found."],
        },

        // Relative paths to a directory should work.
        {
            filename: fixture("test.js"),
            code: "import a from './bar';",
            parserOptions: {sourceType: "module"},
            errors: ["\"./bar\" is not found."],
        },
        {
            filename: fixture("test.js"),
            code: "import a from './bar/';",
            parserOptions: {sourceType: "module"},
            errors: ["\"./bar/\" is not found."],
        },
    ],
})
