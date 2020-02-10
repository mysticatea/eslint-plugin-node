# node/no-buffer-constructor
> disallow use of the Buffer() constructor

In Node.js, the behavior of the `Buffer` constructor is different depending on the type of its argument. Passing an argument from user input to `Buffer()` without validating its type can lead to security vulnerabilities such as remote memory disclosure and denial of service. As a result, the `Buffer` constructor has been deprecated and should not be used. Use the producer methods `Buffer.from`, `Buffer.alloc`, and `Buffer.allocUnsafe` instead.

## 📖 Rule Details

This rule disallows calling and constructing the `Buffer()` constructor.

Examples of **incorrect** code for this rule:

```js
new Buffer(5);
new Buffer([1, 2, 3]);

Buffer(5);
Buffer([1, 2, 3]);

new Buffer(res.body.amount);
new Buffer(res.body.values);
```

Examples of **correct** code for this rule:

```js
Buffer.alloc(5);
Buffer.allocUnsafe(5);
Buffer.from([1, 2, 3]);

Buffer.alloc(res.body.amount);
Buffer.from(res.body.values);
```

## 🔎 Implementation

- [Rule source](../../lib/rules/no-buffer-constructor.js)
- [Test source](../../tests/lib/rules/no-buffer-constructor.js)
