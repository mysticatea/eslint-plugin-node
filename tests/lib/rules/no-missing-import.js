/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const { Linter, RuleTester } = require("eslint")
const rule = require("../../../lib/rules/no-missing-import")

const DynamicImportSupported = (() => {
    const config = { parserOptions: { ecmaVersion: 2020 } }
    const messages = new Linter().verify("import(s)", config)
    return messages.length === 0
})()

if (!DynamicImportSupported) {
    //eslint-disable-next-line no-console
    console.warn(
        "[%s] Skip tests for 'import()'",
        path.basename(__filename, ".js")
    )
}

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-missing", name)
}

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
})
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
            code: "import eslint from 'eslint/lib/api';",
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
            options: [{ tryExtensions: [".coffee"] }],
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c';",
            settings: { node: { tryExtensions: [".coffee"] } },
        },

        // Ignores it if the filename is unknown.
        "import abc from 'no-exist-package-0';",
        "import b from './b';",

        // no source.
        {
            filename: fixture("test.js"),
            code: "const foo=0, bar=1; export {foo, bar};",
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
            options: [{ allowModules: ["electron"] }],
        },

        // resolvePaths
        {
            filename: fixture("test.js"),
            code: "import a from 'fixtures/no-missing/a';",
            env: { node: true },
            settings: {
                node: { resolvePaths: [path.resolve(__dirname, "../../")] },
            },
        },
        {
            filename: fixture("test.js"),
            code: "import a from 'fixtures/no-missing/a';",
            options: [{ resolvePaths: [path.resolve(__dirname, "../../")] }],
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "import a from 'fixtures/no-missing/a';",
            options: [{ resolvePaths: ["tests"] }],
            env: { node: true },
        },

        // import()
        ...(DynamicImportSupported
            ? [
                  {
                      filename: fixture("test.js"),
                      code: "function f() { import(foo) }",
                      parserOptions: { ecmaVersion: 2020 },
                  },
              ]
            : []),
    ],
    invalid: [
        {
            filename: fixture("test.js"),
            code: "import abc from 'no-exist-package-0';",
            errors: ['"no-exist-package-0" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import test from '@mysticatea/test';",
            errors: ['"@mysticatea/test" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c';",
            errors: ['"./c" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import d from './d';",
            errors: ['"./d" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a.json';",
            errors: ['"./a.json" is not found.'],
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import eslint from 'no-exist-package-0';",
            errors: ['"no-exist-package-0" is not found.'],
        },
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import c from './c';",
            errors: ['"./c" is not found.'],
        },

        // Relative paths to a directory should work.
        {
            filename: fixture("test.js"),
            code: "import a from './bar';",
            errors: ['"./bar" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import a from './bar/';",
            errors: ['"./bar/" is not found.'],
        },

        // Case sensitive
        {
            filename: fixture("test.js"),
            code: "import a from './A.js';",
            errors: ['"./A.js" is not found.'],
        },

        // import()
        ...(DynamicImportSupported
            ? [
                  {
                      filename: fixture("test.js"),
                      code: "function f() { import('no-exist-package-0') }",
                      parserOptions: { ecmaVersion: 2020 },
                      errors: ['"no-exist-package-0" is not found.'],
                  },
              ]
            : []),
    ],
})
