/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-unpublished-bin")

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-unpublished-bin", name)
}

new RuleTester().run("no-unpublished-bin", rule, {
    valid: [
        {
            filename: fixture("simple-ok/a.js"),
            code: "'simple-ok/a.js'",
        },
        {
            filename: fixture("multi-ok/a.js"),
            code: "'multi-ok/a.js'",
        },
        {
            filename: fixture("multi-ok/b.js"),
            code: "'multi-ok/b.js'",
        },
        {
            filename: fixture("simple-files/x.js"),
            code: "'simple-files/x.js'",
        },
        {
            filename: fixture("multi-files/x.js"),
            code: "'multi-files/x.js'",
        },
        {
            filename: fixture("simple-files/lib/a.js"),
            code: "'simple-files/lib/a.js'",
        },
        {
            filename: fixture("multi-files/lib/a.js"),
            code: "'multi-files/lib/a.js'",
        },
        {
            filename: fixture("simple-npmignore/x.js"),
            code: "'simple-npmignore/x.js'",
        },
        {
            filename: fixture("multi-npmignore/x.js"),
            code: "'multi-npmignore/x.js'",
        },
        {
            filename: fixture("simple-npmignore/lib/a.js"),
            code: "'simple-npmignore/lib/a.js'",
        },
        {
            filename: fixture("multi-npmignore/lib/a.js"),
            code: "'multi-npmignore/lib/a.js'",
        },
        {
            filename: fixture("issue115/lib/a.js"),
            code: "'issue115/lib/a.js'",
        },

        // empty name
        "'stdin'",

        // convertPath option
        {
            filename: fixture("simple-files/a.js"),
            code: "'simple-files/a.js'",
            options: [{ convertPath: { "a.js": ["a.js", "lib/a.js"] } }],
        },
        {
            filename: fixture("multi-files/a.js"),
            code: "'multi-files/a.js'",
            options: [{ convertPath: { "a.js": ["a.js", "lib/a.js"] } }],
        },
        {
            filename: fixture("simple-npmignore/a.js"),
            code: "'simple-npmignore/a.js'",
            options: [{ convertPath: { "a.js": ["a.js", "lib/a.js"] } }],
        },
        {
            filename: fixture("multi-npmignore/a.js"),
            code: "'multi-npmignore/a.js'",
            options: [{ convertPath: { "a.js": ["a.js", "lib/a.js"] } }],
        },

        // convertPath shared setting
        {
            filename: fixture("simple-files/a.js"),
            code: "'simple-files/a.js'",
            settings: {
                node: { convertPath: { "a.js": ["a.js", "lib/a.js"] } },
            },
        },
        {
            filename: fixture("multi-files/a.js"),
            code: "'multi-files/a.js'",
            settings: {
                node: { convertPath: { "a.js": ["a.js", "lib/a.js"] } },
            },
        },
        {
            filename: fixture("simple-npmignore/a.js"),
            code: "'simple-npmignore/a.js'",
            settings: {
                node: { convertPath: { "a.js": ["a.js", "lib/a.js"] } },
            },
        },
        {
            filename: fixture("multi-npmignore/a.js"),
            code: "'multi-npmignore/a.js'",
            settings: {
                node: { convertPath: { "a.js": ["a.js", "lib/a.js"] } },
            },
        },
    ],
    invalid: [
        // files field of `package.json`
        {
            filename: fixture("simple-files/a.js"),
            code: "'simple-files/a.js'",
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
        },
        {
            filename: fixture("multi-files/a.js"),
            code: "'multi-files/a.js'",
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
        },
        {
            filename: fixture("multi-files/b.js"),
            code: "'multi-files/b.js'",
            errors: [
                "npm ignores 'b.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
        },

        // `.npmignore`
        {
            filename: fixture("simple-npmignore/a.js"),
            code: "'simple-npmignore/a.js'",
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
        },
        {
            filename: fixture("multi-npmignore/a.js"),
            code: "'multi-npmignore/a.js'",
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
        },

        // files field of `package.json` with convertPath
        {
            filename: fixture("simple-files/x.js"),
            code: "'simple-files/x.js'",
            options: [{ convertPath: { "x.js": ["x.js", "a.js"] } }],
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
        },
        {
            filename: fixture("multi-files/x.js"),
            code: "'multi-files/x.js'",
            options: [{ convertPath: { "x.js": ["x.js", "a.js"] } }],
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
        },
        {
            filename: fixture("multi-files/x.js"),
            code: "'multi-files/x.js'",
            options: [{ convertPath: { "x.js": ["x.js", "b.js"] } }],
            errors: [
                "npm ignores 'b.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
        },

        // `.npmignore` with convertPath
        {
            filename: fixture("simple-npmignore/x.js"),
            code: "'simple-npmignore/x.js'",
            options: [{ convertPath: { "x.js": ["x.js", "a.js"] } }],
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
        },
        {
            filename: fixture("multi-npmignore/x.js"),
            code: "'multi-npmignore/x.js'",
            options: [{ convertPath: { "x.js": ["x.js", "a.js"] } }],
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
        },
        {
            filename: fixture("simple-npmignore/x.js"),
            code: "'simple-npmignore/x.js'",
            options: [
                {
                    convertPath: [
                        {
                            include: ["x.js"],
                            replace: ["x.js", "a.js"],
                        },
                    ],
                },
            ],
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
        },
        {
            filename: fixture("multi-npmignore/x.js"),
            code: "'multi-npmignore/x.js'",
            options: [
                {
                    convertPath: [
                        {
                            include: ["x.js"],
                            replace: ["x.js", "a.js"],
                        },
                    ],
                },
            ],
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
        },

        // files field of `package.json` with convertPath (shared setting)
        {
            filename: fixture("simple-files/x.js"),
            code: "'simple-files/x.js'",
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
            settings: { node: { convertPath: { "x.js": ["x.js", "a.js"] } } },
        },
        {
            filename: fixture("multi-files/x.js"),
            code: "'multi-files/x.js'",
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
            settings: { node: { convertPath: { "x.js": ["x.js", "a.js"] } } },
        },
        {
            filename: fixture("multi-files/x.js"),
            code: "'multi-files/x.js'",
            errors: [
                "npm ignores 'b.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
            settings: { node: { convertPath: { "x.js": ["x.js", "b.js"] } } },
        },

        // `.npmignore` with convertPath (shared setting)
        {
            filename: fixture("simple-npmignore/x.js"),
            code: "'simple-npmignore/x.js'",
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
            settings: { node: { convertPath: { "x.js": ["x.js", "a.js"] } } },
        },
        {
            filename: fixture("multi-npmignore/x.js"),
            code: "'multi-npmignore/x.js'",
            errors: [
                "npm ignores 'a.js'. Check 'files' field of 'package.json' or '.npmignore'.",
            ],
            settings: { node: { convertPath: { "x.js": ["x.js", "a.js"] } } },
        },
    ],
})
