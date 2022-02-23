const { execSync } = require("child_process")

execSync(
    "esbuild --platform=node --external:builtins --bundle node_modules/import-meta-resolve/lib/resolve.js > lib/converted-esm/import-meta-resolve.js",
    { shell: true }
)
