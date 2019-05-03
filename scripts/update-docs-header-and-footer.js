/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const fs = require("fs")
const path = require("path")
const { rules } = require("./rules")
const headerPattern = /^#.+\n(?:>.+\n)*\n+/u
const footerPattern = /\n+## 🔎 Implementation[\s\S]*$/u
const ruleRoot = path.resolve(__dirname, "../lib/rules")
const testRoot = path.resolve(__dirname, "../tests/lib/rules")
const docsRoot = path.resolve(__dirname, "../docs/rules")
const listFormatter = new Intl.ListFormat("en", { type: "conjunction" })

/** @typedef {import("./rules").RuleInfo} RuleInfo */

/**
 * Render the document header of a given rule.
 * @param {RuleInfo} rule The rule information.
 * @returns {string} The document header.
 */
function renderHeader(rule) {
    const lines = [`# ${rule.id}`, `> ${rule.description}`]

    if (rule.recommended) {
        lines.push(
            "> - ⭐️ This rule is included in `plugin:node/recommended` preset."
        )
    }
    if (rule.fixable) {
        lines.push(
            "> - ✒️ The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule."
        )
    }
    if (rule.deprecated) {
        const replace = rule.replacedBy.map(
            ruleId => `[${ruleId}](./${ruleId.replace("node/", "")}.md)`
        )
        const replaceText =
            replace.length === 0
                ? ""
                : ` Use ${listFormatter.format(replace)} instead.`
        lines.push(`> - ⛔ This rule has been deprecated.${replaceText}`)
    }
    lines.push("", "")

    return lines.join("\n")
}

/**
 * Render the document header of a given rule.
 * @param {RuleInfo} rule The rule information.
 * @returns {string} The document header.
 */
function renderFooter(rule) {
    const docsPath = path.dirname(path.resolve(docsRoot, `${rule.name}.md`))
    const rulePath = path
        .relative(docsPath, path.join(ruleRoot, `${rule.name}.js`))
        .replace(/\\/gu, "/")
    const testPath = path
        .relative(docsPath, path.join(testRoot, `${rule.name}.js`))
        .replace(/\\/gu, "/")

    return `\n\n## 🔎 Implementation\n\n- [Rule source](${rulePath})\n- [Test source](${testPath})`
}

for (const rule of rules) {
    const filePath = path.resolve(docsRoot, `${rule.name}.md`)
    const original = fs.readFileSync(filePath, "utf8")
    const body = original.replace(headerPattern, "").replace(footerPattern, "")
    const content = `${renderHeader(rule)}${body}${renderFooter(rule)}\n`

    fs.writeFileSync(filePath, content)
}
