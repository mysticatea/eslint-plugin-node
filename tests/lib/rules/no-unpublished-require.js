/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-unpublished-require")

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-unpublished", name)
}

const ruleTester = new RuleTester()
ruleTester.run("no-unpublished-require", rule, {
    valid: [
        {
            code: "require('fs');",
            filename: fixture("1/test.js"),
            env: { node: true },
        },
        {
            code: "require('aaa');",
            filename: fixture("1/test.js"),
            env: { node: true },
        },
        {
            code: "require('aaa/a/b/c');",
            filename: fixture("1/test.js"),
            env: { node: true },
        },
        {
            code: "require('./a');",
            filename: fixture("1/test.js"),
            env: { node: true },
        },
        {
            code: "require('./a.js');",
            filename: fixture("1/test.js"),
            env: { node: true },
        },
        {
            code: "require('./test');",
            filename: fixture("2/ignore1.js"),
            env: { node: true },
        },
        {
            code: "require('bbb');",
            filename: fixture("2/ignore1.js"),
            env: { node: true },
        },
        {
            code: "require('bbb/a/b/c');",
            filename: fixture("2/ignore1.js"),
            env: { node: true },
        },
        {
            code: "require('./ignore2');",
            filename: fixture("2/ignore1.js"),
            env: { node: true },
        },
        {
            code: "require('./pub/a');",
            filename: fixture("3/test.js"),
            env: { node: true },
        },
        {
            code: "require('./test2');",
            filename: fixture("3/test.js"),
            env: { node: true },
        },
        {
            code: "require('aaa');",
            filename: fixture("3/test.js"),
            env: { node: true },
        },
        {
            code: "require('bbb');",
            filename: fixture("3/test.js"),
            env: { node: true },
        },
        {
            code: "require('bbb');",
            filename: fixture("3/pub/ignore1.js"),
            env: { node: true },
        },
        {
            code: "require('../package.json');",
            filename: fixture("3/pub/test.js"),
            env: { node: true },
        },
        {
            code: "require('bbb');",
            filename: fixture("3/src/pub/test.js"),
            env: { node: true },
        },
        {
            code: "require('bbb!foo?a=b&c=d');",
            filename: fixture("3/src/pub/test.js"),
            env: { node: true },
        },

        // `convertPath` option.
        {
            code: "require('./a');",
            filename: fixture("3/src/test.jsx"),
            env: { node: true },
            settings: {
                node: {
                    convertPath: {
                        "src/**/*.jsx": ["src/(.+?)\\.jsx", "pub/$1.js"],
                    },
                    tryExtensions: [".js", ".jsx", ".json"],
                },
            },
        },
        {
            code: "require('./a');",
            options: [
                {
                    convertPath: {
                        "src/**/*.jsx": ["src/(.+?)\\.jsx", "pub/$1.js"],
                    },
                    tryExtensions: [".js", ".jsx", ".json"],
                },
            ],
            filename: fixture("3/src/test.jsx"),
            env: { node: true },
        },
        {
            code: "require('../test');",
            filename: fixture("3/src/test.jsx"),
            env: { node: true },
            settings: {
                node: {
                    convertPath: [
                        {
                            include: ["src/**/*.jsx"],
                            exclude: ["**/test.jsx"],
                            replace: ["src/(.+?)\\.jsx", "pub/$1.js"],
                        },
                    ],
                },
            },
        },
        {
            code: "require('../test');",
            options: [
                {
                    convertPath: [
                        {
                            include: ["src/**/*.jsx"],
                            exclude: ["**/test.jsx"],
                            replace: ["src/(.+?)\\.jsx", "pub/$1.js"],
                        },
                    ],
                },
            ],
            filename: fixture("3/src/test.jsx"),
            env: { node: true },
        },

        // Ignores it if not callee.
        {
            code: "require;",
            filename: fixture("1/test.js"),
            env: { node: true },
        },

        // Ignores it if the global variable of `require` is not defined.
        {
            code: "require('no-exist-package-0');",
            filename: fixture("1/test.js"),
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
            filename: fixture("1/test.js"),
            env: { node: true },
        },
        {
            code: "require(foo);",
            filename: fixture("1/test.js"),
            env: { node: true },
        },
        {
            code: "require(777);",
            filename: fixture("1/test.js"),
            env: { node: true },
        },
        {
            code: "require(`foo${bar}`);", //eslint-disable-line no-template-curly-in-string
            filename: fixture("1/test.js"),
            env: { node: true, es6: true },
        },

        // Should work fine if the filename is relative.
        {
            code: "require('aaa');",
            filename: "tests/fixtures/no-unpublished/2/test.js",
            env: { node: true },
        },
        {
            code: "require('./a');",
            filename: "tests/fixtures/no-unpublished/2/test.js",
            env: { node: true },
        },

        // allowModules option
        {
            code: "require('electron');",
            options: [{ allowModules: ["electron"] }],
            filename: fixture("1/test.js"),
            env: { node: true },
        },

        // Auto-published files only apply to root package directory
        {
            code: "require('bbb');",
            filename: fixture("3/src/readme.js"),
            env: { node: true },
        },

        // Negative patterns in files field.
        {
            code: "require('bbb');",
            filename: fixture("negative-in-files/lib/__test__/index.js"),
            env: { node: true },
        },

        // negative patterns in .npmignore
        {
            filename: fixture("negative-in-npmignore/tests/test.js"),
            code: "require('./ignore1.js');",
            env: {node: true},
        },

    ],
    invalid: [
        {
            code: "require('./ignore1.js');",
            errors: ['"./ignore1.js" is not published.'],
            filename: fixture("2/test.js"),
            env: { node: true },
        },
        {
            code: "require('./ignore1');",
            errors: ['"./ignore1" is not published.'],
            filename: fixture("2/test.js"),
            env: { node: true },
        },
        {
            code: "require('bbb');",
            errors: ['"bbb" is not published.'],
            filename: fixture("3/pub/test.js"),
            env: { node: true },
        },
        {
            code: "require('./ignore1');",
            errors: ['"./ignore1" is not published.'],
            filename: fixture("3/pub/test.js"),
            env: { node: true },
        },
        {
            code: "require('./abc');",
            errors: ['"./abc" is not published.'],
            filename: fixture("3/pub/test.js"),
            env: { node: true },
        },
        {
            code: "require('../test');",
            errors: ['"../test" is not published.'],
            filename: fixture("3/pub/test.js"),
            env: { node: true },
        },
        {
            code: "require('../src/pub/a.js');",
            errors: ['"../src/pub/a.js" is not published.'],
            filename: fixture("3/pub/test.js"),
            env: { node: true },
        },

        {
            code: "require('../a.js');",
            errors: ['"../a.js" is not published.'],
            filename: fixture("1/test.js"),
            env: { node: true },
        },

        // `convertPath` option.
        {
            code: "require('../test');",
            errors: ['"../test" is not published.'],
            filename: fixture("3/src/test.jsx"),
            env: { node: true },
            settings: {
                node: {
                    convertPath: {
                        "src/**/*.jsx": ["src/(.+?)\\.jsx", "pub/$1.js"],
                    },
                },
            },
        },
        {
            code: "require('../test');",
            options: [
                {
                    convertPath: {
                        "src/**/*.jsx": ["src/(.+?)\\.jsx", "pub/$1.js"],
                    },
                },
            ],
            errors: ['"../test" is not published.'],
            filename: fixture("3/src/test.jsx"),
            env: { node: true },
        },
        {
            code: "require('../test');",
            errors: ['"../test" is not published.'],
            filename: fixture("3/src/test.jsx"),
            env: { node: true },
            settings: {
                node: {
                    convertPath: [
                        {
                            include: ["src/**/*.jsx"],
                            replace: ["src/(.+?)\\.jsx", "pub/$1.js"],
                        },
                    ],
                },
            },
        },
        {
            code: "require('../test');",
            options: [
                {
                    convertPath: [
                        {
                            include: ["src/**/*.jsx"],
                            replace: ["src/(.+?)\\.jsx", "pub/$1.js"],
                        },
                    ],
                },
            ],
            errors: ['"../test" is not published.'],
            filename: fixture("3/src/test.jsx"),
            env: { node: true },
        },

        // Should work fine if the filename is relative.
        {
            code: "require('./ignore1');",
            errors: ['"./ignore1" is not published.'],
            filename: "tests/fixtures/no-unpublished/2/test.js",
            env: { node: true },
        },

        // outside of the package.
        {
            code: "require('../2/a.js');",
            errors: ['"../2/a.js" is not published.'],
            filename: fixture("1/test.js"),
            env: { node: true },
        },
    ],
})
