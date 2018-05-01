/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const version = require("./package.json").version

module.exports = {
    extends: ["plugin:mysticatea/es2015", "plugin:mysticatea/+eslint-plugin"],
    overrides: [
        {
            files: ["**/rules/**/*.js"],
            rules: {
                "mysticatea/eslint-plugin/require-meta-docs-url": [
                    "error",
                    {
                        pattern: `https://github.com/mysticatea/eslint-plugin-node/blob/v${version}/docs/rules/{{name}}.md`,
                    },
                ],
            },
        },
    ],
}
