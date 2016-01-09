/**
 * @fileoverview Tests for no-missing-require rule.
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
    return path.resolve(__dirname, "../../fixtures/no-missing-require", name);
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
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import eslint from 'eslint/lib/ast-utils';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a.js';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import aConfig from './a.config';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import aConfig from './a.config.js';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c.json';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import cConfig from './c.config';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import cConfig from './c.config.json';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import resolve from 'resolve';",
            options: [{"publish": "*.js"}],
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import mocha from 'mocha';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },

        // Ignores it if the filename is unknown.
        {
            code: "import abc from 'no-exist-package-0';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            code: "import b from './b';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        }
    ],
    invalid: [
        {
            filename: fixture("test.js"),
            code: "import abc from 'no-exist-package-0';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: [
                "\"no-exist-package-0\" is not found.",
                "\"no-exist-package-0\" is not published."
            ]
        },
        {
            filename: fixture("test.js"),
            code: "import test from '@mysticatea/test';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: [
                "\"@mysticatea/test\" is not found.",
                "\"@mysticatea/test\" is not published."
            ]
        },
        {
            filename: fixture("test.js"),
            code: "import abc from 'no-exist-package-0';",
            options: [{"publish": null}],
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"no-exist-package-0\" is not found."]
        },
        {
            filename: fixture("test.js"),
            code: "import b from './b';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"./b\" is not found."]
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a.json';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"./a.json\" is not found."]
        },
        {
            filename: fixture("test.js"),
            code: "import async from 'async';",
            env: {node: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"async\" is not published."]
        },
        {
            filename: fixture("test.js"),
            code: "import mocha from 'mocha';",
            options: [{"publish": "*.js"}],
            env: {node: true, es6: true},
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"mocha\" is not published."]
        }
    ]
});
