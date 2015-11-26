/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
/* eslint-env shelljs */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path");
require("shelljs/global");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * @param {string} name - A file name to convert.
 * @returns {string} The base name of the file name.
 */
function toBasename(name) {
    return path.basename(name, ".js");
}

/**
 * @param {string} name - A rule name to convert.
 * @returns {string} The definition code of the rule creator.
 */
function toRuleDefinition(name) {
    return "        \"" + name + "\": require(\"./lib/rules/" + name + "\")";
}

/**
 * @param {string} name - A rule name to convert.
 * @returns {string} The definition code of the default rule level.
 */
function toRuleLevel(name) {
    return "        \"" + name + "\": 0";
}

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

var ruleNames = ls("lib/rules").map(toBasename);

[
    "/**",
    " * @author Toru Nagashima",
    " * @copyright 2015 Toru Nagashima. All rights reserved.",
    " * See LICENSE file in root directory for full license.",
    " */",
    "\"use strict\";",
    "",
    "module.exports = {",
    "    rules: {",
    ruleNames.map(toRuleDefinition).join(",\n"),
    "    },",
    "    rulesConfig: {",
    ruleNames.map(toRuleLevel).join(",\n"),
    "    }",
    "};",
    ""
].join("\n").to("index.js");
