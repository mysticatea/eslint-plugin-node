/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const fs = require("fs")
const path = require("path")
const { rules } = require("./rules")
const footerPattern = /\n+## 🔎 Implementation[\s\S]*$/u
const ruleRoot = path.resolve(__dirname, "../lib/rules")
const testRoot = path.resolve(__dirname, "../tests/lib/rules")
const docsRoot = path.resolve(__dirname, "../docs/rules")

/** @typedef {import("./rules").RuleInfo} RuleInfo */

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
    const body = original.replace(footerPattern, "")
    const content = `${body}${renderFooter(rule)}\n`

    fs.writeFileSync(filePath, content)
}
