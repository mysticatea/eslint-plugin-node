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
            filename: fixture("1/test.js"),
            code: "require('fs');",
            env: { node: true },
        },
        {
            filename: fixture("1/test.js"),
            code: "require('aaa');",
            env: { node: true },
        },
        {
            filename: fixture("1/test.js"),
            code: "require('aaa/a/b/c');",
            env: { node: true },
        },
        {
            filename: fixture("1/test.js"),
            code: "require('./a');",
            env: { node: true },
        },
        {
            filename: fixture("1/test.js"),
            code: "require('./a.js');",
            env: { node: true },
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "require('./test');",
            env: { node: true },
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "require('bbb');",
            env: { node: true },
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "require('bbb/a/b/c');",
            env: { node: true },
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "require('./ignore2');",
            env: { node: true },
        },
        {
            filename: fixture("3/test.js"),
            code: "require('./pub/a');",
            env: { node: true },
        },
        {
            filename: fixture("3/test.js"),
            code: "require('./test2');",
            env: { node: true },
        },
        {
            filename: fixture("3/test.js"),
            code: "require('aaa');",
            env: { node: true },
        },
        {
            filename: fixture("3/test.js"),
            code: "require('bbb');",
            env: { node: true },
        },
        {
            filename: fixture("3/pub/ignore1.js"),
            code: "require('bbb');",
            env: { node: true },
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "require('../package.json');",
            env: { node: true },
        },
        {
            filename: fixture("3/src/pub/test.js"),
            code: "require('bbb');",
            env: { node: true },
        },
        {
            filename: fixture("3/src/pub/test.js"),
            code: "require('bbb!foo?a=b&c=d');",
            env: { node: true },
        },

        // `convertPath` option.
        {
            filename: fixture("3/src/test.jsx"),
            code: "require('./a');",
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
            filename: fixture("3/src/test.jsx"),
            code: "require('./a');",
            options: [
                {
                    convertPath: {
                        "src/**/*.jsx": ["src/(.+?)\\.jsx", "pub/$1.js"],
                    },
                    tryExtensions: [".js", ".jsx", ".json"],
                },
            ],
            env: { node: true },
        },
        {
            filename: fixture("3/src/test.jsx"),
            code: "require('../test');",
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
            filename: fixture("3/src/test.jsx"),
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
            env: { node: true },
        },

        // Ignores it if not callee.
        {
            filename: fixture("1/test.js"),
            code: "require;",
            env: { node: true },
        },

        // Ignores it if the global variable of `require` is not defined.
        {
            filename: fixture("1/test.js"),
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
            filename: fixture("1/test.js"),
            code: "require();",
            env: { node: true },
        },
        {
            filename: fixture("1/test.js"),
            code: "require(foo);",
            env: { node: true },
        },
        {
            filename: fixture("1/test.js"),
            code: "require(777);",
            env: { node: true },
        },
        {
            filename: fixture("1/test.js"),
            code: "require(`foo${bar}`);", //eslint-disable-line no-template-curly-in-string
            env: { node: true, es6: true },
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-unpublished/2/test.js",
            code: "require('aaa');",
            env: { node: true },
        },
        {
            filename: "tests/fixtures/no-unpublished/2/test.js",
            code: "require('./a');",
            env: { node: true },
        },

        // allowModules option
        {
            filename: fixture("1/test.js"),
            code: "require('electron');",
            options: [{ allowModules: ["electron"] }],
            env: { node: true },
        },

        // Auto-published files only apply to root package directory
        {
            filename: fixture("3/src/readme.js"),
            code: "require('bbb');",
            env: { node: true },
        },

        // Negative patterns in files field.
        {
            filename: fixture("negative-in-files/lib/__test__/index.js"),
            code: "require('bbb');",
            env: { node: true },
        },
        {
            filename: fixture("issue126/lib/test.js"),
            code: "require('bbb');",
            env: { node: true },
        },
    ],
    invalid: [
        {
            filename: fixture("2/test.js"),
            code: "require('./ignore1.js');",
            env: { node: true },
            errors: ['"./ignore1.js" is not published.'],
        },
        {
            filename: fixture("2/test.js"),
            code: "require('./ignore1');",
            env: { node: true },
            errors: ['"./ignore1" is not published.'],
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "require('bbb');",
            env: { node: true },
            errors: ['"bbb" is not published.'],
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "require('./ignore1');",
            env: { node: true },
            errors: ['"./ignore1" is not published.'],
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "require('./abc');",
            env: { node: true },
            errors: ['"./abc" is not published.'],
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "require('../test');",
            env: { node: true },
            errors: ['"../test" is not published.'],
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "require('../src/pub/a.js');",
            env: { node: true },
            errors: ['"../src/pub/a.js" is not published.'],
        },

        {
            filename: fixture("1/test.js"),
            code: "require('../a.js');",
            env: { node: true },
            errors: ['"../a.js" is not published.'],
        },

        // `convertPath` option.
        {
            filename: fixture("3/src/test.jsx"),
            code: "require('../test');",
            env: { node: true },
            errors: ['"../test" is not published.'],
            settings: {
                node: {
                    convertPath: {
                        "src/**/*.jsx": ["src/(.+?)\\.jsx", "pub/$1.js"],
                    },
                },
            },
        },
        {
            filename: fixture("3/src/test.jsx"),
            code: "require('../test');",
            options: [
                {
                    convertPath: {
                        "src/**/*.jsx": ["src/(.+?)\\.jsx", "pub/$1.js"],
                    },
                },
            ],
            env: { node: true },
            errors: ['"../test" is not published.'],
        },
        {
            filename: fixture("3/src/test.jsx"),
            code: "require('../test');",
            env: { node: true },
            errors: ['"../test" is not published.'],
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
            filename: fixture("3/src/test.jsx"),
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
            env: { node: true },
            errors: ['"../test" is not published.'],
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-unpublished/2/test.js",
            code: "require('./ignore1');",
            env: { node: true },
            errors: ['"./ignore1" is not published.'],
        },

        // outside of the package.
        {
            filename: fixture("1/test.js"),
            code: "require('../2/a.js');",
            env: { node: true },
            errors: ['"../2/a.js" is not published.'],
        },
    ],
})
