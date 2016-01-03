/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path"),
    RuleTester = require("eslint").RuleTester,
    rule = require("../../../lib/rules/no-missing-import");

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
ruleTester.run("no-missing-import", rule, {
    valid: [
        {
            filename: fixture("test.js"),
            code: "import eslint from 'eslint';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import eslint from 'eslint/lib/ast-utils';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a.js';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import aConfig from './a.config';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import aConfig from './a.config.js';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import resolve from 'resolve';",
            options: [{"publish": "*.js"}],
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import mocha from 'mocha';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },

        // Ignores it if the filename is unknown.
        {
            code: "import abc from 'no-exist-package-0';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            code: "import b from './b';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        }
    ],
    invalid: [
        {
            filename: fixture("test.js"),
            code: "import abc from 'no-exist-package-0';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"no-exist-package-0\" is not found."]
        },
        {
            filename: fixture("test.js"),
            code: "import test from '@mysticatea/test';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"@mysticatea/test\" is not found."]
        },
        {
            filename: fixture("test.js"),
            code: "import b from './b';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"./b\" is not found."]
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a.json';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"./a.json\" is not found."]
        }
    ]
});
