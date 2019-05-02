"use strict"

const assert = require("assert")
const path = require("path")
const { CLIEngine } = require("eslint")
const originalCwd = process.cwd()

describe("node/recommended config", () => {
    describe("in CJS directory", () => {
        const root = path.resolve(__dirname, "../../fixtures/configs/cjs/")

        /** @type {CLIEngine} */
        let engine = null

        beforeEach(() => {
            process.chdir(root)
            engine = new CLIEngine({
                baseConfig: { extends: "plugin:node/recommended" },
                useEslintrc: false,
            })
        })

        afterEach(() => {
            process.chdir(originalCwd)
        })

        it("*.js files should be a script.", () => {
            const report = engine.executeOnText(
                "import 'foo'",
                path.join(root, "test.js")
            )

            assert.deepStrictEqual(report.results[0].messages, [
                {
                    column: 1,
                    fatal: true,
                    line: 1,
                    message:
                        "Parsing error: 'import' and 'export' may appear only with 'sourceType: module'",
                    ruleId: null,
                    severity: 2,
                },
            ])
        })

        it("*.cjs files should be a script.", () => {
            const report = engine.executeOnText(
                "import 'foo'",
                path.join(root, "test.cjs")
            )

            assert.deepStrictEqual(report.results[0].messages, [
                {
                    column: 1,
                    fatal: true,
                    line: 1,
                    message:
                        "Parsing error: 'import' and 'export' may appear only with 'sourceType: module'",
                    ruleId: null,
                    severity: 2,
                },
            ])
        })

        it("*.mjs files should be a module.", () => {
            const report = engine.executeOnText(
                "import 'foo'",
                path.join(root, "test.mjs")
            )

            assert.deepStrictEqual(report.results[0].messages, [
                {
                    column: 8,
                    endColumn: 13,
                    endLine: 1,
                    line: 1,
                    message: '"foo" is not found.',
                    nodeType: "Literal",
                    ruleId: "node/no-missing-import",
                    severity: 2,
                },
            ])
        })
    })

    describe("in ESM directory", () => {
        const root = path.resolve(__dirname, "../../fixtures/configs/esm/")

        /** @type {CLIEngine} */
        let engine = null

        beforeEach(() => {
            process.chdir(root)
            engine = new CLIEngine({
                baseConfig: { extends: "plugin:node/recommended" },
                useEslintrc: false,
            })
        })

        afterEach(() => {
            process.chdir(originalCwd)
        })

        it("*.js files should be a module.", () => {
            const report = engine.executeOnText(
                "import 'foo'",
                path.join(root, "test.js")
            )

            assert.deepStrictEqual(report.results[0].messages, [
                {
                    column: 8,
                    endColumn: 13,
                    endLine: 1,
                    line: 1,
                    message: '"foo" is not found.',
                    nodeType: "Literal",
                    ruleId: "node/no-missing-import",
                    severity: 2,
                },
            ])
        })

        it("*.cjs files should be a script.", () => {
            const report = engine.executeOnText(
                "import 'foo'",
                path.join(root, "test.cjs")
            )

            assert.deepStrictEqual(report.results[0].messages, [
                {
                    column: 1,
                    fatal: true,
                    line: 1,
                    message:
                        "Parsing error: 'import' and 'export' may appear only with 'sourceType: module'",
                    ruleId: null,
                    severity: 2,
                },
            ])
        })

        it("*.mjs files should be a module.", () => {
            const report = engine.executeOnText(
                "import 'foo'",
                path.join(root, "test.mjs")
            )

            assert.deepStrictEqual(report.results[0].messages, [
                {
                    column: 8,
                    endColumn: 13,
                    endLine: 1,
                    line: 1,
                    message: '"foo" is not found.',
                    nodeType: "Literal",
                    ruleId: "node/no-missing-import",
                    severity: 2,
                },
            ])
        })
    })
})
