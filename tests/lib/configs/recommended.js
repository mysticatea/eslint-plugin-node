"use strict"

const assert = require("assert")
const path = require("path")
const { ESLint } = require("eslint")
const originalCwd = process.cwd()

describe("node/recommended config", () => {
    describe("in CJS directory", () => {
        const root = path.resolve(__dirname, "../../fixtures/configs/cjs/")

        /** @type {Linter} */
        let linter = null

        beforeEach(() => {
            process.chdir(root)
            linter = new ESLint({
                baseConfig: { extends: "plugin:@weiran.zsd/node/recommended" },
                useEslintrc: false,
            })
        })

        afterEach(() => {
            process.chdir(originalCwd)
        })

        it("*.js files should be a script.", async () => {
            const report = await linter.lintText(
                "import 'foo'",
                {filePath: path.join(root, "test.js")}
                
            )

            assert.deepStrictEqual(report[0].messages, [
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

        it("*.cjs files should be a script.", async () => {
            const report = await linter.lintText(
                "import 'foo'",
                {filePath: path.join(root, "test.cjs")}
            )

            assert.deepStrictEqual(report[0].messages, [
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

        it("*.mjs files should be a module.", async () => {
            const report = await linter.lintText(
                "import 'foo'",
                {filePath: path.join(root, "test.mjs")}
                
            )

            assert.deepStrictEqual(report[0].messages, [
                {
                    column: 8,
                    endColumn: 13,
                    endLine: 1,
                    line: 1,
                    message: '"foo" is not found.',
                    nodeType: "Literal",
                    ruleId: "@weiran.zsd/node/no-missing-import",
                    severity: 2,
                },
            ])
        })
    })

    describe("in ESM directory", () => {
        const root = path.resolve(__dirname, "../../fixtures/configs/esm/")

        /** @type {Linter} */
        let linter = null

        beforeEach(() => {
            process.chdir(root)
            linter = new ESLint({
                baseConfig: { extends: "plugin:@weiran.zsd/node/recommended" },
                useEslintrc: false,
            })
        })

        afterEach(() => {
            process.chdir(originalCwd)
        })

        it("*.js files should be a module.", async () => {
            const report = await linter.lintText(
                "import 'foo'",
                {filePath: path.join(root, "test.js")}
                
            )

            assert.deepStrictEqual(report[0].messages, [
                {
                    column: 8,
                    endColumn: 13,
                    endLine: 1,
                    line: 1,
                    message: '"foo" is not found.',
                    nodeType: "Literal",
                    ruleId: "@weiran.zsd/node/no-missing-import",
                    severity: 2,
                },
            ])
        })

        it("*.cjs files should be a script.", async () => {
            const report = await linter.lintText(
                "import 'foo'",
                {filePath: path.join(root, "test.cjs")}
                
            )

            assert.deepStrictEqual(report[0].messages, [
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

        it("*.mjs files should be a module.", async () => {
            const report = await linter.lintText(
                "import 'foo'",
                {filePath: path.join(root, "test.mjs")}
                
            )

            assert.deepStrictEqual(report[0].messages, [
                {
                    column: 8,
                    endColumn: 13,
                    endLine: 1,
                    line: 1,
                    message: '"foo" is not found.',
                    nodeType: "Literal",
                    ruleId: "@weiran.zsd/node/no-missing-import",
                    severity: 2,
                },
            ])
        })
    })
})
