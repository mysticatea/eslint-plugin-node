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
var rule = require("../../../lib/rules/no-missing-import");

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
            code: "import fs from 'fs';",
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
            code: "import a from './a'; a();",
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
            code: "import b from './b';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import b from './b.json';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c.coffee';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import mocha from 'mocha';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },

        // tryExtensions
        {
            filename: fixture("test.js"),
            code: "import c from './c';",
            options: [{tryExtensions: [".coffee"]}],
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c';",
            settings: {node: {tryExtensions: [".coffee"]}},
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
        },

        // no source.
        {
            filename: fixture("test.js"),
            code: "export {foo, bar};",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import eslint from 'eslint'",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"}
        },
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import a from './a';",
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
            code: "import c from './c';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"./c\" is not found."]
        },
        {
            filename: fixture("test.js"),
            code: "import d from './d';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"./d\" is not found."]
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a.json';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"./a.json\" is not found."]
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import eslint from 'no-exist-package-0';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"no-exist-package-0\" is not found."]
        },
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import c from './c';",
            ecmaFeatures: {modules: true},
            parserOptions: {sourceType: "module"},
            errors: ["\"./c\" is not found."]
        }
    ]
});
