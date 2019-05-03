/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const version = require("./package.json").version

module.exports = {
    extends: ["plugin:@mysticatea/es2015", "plugin:@mysticatea/+eslint-plugin"],
    rules: {
        "@mysticatea/eslint-plugin/test-case-property-ordering": [
            "error",
            [
                "filename",
                "code",
                "output",
                "options",
                "parser",
                "parserOptions",
                "globals",
                "env",
                "errors",
            ],
        ],
    },
    overrides: [
        {
            files: ["**/rules/*.js"],
            rules: {
                "@mysticatea/eslint-plugin/require-meta-docs-url": [
                    "error",
                    {
                        pattern: `https://github.com/mysticatea/eslint-plugin-node/blob/v${version}/docs/rules/{{name}}.md`,
                    },
                ],
            },
        },
        {
            files: ["**/rules/no-unsupported-features/*.js"],
            rules: {
                "@mysticatea/eslint-plugin/require-meta-docs-url": [
                    "error",
                    {
                        pattern: `https://github.com/mysticatea/eslint-plugin-node/blob/v${version}/docs/rules/no-unsupported-features/{{name}}.md`,
                    },
                ],
            },
        },
        {
            files: ["**/rules/prefer-global/*.js"],
            rules: {
                "@mysticatea/eslint-plugin/require-meta-docs-url": [
                    "error",
                    {
                        pattern: `https://github.com/mysticatea/eslint-plugin-node/blob/v${version}/docs/rules/prefer-global/{{name}}.md`,
                    },
                ],
            },
        },
        {
            files: ["**/rules/prefer-promises/*.js"],
            rules: {
                "@mysticatea/eslint-plugin/require-meta-docs-url": [
                    "error",
                    {
                        pattern: `https://github.com/mysticatea/eslint-plugin-node/blob/v${version}/docs/rules/prefer-promises/{{name}}.md`,
                    },
                ],
            },
        },
    ],
}
