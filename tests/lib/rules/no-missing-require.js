/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-missing-require")

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-missing", name)
}

const ruleTester = new RuleTester()
ruleTester.run("no-missing-require", rule, {
    valid: [
        {
            filename: fixture("test.js"),
            code: "require('fs');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('eslint');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('eslint/lib/api');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('./a');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('./a.js');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('./a.config');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('./a.config.js');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('./b');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('./b.json');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('./c.coffee');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('mocha');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require(`eslint`);",
            env: { node: true, es6: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('mocha!foo?a=b&c=d');",
            env: { node: true },
        },

        // tryExtensions
        {
            filename: fixture("test.js"),
            code: "require('./c');",
            options: [{ tryExtensions: [".coffee"] }],
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('./c');",
            env: { node: true },
            settings: { node: { tryExtensions: [".coffee"] } },
        },

        // resolvePaths
        {
            filename: fixture("test.js"),
            code: "require('fixtures/no-missing/a');",
            env: { node: true },
            settings: {
                node: { resolvePaths: [path.resolve(__dirname, "../../")] },
            },
        },
        {
            filename: fixture("test.js"),
            code: "require('fixtures/no-missing/a');",
            options: [{ resolvePaths: [path.resolve(__dirname, "../../")] }],
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('fixtures/no-missing/a');",
            options: [{ resolvePaths: ["tests"] }],
            env: { node: true },
        },

        // Ignores it if not callee.
        {
            filename: fixture("test.js"),
            code: "require;",
            env: { node: true },
        },

        // Ignores it if the global variable of `require` is not defined.
        {
            filename: fixture("test.js"),
            code: "require('no-exist-package-0');",
        },

        // Ignores it if the filename is unknown.
        {
            code: "require('no-exist-package-0');",
            env: { node: true },
        },
        {
            code: "require('./b');",
            env: { node: true },
        },

        // Ignores it if the target is not string.
        {
            filename: fixture("test.js"),
            code: "require();",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require(foo);",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require(`foo${bar}`);", //eslint-disable-line no-template-curly-in-string
            env: { node: true, es6: true },
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "require('eslint');",
            env: { node: true },
        },
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "require('./a');",
            env: { node: true },
        },

        // Relative paths to a directory should work.
        {
            filename: fixture("test.js"),
            code: "require('.');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('./');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('./foo');",
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('./foo/');",
            env: { node: true },
        },

        // allow option
        {
            filename: fixture("test.js"),
            code: "require('electron');",
            options: [{ allowModules: ["electron"] }],
            env: { node: true },
        },
        {
            filename: fixture("test.js"),
            code: "require('jquery.cookie');",
            options: [{ allowModules: ["jquery.cookie"] }],
            env: { node: true },
        },

        // require.resolve
        {
            filename: fixture("test.js"),
            code: "require.resolve('eslint');",
            env: { node: true },
        },
    ],
    invalid: [
        {
            filename: fixture("test.js"),
            code: "require('no-exist-package-0');",
            env: { node: true },
            errors: ['"no-exist-package-0" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "require('@mysticatea/test');",
            env: { node: true },
            errors: ['"@mysticatea/test" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "require('./c');",
            env: { node: true },
            errors: ['"./c" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "require('./d');",
            env: { node: true },
            errors: ['"./d" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "require('./a.json');",
            env: { node: true },
            errors: ['"./a.json" is not found.'],
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "require('no-exist-package-0');",
            env: { node: true },
            errors: ['"no-exist-package-0" is not found.'],
        },
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "require('./c');",
            env: { node: true },
            errors: ['"./c" is not found.'],
        },

        // Relative paths to a directory should work.
        {
            filename: fixture("test.js"),
            code: "require('./bar');",
            env: { node: true },
            errors: ['"./bar" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "require('./bar/');",
            env: { node: true },
            errors: ['"./bar/" is not found.'],
        },

        // Case sensitive
        {
            filename: fixture("test.js"),
            code: "require('./A');",
            env: { node: true },
            errors: ['"./A" is not found.'],
        },

        // require.resolve
        {
            filename: fixture("test.js"),
            code: "require.resolve('no-exist-package-0');",
            env: { node: true },
            errors: ['"no-exist-package-0" is not found.'],
        },
    ],
})

describe("On specific working directory:", () => {
    const filename = fixture("test.js")
    let originalDir = null

    before(() => {
        originalDir = process.cwd()
        process.chdir(path.dirname(filename))
    })
    after(() => {
        process.chdir(originalDir)
    })

    ruleTester.run("no-missing-require", rule, {
        valid: [
            {
                filename: fixture("test.js"),
                code: "require('../../lib/rules/no-missing-require');",
                env: { node: true },
            },
        ],
        invalid: [],
    })
})
