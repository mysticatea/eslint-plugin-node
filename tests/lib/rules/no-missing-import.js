/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-missing-import")

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-missing", name)
}

const ruleTester = new RuleTester({ parserOptions: { sourceType: "module" } })
ruleTester.run("no-missing-import", rule, {
    valid: [
        {
            code: "import eslint from 'eslint';",
            filename: fixture("test.js"),
        },
        {
            code: "import fs from 'fs';",
            filename: fixture("test.js"),
        },
        {
            code: "import eslint from 'eslint/lib/ast-utils';",
            filename: fixture("test.js"),
        },
        {
            code: "import a from './a'; a();",
            filename: fixture("test.js"),
        },
        {
            code: "import a from './a.js';",
            filename: fixture("test.js"),
        },
        {
            code: "import aConfig from './a.config';",
            filename: fixture("test.js"),
        },
        {
            code: "import aConfig from './a.config.js';",
            filename: fixture("test.js"),
        },
        {
            code: "import b from './b';",
            filename: fixture("test.js"),
        },
        {
            code: "import b from './b.json';",
            filename: fixture("test.js"),
        },
        {
            code: "import c from './c.coffee';",
            filename: fixture("test.js"),
        },
        {
            code: "import mocha from 'mocha';",
            filename: fixture("test.js"),
        },
        {
            code: "import mocha from 'mocha!foo?a=b&c=d';",
            filename: fixture("test.js"),
        },

        // tryExtensions
        {
            code: "import c from './c';",
            options: [{ tryExtensions: [".coffee"] }],
            filename: fixture("test.js"),
        },
        {
            code: "import c from './c';",
            filename: fixture("test.js"),
            settings: { node: { tryExtensions: [".coffee"] } },
        },

        // Ignores it if the filename is unknown.
        "import abc from 'no-exist-package-0';",
        "import b from './b';",

        // no source.
        {
            code: "export {foo, bar};",
            filename: fixture("test.js"),
        },

        // Should work fine if the filename is relative.
        {
            code: "import eslint from 'eslint'",
            filename: "tests/fixtures/no-missing/test.js",
        },
        {
            code: "import a from './a';",
            filename: "tests/fixtures/no-missing/test.js",
        },

        // Relative paths to a directory should work.
        {
            code: "import a from '.';",
            filename: fixture("test.js"),
        },
        {
            code: "import a from './';",
            filename: fixture("test.js"),
        },
        {
            code: "import a from './foo';",
            filename: fixture("test.js"),
        },
        {
            code: "import a from './foo/';",
            filename: fixture("test.js"),
        },

        // allow option.
        {
            code: "import electron from 'electron';",
            options: [{ allowModules: ["electron"] }],
            filename: fixture("test.js"),
        },

        // resolvePaths
        {
            code: "import a from 'fixtures/no-missing/a';",
            filename: fixture("test.js"),
            env: { node: true },
            settings: {
                node: { resolvePaths: [path.resolve(__dirname, "../../")] },
            },
        },
        {
            code: "import a from 'fixtures/no-missing/a';",
            options: [{ resolvePaths: [path.resolve(__dirname, "../../")] }],
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "import a from 'fixtures/no-missing/a';",
            options: [{ resolvePaths: ["tests"] }],
            filename: fixture("test.js"),
            env: { node: true },
        },
    ],
    invalid: [
        {
            code: "import abc from 'no-exist-package-0';",
            errors: ['"no-exist-package-0" is not found.'],
            filename: fixture("test.js"),
        },
        {
            code: "import test from '@mysticatea/test';",
            errors: ['"@mysticatea/test" is not found.'],
            filename: fixture("test.js"),
        },
        {
            code: "import c from './c';",
            errors: ['"./c" is not found.'],
            filename: fixture("test.js"),
        },
        {
            code: "import d from './d';",
            errors: ['"./d" is not found.'],
            filename: fixture("test.js"),
        },
        {
            code: "import a from './a.json';",
            errors: ['"./a.json" is not found.'],
            filename: fixture("test.js"),
        },

        // Should work fine if the filename is relative.
        {
            code: "import eslint from 'no-exist-package-0';",
            errors: ['"no-exist-package-0" is not found.'],
            filename: "tests/fixtures/no-missing/test.js",
        },
        {
            code: "import c from './c';",
            errors: ['"./c" is not found.'],
            filename: "tests/fixtures/no-missing/test.js",
        },

        // Relative paths to a directory should work.
        {
            code: "import a from './bar';",
            errors: ['"./bar" is not found.'],
            filename: fixture("test.js"),
        },
        {
            code: "import a from './bar/';",
            errors: ['"./bar/" is not found.'],
            filename: fixture("test.js"),
        },

        // Case sensitive
        {
            code: "import a from './A.js';",
            errors: ['"./A.js" is not found.'],
            filename: fixture("test.js"),
        },
    ],
})
