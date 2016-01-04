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
var Ignore = require("ignore").Ignore;
var Cache = require("./cache");
var getPackageJson = require("./get-package-json");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var cache = new Cache();
var TAIL_SLASH = /\/+$/;

/**
 * @returns {boolean} `false` always.
 */
function alwaysFalse() {
    return false;
}

/**
 * @param {function} f - A function.
 * @param {function} g - A function.
 * @returns {function} A logical-and function of `f` and `g`.
 */
function and(f, g) {
    return function(filePath) {
        return f(filePath) || g(filePath);
    };
}

/**
 * @param {function} f - A function.
 * @returns {function} A logical-not function of `f`.
 */
function not(f) {
    return function(filePath) {
        return !f(filePath);
    };
}

/**
 * Creates a function to check whether or not a given file should be ignored.
 *
 * @param {string[]|null} files - File names of whitelist.
 * @returns {function} A function to check whether or not a given file should be
 *      ignored.
 */
function parseWhiteList(files) {
    if (!files || !Array.isArray(files)) {
        return null;
    }

    var ignore = new Ignore({twoGlobstars: true});
    ignore.addPattern("*");

    for (var i = 0; i < files.length; ++i) {
        var file = files[i];

        if (typeof file === "string") {
            ignore.addPattern("!" + file);
            ignore.addPattern("!" + file.replace(TAIL_SLASH, "") + "/**");
        }
    }

    return not(ignore.createFilter());
}

/**
 * Creates a function to check whether or not a given file should be ignored.
 *
 * @param {string} filePath - A file path of `.npmignore`.
 * @returns {function} A function to check whether or not a given file should be
 *      ignored.
 */
function parseNpmignore(filePath) {
    var ignore = new Ignore({twoGlobstars: true});
    ignore.addIgnoreFile(filePath);

    return not(ignore.createFilter());
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Gets an object to check whther or not a given path should be ignored.
 * The object is created from:
 *
 * - `files` field of `package.json`
 * - `.npmignore`
 *
 * @param {string} startPath - A file path to lookup.
 * @returns {object}
 *      An object to check whther or not a given path should be ignored.
 *      The object has a method `match`.
 *      `match` returns `true` if a given file path should be ignored.
 */
module.exports = function getIgnores(startPath) {
    var retv = {match: alwaysFalse};

    var p = getPackageJson(startPath);
    if (p) {
        var data = cache.get(p.filePath);
        if (data) {
            return data;
        }

        var filesIgnore = parseWhiteList(p.files);
        var npmignoreIgnore = parseNpmignore(
            path.join(path.dirname(p.filePath), ".npmignore")
        );

        if (filesIgnore && npmignoreIgnore) {
            retv.match = and(filesIgnore, npmignoreIgnore);
        } else if (filesIgnore) {
            retv.match = filesIgnore;
        } else if (npmignoreIgnore) {
            retv.match = npmignoreIgnore;
        }

        cache.put(p.filePath, retv);
    }

    return retv;
};
