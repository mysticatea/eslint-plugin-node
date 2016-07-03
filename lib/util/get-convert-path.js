/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var Minimatch = require("minimatch").Minimatch

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * @param {any} x - An any value.
 * @returns {any} Always `x`.
 */
function identity(x) {
    return x
}

/**
 * Creates a function which replaces a given path.
 *
 * @param {RegExp} fromRegexp - A `RegExp` object to replace.
 * @param {string} toStr - A new string to replace.
 * @returns {function} A function which replaces a given path.
 */
function defineConvert(fromRegexp, toStr) {
    return function(filePath) {
        return filePath.replace(fromRegexp, toStr)
    }
}

/**
 * Combines given converters.
 * The result function converts a given path with the first matched converter.
 *
 * @param {{match: function, convert: function}} converters - A list of converters to combine.
 * @returns {function} A function which replaces a given path.
 */
function combine(converters) {
    return function(filePath) {
        for (var i = 0; i < converters.length; ++i) {
            var converter = converters[i]

            if (converter.match(filePath)) {
                return converter.convert(filePath)
            }
        }
        return filePath
    }
}

/**
 * Parses `convertPath` property from a given option object.
 *
 * @param {object|undefined} option - An option object to get.
 * @returns {function|null} A function which converts a path., or `null`.
 */
function parse(option) {
    if (!option ||
        !option.convertPath ||
        typeof option.convertPath !== "object"
    ) {
        return null
    }

    var converters = []
    var patterns = Object.keys(option.convertPath)
    for (var i = 0; i < patterns.length; ++i) {
        var pattern = patterns[i]
        var replacer = option.convertPath[pattern] || []
        var matcher = new Minimatch(pattern)
        var fromRegexp = new RegExp(String(replacer[0]))
        var toStr = String(replacer[1])

        converters.push({
            match: matcher.match.bind(matcher),
            convert: defineConvert(fromRegexp, toStr),
        })
    }

    return combine(converters)
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Gets "convertPath" setting.
 *
 * 1. This checks `options` property, then returns it if exists.
 * 2. This checks `settings.node` property, then returns it if exists.
 * 3. This returns a function of identity.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {function} A function which converts a path.
 */
module.exports = function getConvertPath(context) {
    return (
        parse(context.options && context.options[0]) ||
        parse(context.settings && context.settings.node) ||
        identity
    )
}
