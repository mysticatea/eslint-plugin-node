"use strict"

const getPackageJson = require("../util/get-package-json.js")
const moduleConfig = require("./recommended-module.js")
const scriptConfig = require("./recommended-script.js")

module.exports = () => {
    const packageJson = getPackageJson()
    const isModule = (packageJson && packageJson.type) === "module"

    return {
        ...(isModule ? moduleConfig : scriptConfig),
        overrides: [
            { files: ["*.cjs", ".*.cjs"], ...scriptConfig },
            { files: ["*.mjs", ".*.mjs"], ...moduleConfig },
        ],
    }
}
