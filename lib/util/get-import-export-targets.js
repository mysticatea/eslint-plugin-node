/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path");
var resolve = require("resolve");
var getTryExtensions = require("./get-try-extensions");
var ImportTarget = require("./import-target");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var MODULE_TYPE = /^(?:Import|Export(?:Named|Default|All))Declaration$/;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * Gets a list of `require()` targets.
 *
 * Core modules of Node.js (e.g. `fs`, `http`) are excluded.
 *
 * @param {RuleContext} context - The rule context.
 * @param {ASTNode} programNode - The node of Program.
 * @returns {ImportTarget[]} A list of found target's information.
 */
module.exports = function getImportExportTargets(context, programNode) {
    var retv = [];
    var basedir = path.dirname(path.resolve(context.getFilename()));
    var statements = programNode.body;
    var extensions = getTryExtensions(context);

    for (var i = 0; i < statements.length; ++i) {
        var statement = statements[i];

        // Skip if it's not a module declaration.
        if (!MODULE_TYPE.test(statement.type)) {
            continue;
        }

        // Gets the target module.
        var node = statement.source;
        var name = node && node.value;
        if (name && !resolve.isCore(name)) {
            retv.push(new ImportTarget(node, name, basedir, extensions));
        }
    }

    return retv;
};
