/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
/* eslint-env shelljs */
/* eslint no-process-exit: 0 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

require("shelljs/global");

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

var ruleName = process.argv[2];
if (typeof ruleName !== "string") {
    console.error("Invalid Rule Name:" + ruleName);
    process.exit(1);
}

exec("watch \"mocha tests/lib/rules/" + ruleName + ".js --colors\" lib tests --wait=0");
