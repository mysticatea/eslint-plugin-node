/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-extraneous-require")

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-extraneous", name)
}

const tester = new RuleTester({ env: { node: true } })

tester.run("no-extraneous-require", rule, {
    valid: [
        {
            filename: fixture("dependencies/a.js"),
            code: "$.require('bbb')",
        },
        {
            filename: fixture("dependencies/a.js"),
            code: "require('./bbb')",
        },
        {
            filename: fixture("dependencies/a.js"),
            code: "require(bbb)",
        },
        {
            filename: fixture("dependencies/a.js"),
            code: "require('aaa')",
        },
        {
            filename: fixture("dependencies/a.js"),
            code: "require('aaa/bbb')",
        },
        {
            filename: fixture("dependencies/a.js"),
            code: "require('@bbb/aaa')",
        },
        {
            filename: fixture("dependencies/a.js"),
            code: "require('@bbb/aaa/bbb')",
        },
        {
            filename: fixture("devDependencies/a.js"),
            code: "require('aaa')",
        },
        {
            filename: fixture("peerDependencies/a.js"),
            code: "require('aaa')",
        },
        {
            filename: fixture("optionalDependencies/a.js"),
            code: "require('aaa')",
        },

        // missing packages are warned by no-missing-require
        {
            filename: fixture("dependencies/a.js"),
            code: "require('ccc')",
        },
    ],
    invalid: [
        {
            filename: fixture("dependencies/a.js"),
            code: "require('bbb')",
            errors: ['"bbb" is extraneous.'],
        },
        {
            filename: fixture("devDependencies/a.js"),
            code: "require('bbb')",
            errors: ['"bbb" is extraneous.'],
        },
        {
            filename: fixture("peerDependencies/a.js"),
            code: "require('bbb')",
            errors: ['"bbb" is extraneous.'],
        },
        {
            filename: fixture("optionalDependencies/a.js"),
            code: "require('bbb')",
            errors: ['"bbb" is extraneous.'],
        },
        {
            filename: fixture("dependencies/a.js"),
            code: "require('b'+'bb')",
            errors: ['"bbb" is extraneous.'],
        },
    ],
})
