/**
 * @author Jamund Ferguson
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/global-require")

const ERROR = { messageId: "unexpected", type: "CallExpression" }

new RuleTester().run("global-require", rule, {
    valid: [
        "var x = require('y');",
        "if (x) { x.require('y'); }",
        "var x;\nx = require('y');",
        "var x = 1, y = require('y');",
        "var x = require('y'), y = require('y'), z = require('z');",
        "var x = require('y').foo;",
        "require('y').foo();",
        "require('y');",
        "function x(){}\n\n\nx();\n\n\nif (x > y) {\n\tdoSomething()\n\n}\n\nvar x = require('y').foo;",
        "var logger = require(DEBUG ? 'dev-logger' : 'logger');",
        "var logger = DEBUG ? require('dev-logger') : require('logger');",
        "function localScopedRequire(require) { require('y'); }",
        "var someFunc = require('./someFunc'); someFunc(function(require) { return('bananas'); });",
    ],
    invalid: [
        // block statements
        {
            code:
                "if (process.env.NODE_ENV === 'DEVELOPMENT') {\n\trequire('debug');\n}",
            errors: [ERROR],
        },
        {
            code: "var x; if (y) { x = require('debug'); }",
            errors: [ERROR],
        },
        {
            code: "var x; if (y) { x = require('debug').baz; }",
            errors: [ERROR],
        },
        {
            code: "function x() { require('y') }",
            errors: [ERROR],
        },
        {
            code: "try { require('x'); } catch (e) { console.log(e); }",
            errors: [ERROR],
        },

        // non-block statements
        {
            code: "var getModule = x => require(x);",
            parserOptions: { ecmaVersion: 6 },
            errors: [ERROR],
        },
        {
            code: "var x = (x => require(x))('weird')",
            parserOptions: { ecmaVersion: 6 },
            errors: [ERROR],
        },
        {
            code: "switch(x) { case '1': require('1'); break; }",
            errors: [ERROR],
        },
    ],
})
