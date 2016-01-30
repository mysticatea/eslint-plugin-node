/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path");
var RuleTester = require("eslint").RuleTester;
var rule = require("../../../lib/rules/no-missing-require");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-missing", name);
}

//------------------------------------------------------------------------------
// Test
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-missing-require", rule, {
    valid: [
        {
            filename: fixture("test.js"),
            code: "require('fs');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require('eslint');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require('eslint/lib/ast-utils');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require('./a');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require('./a.js');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require('./a.config');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require('./a.config.js');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require('./b');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require('./b.json');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require('./c.coffee');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require('mocha');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require(`eslint`);",
            env: {node: true, es6: true}
        },

        // tryExtensions
        {
            filename: fixture("test.js"),
            code: "require('./c');",
            env: {node: true},
            options: [{tryExtensions: [".coffee"]}]
        },
        {
            filename: fixture("test.js"),
            code: "require('./c');",
            env: {node: true},
            settings: {node: {tryExtensions: [".coffee"]}}
        },

        // Ignores it if not callee.
        {
            filename: fixture("test.js"),
            code: "require;",
            env: {node: true}
        },

        // Ignores it if the global variable of `require` is not defined.
        {
            filename: fixture("test.js"),
            code: "require('no-exist-package-0');"
        },

        // Ignores it if the filename is unknown.
        {
            code: "require('no-exist-package-0');",
            env: {node: true}
        },
        {
            code: "require('./b');",
            env: {node: true}
        },

        // Ignores it if the target is not string.
        {
            filename: fixture("test.js"),
            code: "require();",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require(foo);",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require(777);",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require(`foo${bar}`);",
            env: {node: true, es6: true}
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "require('eslint');",
            env: {node: true}
        },
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "require('./a');",
            env: {node: true}
        },

        // Relative paths to a directory should work.
        {
            filename: fixture("test.js"),
            code: "require('.');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require('./');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require('./foo');",
            env: {node: true}
        },
        {
            filename: fixture("test.js"),
            code: "require('./foo/');",
            env: {node: true}
        }
    ],
    invalid: [
        {
            filename: fixture("test.js"),
            code: "require('no-exist-package-0');",
            env: {node: true},
            errors: ["\"no-exist-package-0\" is not found."]
        },
        {
            filename: fixture("test.js"),
            code: "require('@mysticatea/test');",
            env: {node: true},
            errors: ["\"@mysticatea/test\" is not found."]
        },
        {
            filename: fixture("test.js"),
            code: "require('./c');",
            env: {node: true},
            errors: ["\"./c\" is not found."]
        },
        {
            filename: fixture("test.js"),
            code: "require('./d');",
            env: {node: true},
            errors: ["\"./d\" is not found."]
        },
        {
            filename: fixture("test.js"),
            code: "require('./a.json');",
            env: {node: true},
            errors: ["\"./a.json\" is not found."]
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "require('no-exist-package-0');",
            env: {node: true},
            errors: ["\"no-exist-package-0\" is not found."]
        },
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "require('./c');",
            env: {node: true},
            errors: ["\"./c\" is not found."]
        },

        // Relative paths to a directory should work.
        {
            filename: fixture("test.js"),
            code: "require('./bar');",
            env: {node: true},
            errors: ["\"./bar\" is not found."]
        },
        {
            filename: fixture("test.js"),
            code: "require('./bar/');",
            env: {node: true},
            errors: ["\"./bar/\" is not found."]
        }
    ]
});
