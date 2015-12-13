/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs");
var path = require("path");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var cacheMap = Object.create(null);
var SKIP_TIME = 5000;

/**
 * Gets the `package.json` data of a given directory from the cache.
 *
 * @param {string} dir - The path to a directory to get.
 * @returns {object|null} The cache value, or null.
 */
function getCache(dir) {
    var cache = cacheMap[dir];
    if (typeof cache !== "undefined" && cache.expire - Date.now() > 0) {
        return cache.value;
    }
    return null;
}

/**
 * Sets the `package.json` data of a given directory into the cache.
 *
 * @param {string} dir - The path to a directory to set.
 * @param {object|null} value - A `package.json` data to set.
 * @returns {void}
 */
function putCache(dir, value) {
    cacheMap[dir] = {
        value: value,
        expire: Date.now() + SKIP_TIME
    };
}

/**
 * Reads the `package.json` data in a given path.
 *
 * Don't cache the data.
 *
 * @param {string} dir - The path to a directory to read.
 * @returns {object|null} The read `package.json` data, or null.
 */
function readPackageJson(dir) {
    var filePath = path.join(dir, "package.json");
    try {
        var text = fs.readFileSync(filePath, "utf8");
        var data = JSON.parse(text);

        if (typeof data === "object" && data !== null) {
            data.filePath = filePath;
            return data;
        }
    } catch (err) {
        // do nothing.
    }

    return null;
}

//------------------------------------------------------------------------------
// Public Interface
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
    var startDir = path.dirname(path.resolve(startPath));
    var dir = startDir;
    var prevDir;
    do {
        var cache = getCache(dir);
        if (cache) {
            if (dir !== startDir) {
                putCache(startDir, cache);
            }
            return cache;
        }

        var data = readPackageJson(dir);
        if (data) {
            putCache(dir, data);
            putCache(startDir, data);
            return data;
        }

        // Go to next.
        prevDir = dir;
        dir = path.resolve(dir, "..");
    }
    while (dir !== prevDir);

    putCache(startDir, null);
    return null;
};
