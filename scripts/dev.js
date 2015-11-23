/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

require("shelljs/global");
/* eslint-env shelljs */

var rule = process.argv[2];
if (typeof rule !== "string" || !/^[a-z]+(?:-[a-z]+)*$/.test(rule)) {
    echo("Invalid Argument: " + rule);
    exit(1);
}

if (!which("mocha")) {
    echo("mocha Not Found.");
    exit(1);
}


exec("mocha tests/lib/rules/" + rule + ".js --colors --watch --growl");
