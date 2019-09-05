/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const { Linter, RuleTester } = require("eslint")
const rule = require("../../../lib/rules/file-extension-in-import")

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

function fixture(filename) {
    return path.resolve(
        __dirname,
        "../../fixtures/file-extension-in-import",
        filename
    )
}

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    settings: {
        node: {
            tryExtensions: [".mjs", ".cjs", ".js", ".json", ".node"],
        },
    },
}).run("file-extension-in-import", rule, {
    valid: [
        {
            filename: fixture("test.js"),
            code: "import 'eslint'",
        },
        {
            filename: fixture("test.js"),
            code: "import '@typescript-eslint/parser'",
        },
        {
            filename: fixture("test.js"),
            code: "import '@typescript-eslint\\parser'",
        },
        {
            filename: fixture("test.js"),
            code: "import 'punycode/'",
        },
        {
            filename: fixture("test.js"),
            code: "import 'xxx'",
        },
        {
            filename: fixture("test.js"),
            code: "import './a.js'",
        },
        {
            filename: fixture("test.js"),
            code: "import './b.json'",
        },
        {
            filename: fixture("test.js"),
            code: "import './c.mjs'",
        },
        {
            filename: fixture("test.js"),
            code: "import './a.js'",
            options: ["always"],
        },
        {
            filename: fixture("test.js"),
            code: "import './b.json'",
            options: ["always"],
        },
        {
            filename: fixture("test.js"),
            code: "import './c.mjs'",
            options: ["always"],
        },
        {
            filename: fixture("test.js"),
            code: "import './a'",
            options: ["never"],
        },
        {
            filename: fixture("test.js"),
            code: "import './b'",
            options: ["never"],
        },
        {
            filename: fixture("test.js"),
            code: "import './c'",
            options: ["never"],
        },
        {
            filename: fixture("test.js"),
            code: "import './a'",
            options: ["always", { ".js": "never" }],
        },
        {
            filename: fixture("test.js"),
            code: "import './b.json'",
            options: ["always", { ".js": "never" }],
        },
        {
            filename: fixture("test.js"),
            code: "import './c.mjs'",
            options: ["always", { ".js": "never" }],
        },
        {
            filename: fixture("test.js"),
            code: "import './a'",
            options: ["never", { ".json": "always" }],
        },
        {
            filename: fixture("test.js"),
            code: "import './b.json'",
            options: ["never", { ".json": "always" }],
        },
        {
            filename: fixture("test.js"),
            code: "import './c'",
            options: ["never", { ".json": "always" }],
        },
    ],
    invalid: [
        {
            filename: fixture("test.js"),
            code: "import './a'",
            output: "import './a.js'",
            errors: [{ messageId: "requireExt", data: { ext: ".js" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './b'",
            output: "import './b.json'",
            errors: [{ messageId: "requireExt", data: { ext: ".json" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './c'",
            output: "import './c.mjs'",
            errors: [{ messageId: "requireExt", data: { ext: ".mjs" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './a'",
            output: "import './a.js'",
            options: ["always"],
            errors: [{ messageId: "requireExt", data: { ext: ".js" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './b'",
            output: "import './b.json'",
            options: ["always"],
            errors: [{ messageId: "requireExt", data: { ext: ".json" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './c'",
            output: "import './c.mjs'",
            options: ["always"],
            errors: [{ messageId: "requireExt", data: { ext: ".mjs" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './a.js'",
            output: "import './a'",
            options: ["never"],
            errors: [{ messageId: "forbidExt", data: { ext: ".js" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './b.json'",
            output: "import './b'",
            options: ["never"],
            errors: [{ messageId: "forbidExt", data: { ext: ".json" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './c.mjs'",
            output: "import './c'",
            options: ["never"],
            errors: [{ messageId: "forbidExt", data: { ext: ".mjs" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './a.js'",
            output: "import './a'",
            options: ["always", { ".js": "never" }],
            errors: [{ messageId: "forbidExt", data: { ext: ".js" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './b'",
            output: "import './b.json'",
            options: ["always", { ".js": "never" }],
            errors: [{ messageId: "requireExt", data: { ext: ".json" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './c'",
            output: "import './c.mjs'",
            options: ["always", { ".js": "never" }],
            errors: [{ messageId: "requireExt", data: { ext: ".mjs" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './a.js'",
            output: "import './a'",
            options: ["never", { ".json": "always" }],
            errors: [{ messageId: "forbidExt", data: { ext: ".js" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './b'",
            output: "import './b.json'",
            options: ["never", { ".json": "always" }],
            errors: [{ messageId: "requireExt", data: { ext: ".json" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './c.mjs'",
            output: "import './c'",
            options: ["never", { ".json": "always" }],
            errors: [{ messageId: "forbidExt", data: { ext: ".mjs" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './multi'",
            output: null,
            options: ["always"],
            errors: [{ messageId: "requireExt", data: { ext: ".mjs" } }],
        },
        {
            filename: fixture("test.js"),
            code: "import './multi.cjs'",
            output: null,
            options: ["never"],
            errors: [{ messageId: "forbidExt", data: { ext: ".cjs" } }],
        },

        // import()
        ...(DynamicImportSupported
            ? [
                  {
                      filename: fixture("test.js"),
                      code: "function f() { import('./a') }",
                      output: "function f() { import('./a.js') }",
                      parserOptions: { ecmaVersion: 2020 },
                      errors: [
                          { messageId: "requireExt", data: { ext: ".js" } },
                      ],
                  },
                  {
                      filename: fixture("test.js"),
                      code: "function f() { import('./a.js') }",
                      output: "function f() { import('./a') }",
                      options: ["never"],
                      parserOptions: { ecmaVersion: 2020 },
                      errors: [
                          { messageId: "forbidExt", data: { ext: ".js" } },
                      ],
                  },
              ]
            : []),
    ],
})
