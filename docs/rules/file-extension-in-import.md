# Enforce the style of file extensions in `import` declarations (`n/file-extension-in-import`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

We can omit file extensions in `import`/`export` declarations.

```js
import foo from "./path/to/a/file" // maybe it's resolved to 'file.js' or 'file.json'
export * from "./path/to/a/file"
```

However, [--experimental-modules](https://medium.com/@nodejs/announcing-a-new-experimental-modules-1be8d2d6c2ff) has declared to drop the file extension omition.

Also, we can import a variety kind of files with bundlers such as Webpack. In the situation, probably explicit file extensions help us to understand code.

## 📖 Rule Details

This rule enforces the style of file extensions in `import`/`export` declarations.

### Options

This rule has a string option and an object option.

```json
{
    "n/file-extension-in-import": [
        "error",
        "always" or "never",
        {
            ".xxx": "always" or "never",
        }
    ]
}
```

- `"always"` (default) requires file extensions in `import`/`export` declarations.
- `"never"` disallows file extensions in `import`/`export` declarations.
- `.xxx` is the overriding setting for specific file extensions. You can use arbitrary property names which start with `.`.

#### always

Examples of 👎 **incorrect** code for the `"always"` option:

```js
/*eslint n/file-extension-in-import: ["error", "always"]*/

import foo from "./path/to/a/file"
```

Examples of 👍 **correct** code for the `"always"` option:

```js
/*eslint n/file-extension-in-import: ["error", "always"]*/

import eslint from "eslint"
import foo from "./path/to/a/file.js"
```

#### never

Examples of 👎 **incorrect** code for the `"never"` option:

```js
/*eslint n/file-extension-in-import: ["error", "never"]*/

import foo from "./path/to/a/file.js"
```

Examples of 👍 **correct** code for the `"never"` option:

```js
/*eslint n/file-extension-in-import: ["error", "never"]*/

import eslint from "eslint"
import foo from "./path/to/a/file"
```

#### .xxx

Examples of 👍 **correct** code for the `["always", { ".js": "never" }]` option:

```js
/*eslint n/file-extension-in-import: ["error", "always", { ".js": "never" }]*/

import eslint from "eslint"
import script from "./script"
import styles from "./styles.css"
import logo from "./logo.png"
```

## 🔎 Implementation

- [Rule source](../../lib/rules/file-extension-in-import.js)
- [Test source](../../tests/lib/rules/file-extension-in-import.js)
