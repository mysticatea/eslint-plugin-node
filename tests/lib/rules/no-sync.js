/**
 * @author Matt DuVall <http://www.mattduvall.com>
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-sync")

new RuleTester().run("no-sync", rule, {
    valid: [
        "var foo = fs.foo.foo();",
        {
            code: "var foo = fs.fooSync;",
            options: [{ allowAtRootLevel: true }],
        },
        {
            code: "if (true) {fs.fooSync();}",
            options: [{ allowAtRootLevel: true }],
        },
    ],
    invalid: [
        {
            code: "var foo = fs.fooSync();",
            errors: [
                {
                    messageId: "noSync",
                    data: { propertyName: "fooSync" },
                    type: "MemberExpression",
                },
            ],
        },
        {
            code: "var foo = fs.fooSync();",
            options: [{ allowAtRootLevel: false }],
            errors: [
                {
                    messageId: "noSync",
                    data: { propertyName: "fooSync" },
                    type: "MemberExpression",
                },
            ],
        },
        {
            code: "if (true) {fs.fooSync();}",
            errors: [
                {
                    messageId: "noSync",
                    data: { propertyName: "fooSync" },
                    type: "MemberExpression",
                },
            ],
        },
        {
            code: "var foo = fs.fooSync;",
            errors: [
                {
                    messageId: "noSync",
                    data: { propertyName: "fooSync" },
                    type: "MemberExpression",
                },
            ],
        },
        {
            code: "function someFunction() {fs.fooSync();}",
            errors: [
                {
                    messageId: "noSync",
                    data: { propertyName: "fooSync" },
                    type: "MemberExpression",
                },
            ],
        },
        {
            code: "function someFunction() {fs.fooSync();}",
            options: [{ allowAtRootLevel: true }],
            errors: [
                {
                    messageId: "noSync",
                    data: { propertyName: "fooSync" },
                    type: "MemberExpression",
                },
            ],
        },
        {
            code: "var a = function someFunction() {fs.fooSync();}",
            options: [{ allowAtRootLevel: true }],
            errors: [
                {
                    messageId: "noSync",
                    data: { propertyName: "fooSync" },
                    type: "MemberExpression",
                },
            ],
        },
    ],
})
