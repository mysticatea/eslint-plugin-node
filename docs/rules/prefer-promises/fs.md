# Enforce `require("fs").promises` (`n/prefer-promises/fs`)

<!-- end auto-generated rule header -->

Since Node.js v11.14.0, `require("fs").promises` API has been stable.
Promise API and `async`/`await` syntax will make code more readable than callback API.

## 📖 Rule Details

This rule disallows callback API in favor of promise API.

Examples of 👎 **incorrect** code for this rule:

```js
/*eslint n/prefer-promises/fs: [error]*/
const fs = require("fs")

function readData(filePath) {
    fs.readFile(filePath, "utf8", (error, content) => {
        //...
    })
}
```

```js
/*eslint n/prefer-promises/fs: [error]*/
import fs from "fs"

function readData(filePath) {
    fs.readFile(filePath, "utf8", (error, content) => {
        //...
    })
}
```

Examples of 👍 **correct** code for this rule:

```js
/*eslint n/prefer-promises/fs: [error]*/
const { promises: fs } = require("fs")

async function readData(filePath) {
    const content = await fs.readFile(filePath, "utf8")
    //...
}
```

```js
/*eslint n/prefer-promises/fs: [error]*/
import { promises as fs } from "fs"

async function readData(filePath) {
    const content = await fs.readFile(filePath, "utf8")
    //...
}
```

## 🔎 Implementation

- [Rule source](../../../lib/rules/prefer-promises/fs.js)
- [Test source](../../../tests/lib/rules/prefer-promises/fs.js)
