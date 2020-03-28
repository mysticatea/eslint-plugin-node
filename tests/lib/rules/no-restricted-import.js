/**
 * @author Christian Schulz
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const { Linter, RuleTester } = require("eslint")
const rule = require("../../../lib/rules/no-restricted-import")

const DynamicImportSupported = (() => {
    const config = { parserOptions: { ecmaVersion: 2020 } }
    const messages = new Linter().verify("import(s)", config)
    return messages.length === 0
})()

if (!DynamicImportSupported) {
    //eslint-disable-next-line no-console
    console.warn(
        "[%s] Skip tests for 'import()'",
        path.basename(__filename, ".js")
    )
}

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
}).run("no-restricted-import", rule, {
    valid: [
        { code: 'import "fs"', options: [["crypto"]] },
        { code: 'import "path"', options: [["crypto", "stream", "os"]] },
        'import "fs "',
        { code: 'import "foo/bar";', options: [["foo"]] },
        {
            code: 'import "foo/bar";',
            options: [[{ name: ["foo", "bar"] }]],
        },
        {
            code: 'import "foo/bar";',
            options: [[{ name: ["foo/c*"] }]],
        },
        {
            code: 'import "foo/bar";',
            options: [[{ name: ["foo"] }, { name: ["foo/c*"] }]],
        },
        {
            code: 'import "foo/bar";',
            options: [[{ name: ["foo"] }, { name: ["foo/*", "!foo/bar"] }]],
        },
        {
            code: 'import "os "',
            options: [["fs", "crypto ", "stream", "os"]],
        },
        {
            code: 'import "./foo"',
            options: [["foo"]],
        },
        {
            code: 'import "foo"',
            options: [["./foo"]],
        },
        {
            code: 'import "foo/bar";',
            options: [[{ name: "@foo/bar" }]],
        },
        {
            filename: path.resolve(__dirname, "lib/sub/test.js"),
            code: 'import "../foo";',
            options: [[{ name: path.resolve(__dirname, "foo") }]],
        },

        // import()
        ...(DynamicImportSupported
            ? [
                  {
                      code: "import(fs)",
                      options: [["fs"]],
                      parserOptions: { ecmaVersion: 2020 },
                  },
              ]
            : []),
    ],
    invalid: [
        {
            code: 'import "fs"',
            options: [["fs"]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "fs", customMessage: "" },
                },
            ],
        },
        {
            code: 'import fs from "fs"',
            options: [["fs"]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "fs", customMessage: "" },
                },
            ],
        },
        {
            code: 'import {} from "fs"',
            options: [["fs"]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "fs", customMessage: "" },
                },
            ],
        },
        {
            code: 'export * from "fs"',
            options: [["fs"]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "fs", customMessage: "" },
                },
            ],
        },
        {
            code: 'export {} from "fs"',
            options: [["fs"]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "fs", customMessage: "" },
                },
            ],
        },
        {
            code: 'import "foo/bar";',
            options: [["foo/bar"]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo/bar", customMessage: "" },
                },
            ],
        },
        {
            code: 'import "foo/bar";',
            options: [[{ name: ["foo/bar"] }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo/bar", customMessage: "" },
                },
            ],
        },
        {
            code: 'import "foo/bar";',
            options: [[{ name: ["foo/*"] }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo/bar", customMessage: "" },
                },
            ],
        },
        {
            code: 'import "foo/bar";',
            options: [[{ name: ["foo/*"] }, { name: ["foo"] }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo/bar", customMessage: "" },
                },
            ],
        },
        {
            code: 'import "foo/bar";',
            options: [[{ name: ["foo/*", "!foo/baz"] }, { name: ["foo"] }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo/bar", customMessage: "" },
                },
            ],
        },
        {
            code: 'import "foo";',
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
            code: 'import "bar";',
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
            code: 'import "@foo/bar";',
            options: [[{ name: "@foo/*" }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "@foo/bar", customMessage: "" },
                },
            ],
        },
        {
            code: 'import "./foo/bar";',
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
            code: 'import "../foo";',
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
            code: 'import "../../foo";',
            options: [[{ name: path.resolve(__dirname, "foo") }]],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "../../foo", customMessage: "" },
                },
            ],
        },

        // import()
        ...(DynamicImportSupported
            ? [
                  {
                      code: 'import("fs")',
                      options: [["fs"]],
                      parserOptions: { ecmaVersion: 2020 },
                      errors: [
                          {
                              messageId: "restricted",
                              data: { name: "fs", customMessage: "" },
                          },
                      ],
                  },
              ]
            : []),
    ],
})
