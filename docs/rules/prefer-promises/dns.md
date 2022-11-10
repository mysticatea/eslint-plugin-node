# Enforce `require("dns").promises` (`n/prefer-promises/dns`)

<!-- end auto-generated rule header -->

Since Node.js v11.14.0, `require("dns").promises` API has been stable.
Promise API and `async`/`await` syntax will make code more readable than callback API.

## 📖 Rule Details

This rule disallows callback API in favor of promise API.

Examples of 👎 **incorrect** code for this rule:

```js
/*eslint n/prefer-promises/dns: [error]*/
const dns = require("dns")

function lookup(hostname) {
    dns.lookup(hostname, (error, address, family) => {
        //...
    })
}
```

```js
/*eslint n/prefer-promises/dns: [error]*/
import dns from "dns"

function lookup(hostname) {
    dns.lookup(hostname, (error, address, family) => {
        //...
    })
}
```

Examples of 👍 **correct** code for this rule:

```js
/*eslint n/prefer-promises/dns: [error]*/
const { promises: dns } = require("dns")

async function lookup(hostname) {
    const { address, family } = await dns.lookup(hostname)
    //...
}
```

```js
/*eslint n/prefer-promises/dns: [error]*/
import { promises as dns } from "dns"

async function lookup(hostname) {
    const { address, family } = await dns.lookup(hostname)
    //...
}
```

## 🔎 Implementation

- [Rule source](../../../lib/rules/prefer-promises/dns.js)
- [Test source](../../../tests/lib/rules/prefer-promises/dns.js)
