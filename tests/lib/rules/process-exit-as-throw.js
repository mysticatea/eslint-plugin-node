/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

/*eslint-env mocha */

const assert = require("assert")
const eslint = require("eslint")
const rule = require("../../../lib/rules/process-exit-as-throw")

const supported = rule.meta.supported

describe("process-exit-as-throw", () => {
    let linter = eslint.linter

    beforeEach(() => {
        if (eslint.Linter != null) {
            linter = new eslint.Linter()
        } else {
            linter.reset()
        }
        linter.defineRule("process-exit-as-throw", rule)
    })
    ;(supported ? it : xit)(
        "should get unreachable error after 'process.exit()'.",
        () => {
            const code = ["foo();", "process.exit(1);", "bar();"].join("\n")

            const options = {
                rules: {
                    "no-unreachable": "error",
                    "process-exit-as-throw": "error",
                },
            }

            const messages = linter.verify(code, options)

            assert.strictEqual(messages.length, 1)
            assert.strictEqual(messages[0].message, "Unreachable code.")
            assert.strictEqual(messages[0].line, 3)
        }
    )
    ;(supported ? it : xit)(
        "should get no unreachable error after 'process.exit()' if this rule is turned off.",
        () => {
            const code = ["foo();", "process.exit(1);", "bar();"].join("\n")

            const options = {
                rules: {
                    "no-unreachable": "error",
                    "process-exit-as-throw": "off",
                },
            }

            const messages = linter.verify(code, options)

            assert.strictEqual(messages.length, 0)
        }
    )
    ;(supported ? it : xit)(
        "should get no consistent-return error after 'process.exit()'.",
        () => {
            const code = [
                "function foo() {",
                "    if (a) {",
                "        return 1;",
                "    } else {",
                "        process.exit(1);",
                "    }",
                "}",
            ].join("\n")

            const options = {
                rules: {
                    "consistent-return": "error",
                    "process-exit-as-throw": "error",
                },
            }

            const messages = linter.verify(code, options)

            assert.strictEqual(messages.length, 0)
        }
    )
})
