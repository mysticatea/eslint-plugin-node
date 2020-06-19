/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const DEFAULT_VALUE = false

/**
 * Gets `yarnWorkspaces` property from a given option object.
 *
 * @param {object|undefined} option - An option object to get.
 * @returns {boolean|null} The `yarnWorkspaces` value, or `null`.
 */
function get(option) {
    if (option && "yarnWorkspaces" in option) {
        return option.yarnWorkspaces
    }
    return null
}

/**
 * Gets "yarnWorkspaces" setting.
 *
 * 1. This checks `options` property, then returns it if exists.
 * 2. This checks `settings.node` property, then returns it if exists.
 * 3. This returns `false`.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {boolean}
 */
module.exports = function getTryExtensions(context, optionIndex = 0) {
    return (
        get(context.options && context.options[optionIndex]) ||
        get(context.settings && context.settings.node) ||
        DEFAULT_VALUE
    )
}

module.exports.schema = {
    type: "boolean",
}
