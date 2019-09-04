# node/no-callback-literal
> ensure Node.js-style error-first callback pattern is followed

When invoking a callback function which uses the Node.js error-first callback pattern, all of your errors should either use the `Error` class or a subclass of it. It is also acceptable to use `undefined` or `null` if there is no error.

## 📖 Rule Details

When a function is named `cb` or `callback`, then it must be invoked with a first argument that is `undefined`, `null`, an `Error` class, or a subclass or `Error`.

Examples of :-1: **incorrect** code for this rule:

```js
/*eslint node/no-callback-literal: "error" */

cb('this is an error string');
cb({ a: 1 });
callback(0);
```

Examples of :+1: **correct** code for this rule:

```js
/*eslint node/no-callback-literal: "error" */

cb(undefined);
cb(null, 5);
callback(new Error('some error'));
callback(someVariable);
```

### Options

```json
{
    "rules": {
        "node/no-callback-literal": "error"
    }
}
```

## 🔎 Implementation

- [Rule source](../../lib/rules/no-callback-literal.js)
- [Test source](../../tests/lib/rules/no-callback-literal.js)
