/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path");
var debug = require("debug")("eslint-plugin-node");
var exists = require("./exists");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var cache = Object.create(null);

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * Gets a `package.json` data.
 * The data is cached if found, then it's used after.
 *
 * @param {string} startPath - A file path to lookup.
 * @returns {object|null} A found `package.json` data or `null`.
 *      This object have additional property `filePath`.
 */
module.exports = function getPackageJson(startPath) {
    var startDir = path.dirname(startPath);
    var dir = startDir;
    var prevDir;
    do {
        if (typeof cache[dir] !== "undefined") {
            debug("CACHE HIT", dir);
            return (cache[startDir] = cache[dir]);
        }

        var foundPath = path.join(dir, "package.json");
        if (exists(foundPath)) {
            debug("FOUND", foundPath);

            var data = require(foundPath);
            data.filePath = foundPath;
            return (cache[dir] = cache[startDir] = data);
        }
        debug("NOT FOUND", foundPath);

        // Go to next.
        prevDir = dir;
        dir = path.resolve(dir, "..");
    }
    while (dir !== prevDir);

    debug("NOT FOUND", "\"package.json\"");
    cache[startDir] = null;
    return null;
};
