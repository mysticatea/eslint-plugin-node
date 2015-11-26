/**
 * @fileoverview Rule to check whether or not `require()` is valid.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path");
var minimatch = require("minimatch");
var assign = require("object-assign");
var resolve = require("resolve");
var exists = require("../exists");
var getPackageJson = require("../get-package-json");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether or not a given node is a callee.
 *
 * @param {ASTNode} node - A node to check.
 * @returns {boolean} `true` if the node is a callee.
 */
function isCallee(node) {
    return node.parent.type === "CallExpression" && node.parent.callee === node;
}

/**
 * Gets the value of a given node if it's a literal or a template literal.
 *
 * @param {ASTNode} node - A node to get.
 * @returns {string|null} The value of the node, or `null`.
 */
function getValueIfString(node) {
    if (!node) {
        return null;
    }

    switch (node.type) {
        case "Literal":
            if (typeof node.value === "string") {
                return node.value;
            }
            break;

        case "TemplateLiteral":
            if (node.expressions.length === 0) {
                return node.quasis[0].value.cooked;
            }
            break;

        // no default
    }

    return null;
}

/**
 * Gets the module name of a given path.
 *
 * e.g. `eslint/lib/ast-utils` -> `eslint`
 *
 * @param {string} nameOrPath - A path to get.
 * @returns {string} The module name of the path.
 */
function getModuleName(nameOrPath) {
    var end = nameOrPath.indexOf("/");
    if (end !== -1 && nameOrPath[0] === "@") {
        end = nameOrPath.indexOf("/", 1 + end);
    }

    return end === -1 ? nameOrPath : nameOrPath.slice(0, end);
}

/**
 * @typedef object TargetInfo
 * @property {ASTNode} node - The `Identifier` node of the target.
 * @property {string} name - The target name.
 * @property {boolean} relative - The flag which shows the target name is a relative path.
 */

/**
 * Gets a list of `require()` targets.
 *
 * Core modules of Node.js (e.g. `fs`, `http`) are excluded.
 *
 * @param {escope.Reference[]} references - References to search. This is
 *      `through` of the global scope.
 * @returns {TargetInfo[]} A list of found target's information.
 */
function getRequireTargets(references) {
    var retv = [];

    for (var i = 0; i < references.length; ++i) {
        var reference = references[i];
        var node = reference.identifier;

        // Skips if it's not a call of `require`.
        if (!node || node.name !== "require" || !isCallee(node)) {
            continue;
        }

        // Gets the target module.
        var name = getValueIfString(node.parent.arguments[0]);
        if (name && !resolve.isCore(name)) {
            retv.push({
                node: node,
                name: name,
                relative: /^\./.test(name)
            });
        }
    }

    return retv;
}

/**
 * Checks whether or not each requirement target exists.
 *
 * It looks up the target according to the logic of Node.js.
 * See Also: https://nodejs.org/api/modules.html
 *
 * @param {RuleContext} context - A context to report.
 * @param {string} filePath - The current file path.
 * @param {TargetInfo[]} targets - A list of target information to check.
 * @returns {void}
 */
function checkForExistence(context, filePath, targets) {
    var basedir = path.dirname(filePath);
    var opts = {basedir: basedir};

    for (var i = 0; i < targets.length; ++i) {
        var target = targets[i];

        // Workaround for https://github.com/substack/node-resolve/issues/78
        if (target.relative) {
            var ext = path.extname(target.name);
            var name = ext ? target.name : target.name + ".js";
            if (exists(path.resolve(basedir, name))) {
                continue;
            }
        } else {
            try {
                resolve.sync(target.name, opts);
                continue;
            } catch (err) {
                // ignore.
            }
        }

        context.report({
            node: target.node,
            message: "\"{{name}}\" was not found.",
            data: target
        });
    }
}

/**
 * Checks whether or not each requirement target is published via package.json.
 *
 * It reads package.json and checks the target exists in `dependencies`.
 *
 * @param {RuleContext} context - A context to report.
 * @param {string} filePath - The current file path.
 * @param {TargetInfo[]} targets - A list of target information to check.
 * @returns {void}
 */
function checkForPublish(context, filePath, targets) {
    var option = context.options[0];
    if ((option && option.publish) === null) {
        return;
    }

    var packageInfo = getPackageJson(filePath);
    if (!packageInfo) {
        return;
    }

    var publish = minimatch(
        path.relative(packageInfo.filePath, filePath).replace(/\\/g, "/"),
        (option && option.publish) || "+(./*|./{bin,lib,src}/**)",
        {matchBase: true}
    );
    var deps = assign(
        {},
        packageInfo.peerDependencies || {},
        packageInfo.dependencies || {},
        (!publish && packageInfo.devDependencies) || {}
    );

    for (var i = 0; i < targets.length; ++i) {
        var target = targets[i];

        if (!target.relative && !deps.hasOwnProperty(getModuleName(target.name))) {
            context.report({
                node: target.node,
                message: "\"{{name}}\" is not published.",
                data: target
            });
        }
    }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    return {
        "Program:exit": function() {
            var filePath = context.getFilename();
            if (filePath !== "<input>") {
                var targets = getRequireTargets(context.getScope().through);
                checkForExistence(context, filePath, targets);
                checkForPublish(context, filePath, targets);
            }
        }
    };
};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "publish": {"type": ["string", "null"]}
        },
        "additionalProperties": false
    }
];
