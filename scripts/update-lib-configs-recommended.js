/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const fs = require("fs")
const path = require("path")
const { rules } = require("./rules")

const filePath = path.resolve(__dirname, "../lib/configs/recommended.json")
const config = {
    parserOptions: {
        ecmaVersion: 2019,
    },
    env: {
        es6: true,
        node: true,
    },
    globals: {
        Atomics: false,
        SharedArrayBuffer: false,
    },
    rules: rules.filter(rule => !rule.deprecated).reduce(
        (obj, rule) => {
            obj[rule.id] = rule.recommended ? "error" : "off"
            return obj
        },
        { "no-process-exit": "error" }
    ),
}

fs.writeFileSync(filePath, JSON.stringify(config, null, 4))
