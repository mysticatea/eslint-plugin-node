/**
 * @fileoverview Tests for no-sloppy-block-bindings rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-sloppy-block-bindings"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-sloppy-block-bindings", rule, {
    valid: [
        {code: "var a;"},
        {code: "function foo(a) { function foo() {} }"},
        {code: "'use strict'; let a;", env: {es6: true}},
        {code: "'use strict'; const a = 0;", env: {es6: true}},
        {code: "'use strict'; class A {}", env: {es6: true}},
        {code: "'use strict'; if (0) { function foo() {} }", env: {es6: true}},
        {code: "'use strict'; function foo() { let a; }", env: {es6: true}},
        {code: "'use strict'; function foo() { const a = 0; }", env: {es6: true}},
        {code: "'use strict'; function foo() { class A {} }", env: {es6: true}},
        {code: "'use strict'; function foo() { if (0) { function foo() {} } }", env: {es6: true}},
        {code: "function foo() { 'use strict'; let a; }", env: {es6: true}},
        {code: "function foo() { 'use strict'; const a = 0; }", env: {es6: true}},
        {code: "function foo() { 'use strict'; class A {} }", env: {es6: true}},
        {code: "function foo() { 'use strict'; if (0) { function foo() {} } }", env: {es6: true}},
        {code: "let a;", env: {es6: true}, ecmaFeatures: {modules: true}, parserOptions: {sourceType: "module"}},
        {code: "const a = 0;", env: {es6: true}, ecmaFeatures: {modules: true}, parserOptions: {sourceType: "module"}},
        {code: "class A {}", env: {es6: true}, ecmaFeatures: {modules: true}, parserOptions: {sourceType: "module"}},
        {code: "if (0) { function foo() {} }", env: {es6: true}, ecmaFeatures: {modules: true}, parserOptions: {sourceType: "module"}},
        {code: "function foo() { let a; }", env: {es6: true}, ecmaFeatures: {modules: true}, parserOptions: {sourceType: "module"}},
        {code: "function foo() { const a = 0; }", env: {es6: true}, ecmaFeatures: {modules: true}, parserOptions: {sourceType: "module"}},
        {code: "function foo() { class A {} }", env: {es6: true}, ecmaFeatures: {modules: true}, parserOptions: {sourceType: "module"}},
        {code: "function foo() { if (0) { function foo() {} } }", env: {es6: true}, ecmaFeatures: {modules: true}, parserOptions: {sourceType: "module"}}
    ],
    invalid: [
        {code: "'foo'; let a;", env: {es6: true}, errors: ["Block-scoped declarations (let, const, function, class) not yet supported outside strict mode."]},
        {code: "'bar'; const a = 0;", env: {es6: true}, errors: ["Block-scoped declarations (let, const, function, class) not yet supported outside strict mode."]},
        {code: "class A {}", env: {es6: true}, errors: ["Block-scoped declarations (let, const, function, class) not yet supported outside strict mode."]},
        {code: "if (0) { function foo() {} }", env: {es6: true}, errors: ["Block-scoped declarations (let, const, function, class) not yet supported outside strict mode."]},
        {code: "try { function foo() {} } catch (e) {}", env: {es6: true}, errors: ["Block-scoped declarations (let, const, function, class) not yet supported outside strict mode."]}
    ]
});
