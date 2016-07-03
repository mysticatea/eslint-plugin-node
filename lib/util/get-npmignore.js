/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs")
var path = require("path")
var ignore = require("ignore")
var Cache = require("./cache")
var exists = require("./exists")
var getPackageJson = require("./get-package-json")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var cache = new Cache()
var SLASH_AT_BEGIN_END = /(?:^\/+|\/+$)/g
var PARENT_RELATIVE_PATH = /^\.\./
var NEVER_IGNORED = /^(?:readme\.[^\.]*|(?:licen[cs]e|changes|changelog|history)(?:\.[^\.]*)?)$/i

/**
 * Checks whether or not a given file name is a relative path to a ancestor
 * directory.
 *
 * @param {string} filePath - A file name to check.
 * @returns {boolean} `true` if the file name is a relative path to a ancestor
 * 		directory.
 */
function notAncestorFiles(filePath) {
    return PARENT_RELATIVE_PATH.test(filePath)
}

/**
 * @param {function} f - A function.
 * @param {function} g - A function.
 * @returns {function} A logical-and function of `f` and `g`.
 */
function and(f, g) {
    return function(filePath) {
        return f(filePath) && g(filePath)
    }
}

/**
 * @param {function} f - A function.
 * @param {function} g - A function.
 * @param {function|null} h - A function.
 * @returns {function} A logical-or function of `f`, `g`, and `h`.
 */
function or(f, g, h) {
    return function(filePath) {
        return f(filePath) || g(filePath) || (h && h(filePath))
    }
}

/**
 * @param {function} f - A function.
 * @returns {function} A logical-not function of `f`.
 */
function not(f) {
    return function(filePath) {
        return !f(filePath)
    }
}

/**
 * Creates a function which checks whether or not a given file is ignoreable.
 *
 * @param {object} p - An object of package.json.
 * @returns {function} A function which checks whether or not a given file is ignoreable.
 */
function filterNeverIgnoredFiles(p) {
    var basedir = path.dirname(p.filePath)
    var mainFilePath = (typeof p.main === "string") ? path.join(basedir, p.main) : null

    return function(filePath) {
        return (
            path.join(basedir, filePath) !== mainFilePath &&
            filePath !== "package.json" &&
            !NEVER_IGNORED.test(path.basename(filePath))
        )
    }
}

/**
 * Creates a function which checks whether or not a given file should be ignored.
 *
 * @param {string[]|null} files - File names of whitelist.
 * @returns {function|null} A function which checks whether or not a given file should be ignored.
 */
function parseWhiteList(files) {
    if (!files || !Array.isArray(files)) {
        return null
    }

    var ig = ignore()
    ig.add("*")

    for (var i = 0; i < files.length; ++i) {
        var file = files[i]

        if (typeof file === "string") {
            file = "/" + file.replace(SLASH_AT_BEGIN_END, "")
            ig.add("!" + file)
            ig.add("!" + file + "/**")
        }
    }

    return not(ig.createFilter())
}

/**
 * Creates a function which checks whether or not a given file should be ignored.
 *
 * @param {string} basedir - The directory path "package.json" exists.
 * @param {boolean} filesFieldExists - `true` if `files` field of `package.json` exists.
 * @returns {function|null} A function which checks whether or not a given file should be ignored.
 */
function parseNpmignore(basedir, filesFieldExists) {
    var filePath = path.join(basedir, ".npmignore")
    if (!exists(filePath)) {
        if (filesFieldExists) {
            return null
        }

        filePath = path.join(basedir, ".gitignore")
        if (!exists(filePath)) {
            return null
        }
    }

    var ig = ignore()
    ig.add(fs.readFileSync(filePath, "utf8"))
    return not(ig.createFilter())
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
module.exports = function getNpmignore(startPath) {
    var retv = {match: notAncestorFiles}

    var p = getPackageJson(startPath)
    if (p) {
        var data = cache.get(p.filePath)
        if (data) {
            return data
        }

        var filesIgnore = parseWhiteList(p.files)
        var npmignoreIgnore = parseNpmignore(path.dirname(p.filePath), Boolean(filesIgnore))

        if (filesIgnore && npmignoreIgnore) {
            retv.match = and(filterNeverIgnoredFiles(p), or(notAncestorFiles, filesIgnore, npmignoreIgnore))
        }
        else if (filesIgnore) {
            retv.match = and(filterNeverIgnoredFiles(p), or(notAncestorFiles, filesIgnore))
        }
        else if (npmignoreIgnore) {
            retv.match = and(filterNeverIgnoredFiles(p), or(notAncestorFiles, npmignoreIgnore))
        }

        cache.put(p.filePath, retv)
    }

    return retv
}
