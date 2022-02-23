/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const glob = require("fast-glob")
const rootDir = path.resolve(__dirname, "../lib/rules/")
const { pluginName } = require("./utils")

/**
 * @typedef {Object} RuleInfo
 * @property {string} filePath The path to the rule definition.
 * @property {string} id The rule ID. (This includes `n/` prefix.)
 * @property {string} name The rule name. (This doesn't include `n/` prefix.)
 * @property {string} category The category ID.
 * @property {string} description The description of this rule.
 * @property {boolean} recommended The flag to indicate a recommended rule.
 * @property {boolean} deprecated The flag to indicate a deprecated rule.
 * @property {boolean} fixable The flag to indicate a fixable rule.
 * @property {string[]} replacedBy The flag to indicate a fixable rule.
 */

/**
 * @typedef {Object} CategoryInfo
 * @property {string} id The category ID.
 * @property {RuleInfo[]} rules The rules which belong to this category.
 */

/** @type {RuleInfo[]} */
const rules = glob
    .sync("**/*.js", { cwd: rootDir })
    .sort()
    .map(filename => {
        const filePath = path.join(rootDir, filename)
        const name = filename.slice(0, -3)
        const { meta } = require(filePath)
        return Object.assign(
            {
                filePath,
                id: `${pluginName}/${name}`,
                name,
                deprecated: Boolean(meta.deprecated),
                fixable: Boolean(meta.fixable),
                replacedBy: [],
            },
            meta.docs
        )
    })

/** @type {CategoryInfo[]} */
const categories = [
    "Possible Errors",
    "Best Practices",
    "Stylistic Issues",
].map(id => ({
    id,
    rules: rules.filter(rule => rule.category === id && !rule.deprecated),
}))

module.exports = { rules, categories }
