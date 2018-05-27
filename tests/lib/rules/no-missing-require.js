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
            code: "require('fs');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('eslint');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('eslint/lib/ast-utils');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./a');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./a.js');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./a.config');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./a.config.js');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./b');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./b.json');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./c.coffee');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('mocha');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require(`eslint`);",
            filename: fixture("test.js"),
            env: { node: true, es6: true },
        },
        {
            code: "require('mocha!foo?a=b&c=d');",
            filename: fixture("test.js"),
            env: { node: true },
        },

        // tryExtensions
        {
            code: "require('./c');",
            options: [{ tryExtensions: [".coffee"] }],
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./c');",
            filename: fixture("test.js"),
            env: { node: true },
            settings: { node: { tryExtensions: [".coffee"] } },
        },

        // resolvePaths
        {
            code: "require('fixtures/no-missing/a');",
            filename: fixture("test.js"),
            env: { node: true },
            settings: {
                node: { resolvePaths: [path.resolve(__dirname, "../../")] },
            },
        },
        {
            code: "require('fixtures/no-missing/a');",
            options: [{ resolvePaths: [path.resolve(__dirname, "../../")] }],
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('fixtures/no-missing/a');",
            options: [{ resolvePaths: ["tests"] }],
            filename: fixture("test.js"),
            env: { node: true },
        },

        // Ignores it if not callee.
        {
            code: "require;",
            filename: fixture("test.js"),
            env: { node: true },
        },

        // Ignores it if the global variable of `require` is not defined.
        {
            code: "require('no-exist-package-0');",
            filename: fixture("test.js"),
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
            code: "require();",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require(foo);",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require(`foo${bar}`);", //eslint-disable-line no-template-curly-in-string
            filename: fixture("test.js"),
            env: { node: true, es6: true },
        },

        // Should work fine if the filename is relative.
        {
            code: "require('eslint');",
            filename: "tests/fixtures/no-missing/test.js",
            env: { node: true },
        },
        {
            code: "require('./a');",
            filename: "tests/fixtures/no-missing/test.js",
            env: { node: true },
        },

        // Relative paths to a directory should work.
        {
            code: "require('.');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./foo');",
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./foo/');",
            filename: fixture("test.js"),
            env: { node: true },
        },

        // allow option
        {
            code: "require('electron');",
            options: [{ allowModules: ["electron"] }],
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('jquery.cookie');",
            options: [{ allowModules: ["jquery.cookie"] }],
            filename: fixture("test.js"),
            env: { node: true },
        },
    ],
    invalid: [
        {
            code: "require('no-exist-package-0');",
            errors: ['"no-exist-package-0" is not found.'],
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('@mysticatea/test');",
            errors: ['"@mysticatea/test" is not found.'],
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./c');",
            errors: ['"./c" is not found.'],
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./d');",
            errors: ['"./d" is not found.'],
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./a.json');",
            errors: ['"./a.json" is not found.'],
            filename: fixture("test.js"),
            env: { node: true },
        },

        // Should work fine if the filename is relative.
        {
            code: "require('no-exist-package-0');",
            errors: ['"no-exist-package-0" is not found.'],
            filename: "tests/fixtures/no-missing/test.js",
            env: { node: true },
        },
        {
            code: "require('./c');",
            errors: ['"./c" is not found.'],
            filename: "tests/fixtures/no-missing/test.js",
            env: { node: true },
        },

        // Relative paths to a directory should work.
        {
            code: "require('./bar');",
            errors: ['"./bar" is not found.'],
            filename: fixture("test.js"),
            env: { node: true },
        },
        {
            code: "require('./bar/');",
            errors: ['"./bar/" is not found.'],
            filename: fixture("test.js"),
            env: { node: true },
        },

        // Case sensitive
        {
            code: "require('./A');",
            errors: ['"./A" is not found.'],
            filename: fixture("test.js"),
            env: { node: true },
        },
    ],
})

/*eslint-env mocha */
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
