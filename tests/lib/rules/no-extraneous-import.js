/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const fs = require("fs")
const path = require("path")
const { Linter, RuleTester } = require("eslint")
const rule = require("../../../lib/rules/no-extraneous-import")

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

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-extraneous", name)
}

// We need to simulate `yarn workspaces` by creating symlinks inside `node_modules`
fs.symlinkSync(
    fixture("yarnWorkspaces/aaa"),
    fixture("yarnWorkspaces/node_modules/aaa")
)
fs.symlinkSync(
    fixture("yarnWorkspaces/bbb"),
    fixture("yarnWorkspaces/node_modules/bbb")
)

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
})
ruleTester.run("no-extraneous-import", rule, {
    valid: [
        {
            filename: fixture("dependencies/a.js"),
            code: "import bbb from './bbb'",
        },
        {
            filename: fixture("dependencies/a.js"),
            code: "import aaa from 'aaa'",
        },
        {
            filename: fixture("dependencies/a.js"),
            code: "import bbb from 'aaa/bbb'",
        },
        {
            filename: fixture("dependencies/a.js"),
            code: "import aaa from '@bbb/aaa'",
        },
        {
            filename: fixture("dependencies/a.js"),
            code: "import bbb from '@bbb/aaa/bbb'",
        },
        {
            filename: fixture("devDependencies/a.js"),
            code: "import aaa from 'aaa'",
        },
        {
            filename: fixture("peerDependencies/a.js"),
            code: "import aaa from 'aaa'",
        },
        {
            filename: fixture("optionalDependencies/a.js"),
            code: "import aaa from 'aaa'",
        },
        {
            filename: fixture("yarnWorkspaces/a.js"),
            code: "import aaa from 'aaa'",
        },
        {
            filename: fixture("yarnWorkspaces/b.js"),
            code: "import bbb from 'bbb'",
        },
        {
            filename: fixture("yarnWorkspaces/c.js"),
            code: "import ccc from 'ccc'",
        },

        // missing packages are warned by no-missing-import
        {
            filename: fixture("dependencies/a.js"),
            code: "import ccc from 'ccc'",
        },

        // yarnWorkspaces
        {
            filename: fixture("yarnWorkspaces/a.js"),
            code: "import aaa from 'aaa'",
            options: [{ yarnWorkspaces: true }],
        },
        {
            filename: fixture("yarnWorkspaces/b.js"),
            code: "import bbb from 'bbb'",
            options: [{ yarnWorkspaces: true }],
        },
        {
            filename: fixture("yarnWorkspaces/c.js"),
            code: "import ccc from 'ccc'",
            options: [{ yarnWorkspaces: true }],
        },
        {
            filename: fixture("yarnWorkspaces/aaa/c.js"),
            code: "import ccc from 'ccc'",
            options: [{ yarnWorkspaces: true }],
        },
        {
            filename: fixture("yarnWorkspaces/bbb/c.js"),
            code: "import ccc from 'ccc'",
            options: [{ yarnWorkspaces: true }],
        },
    ],
    invalid: [
        {
            filename: fixture("dependencies/a.js"),
            code: "import bbb from 'bbb'",
            errors: ['"bbb" is extraneous.'],
        },
        {
            filename: fixture("devDependencies/a.js"),
            code: "import bbb from 'bbb'",
            errors: ['"bbb" is extraneous.'],
        },
        {
            filename: fixture("peerDependencies/a.js"),
            code: "import bbb from 'bbb'",
            errors: ['"bbb" is extraneous.'],
        },
        {
            filename: fixture("optionalDependencies/a.js"),
            code: "import bbb from 'bbb'",
            errors: ['"bbb" is extraneous.'],
        },

        {
            filename: fixture("yarnWorkspaces/aaa/c.js"),
            code: "import ccc from 'ccc'",
            errors: ['"ccc" is extraneous.'],
        },
        {
            filename: fixture("yarnWorkspaces/bbb/c.js"),
            code: "import ccc from 'ccc'",
            errors: ['"ccc" is extraneous.'],
        },

        // import()
        ...(DynamicImportSupported
            ? [
                  {
                      filename: fixture("dependencies/a.js"),
                      code: "function f() { import('bbb') }",
                      parserOptions: { ecmaVersion: 2020 },
                      errors: ['"bbb" is extraneous.'],
                  },
              ]
            : []),
    ],
})
