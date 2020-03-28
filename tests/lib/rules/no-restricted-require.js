/**
 * @author Christian Schulz
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-restricted-require")

new RuleTester({
    globals: { require: "readonly" },
}).run("no-restricted-require", rule, {
    valid: [
        { code: 'require("fs")', options: [["crypto"]] },
        { code: 'require("path")', options: [["crypto", "stream", "os"]] },
        'require("fs ")',
        { code: "require(2)", options: [["crypto"]] },
        { code: "require(foo)", options: [["crypto"]] },
        { code: "bar('crypto');", options: [["crypto"]] },
        { code: 'require("foo/bar");', options: [["foo"]] },
        {
            code: 'require("foo/bar");',
            options: [[{ name: ["foo", "bar"] }]],
        },
        {
            code: 'require("foo/bar");',
            options: [[{ name: ["foo/c*"] }]],
        },
        {
            code: 'require("foo/bar");',
            options: [[{ name: ["foo"] }, { name: ["foo/c*"] }]],
        },
        {
            code: 'require("foo/bar");',
            options: [[{ name: ["foo"] }, { name: ["foo/*", "!foo/bar"] }]],
        },
        {
            code: 'require("os ")',
            options: [["fs", "crypto ", "stream", "os"]],
        },
        {
            code: 'require("./foo")',
            options: [["foo"]],
        },
        {
            code: 'require("foo")',
            options: [["./foo"]],
        },
        {
            code: 'require("foo/bar");',
            options: [[{ name: "@foo/bar" }]],
        },
        {
            filename: path.resolve(__dirname, "lib/sub/test.js"),
            code: 'require("../foo");',
            options: [[{ name: path.resolve(__dirname, "foo") }]],
        },
    ],
    invalid: [
        {
            code: 'require("fs")',
            options: [["fs"]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "fs", customMessage: "" },
                },
            ],
        },
        {
            code: 'require("foo/bar");',
            options: [["foo/bar"]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo/bar", customMessage: "" },
                },
            ],
        },
        {
            code: 'require("foo/bar");',
            options: [[{ name: ["foo/bar"] }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo/bar", customMessage: "" },
                },
            ],
        },
        {
            code: 'require("foo/bar");',
            options: [[{ name: ["foo/*"] }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo/bar", customMessage: "" },
                },
            ],
        },
        {
            code: 'require("foo/bar");',
            options: [[{ name: ["foo/*"] }, { name: ["foo"] }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo/bar", customMessage: "" },
                },
            ],
        },
        {
            code: 'require("foo/bar");',
            options: [[{ name: ["foo/*", "!foo/baz"] }, { name: ["foo"] }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo/bar", customMessage: "" },
                },
            ],
        },
        {
            code: 'require("foo");',
            options: [
                [
                    {
                        name: "foo",
                        message: "Please use 'bar' module instead.",
                    },
                ],
            ],
            errors: [
                {
                    messageId: "restricted",
                    data: {
                        name: "foo",
                        customMessage: " Please use 'bar' module instead.",
                    },
                },
            ],
        },
        {
            code: 'require("bar");',
            options: [
                [
                    "foo",
                    {
                        name: "bar",
                        message: "Please use 'baz' module instead.",
                    },
                    "baz",
                ],
            ],
            errors: [
                {
                    messageId: "restricted",
                    data: {
                        name: "bar",
                        customMessage: " Please use 'baz' module instead.",
                    },
                },
            ],
        },
        {
            code: 'require("@foo/bar");',
            options: [[{ name: "@foo/*" }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "@foo/bar", customMessage: "" },
                },
            ],
        },
        {
            code: 'require("./foo/bar");',
            options: [[{ name: "./foo/*" }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "./foo/bar", customMessage: "" },
                },
            ],
        },
        {
            filename: path.resolve(__dirname, "lib/test.js"),
            code: 'require("../foo");',
            options: [[{ name: path.resolve(__dirname, "foo") }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "../foo", customMessage: "" },
                },
            ],
        },
        {
            filename: path.resolve(__dirname, "lib/sub/test.js"),
            code: 'require("../../foo");',
            options: [[{ name: path.resolve(__dirname, "foo") }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "../../foo", customMessage: "" },
                },
            ],
        },
    ],
})
