/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

/*eslint-env mocha*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("assert");
var eslint = require("eslint").linter;
var rule = require("../../../lib/rules/process-exit-as-throw");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("process-exit-as-throw", function() {
    beforeEach(function() {
        eslint.reset();
        eslint.defineRule("process-exit-as-throw", rule);
    });

    it("should get unreachable error after 'process.exit()'.", function() {
        var code = [
            "foo();",
            "process.exit(1);",
            "bar();"
        ].join("\n");

        var options = {
            rules: {
                "no-unreachable": "error",
                "process-exit-as-throw": "error"
            }
        };

        var messages = eslint.verify(code, options);

        assert.equal(messages.length, 1);
        assert.equal(messages[0].message, "Unreachable code.");
        assert.equal(messages[0].line, 3);
    });

    it("should get no unreachable error after 'process.exit()' if this rule is turned off.", function() {
        var code = [
            "foo();",
            "process.exit(1);",
            "bar();"
        ].join("\n");

        var options = {
            rules: {
                "no-unreachable": "error",
                "process-exit-as-throw": "off"
            }
        };

        var messages = eslint.verify(code, options);

        assert.equal(messages.length, 0);
    });

    it("should get no consistent-return error after 'process.exit()'.", function() {
        var code = [
            "function foo() {",
            "    if (a) {",
            "        return 1;",
            "    } else {",
            "        process.exit(1);",
            "    }",
            "}"
        ].join("\n");

        var options = {
            rules: {
                "consistent-return": "error",
                "process-exit-as-throw": "error"
            }
        };

        var messages = eslint.verify(code, options);

        assert.equal(messages.length, 0);
    });
});
