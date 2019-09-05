/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const fs = require("fs")
const path = require("path")
const { categories, rules } = require("./rules")

/**
 * Render a given rule as a table row.
 * @param {RuleInfo} rule The rule information.
 * @returns {string} The table row.
 */
function renderRule(rule) {
    const mark = `${rule.recommended ? "⭐️" : ""}${rule.fixable ? "✒️" : ""}`
    const link = `[${rule.id}](./docs/rules/${rule.name}.md)`
    const description = rule.description || "(no description)"
    return `| ${link} | ${description} | ${mark} |`
}

/**
 * Render a given rule as a table row.
 * @param {RuleInfo} rule The rule information.
 * @returns {string} The table row.
 */
function renderDeprecatedRule(rule) {
    const link = `[${rule.id}](./docs/rules/${rule.name}.md)`
    const replacedBy = rule.replacedBy
        .map(nameRaw => {
            const name = nameRaw.replace(/^node[/]/u, "")
            return `[node/${name}](./docs/rules/${name}.md)`
        })
        .join(" and ")

    return `| ${link} | ${replacedBy || "(nothing)"} |`
}

/**
 * Render a given category as a section.
 * @param {CategoryInfo} category The rule information.
 * @returns {string} The section.
 */
function renderCategory(category) {
    return `### ${category.id}

| Rule ID | Description |    |
|:--------|:------------|:--:|
${category.rules.map(renderRule).join("\n")}
`
}

const filePath = path.resolve(__dirname, "../README.md")
const content = `${categories.map(renderCategory).join("\n")}
### Deprecated rules

These rules have been deprecated in accordance with the [deprecation policy](https://eslint.org/docs/user-guide/rule-deprecation), and replaced by newer rules:

| Rule ID | Replaced by |
|:--------|:------------|
${rules
    .filter(rule => rule.deprecated)
    .map(renderDeprecatedRule)
    .join("\n")}
`

fs.writeFileSync(
    filePath,
    fs
        .readFileSync(filePath, "utf8")
        .replace(
            /<!--RULES_TABLE_START-->[\s\S]*<!--RULES_TABLE_END-->/u,
            `<!--RULES_TABLE_START-->\n${content}\n<!--RULES_TABLE_END-->`
        )
)
