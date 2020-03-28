# node/no-process-exit
> disallow the use of `process.exit()`

The `process.exit()` method in Node.js is used to immediately stop the Node.js process and exit. This is a dangerous operation because it can occur in any method at any point in time, potentially stopping a Node.js application completely when an error occurs. For example:

```js
if (somethingBadHappened) {
    console.error("Something bad happened!");
    process.exit(1);
}
```

This code could appear in any module and will stop the entire application when `somethingBadHappened` is truthy. This doesn't give the application any chance to respond to the error. It's usually better to throw an error and allow the application to handle it appropriately:

```js
if (somethingBadHappened) {
    throw new Error("Something bad happened!");
}
```

By throwing an error in this way, other parts of the application have an opportunity to handle the error rather than stopping the application altogether. If the error bubbles all the way up to the process without being handled, then the process will exit and a non-zero exit code will returned, so the end result is the same.

If you are using `process.exit()` only for specifying the exit code, you can set [`process.exitCode`](https://nodejs.org/api/process.html#process_process_exitcode) (introduced in Node.js 0.11.8) instead.

## 📖 Rule Details

This rule aims to prevent the use of `process.exit()` in Node.js JavaScript. As such, it warns whenever `process.exit()` is found in code.

Examples of **incorrect** code for this rule:

```js
/*eslint node/no-process-exit: "error"*/

process.exit(1);
process.exit(0);
```

Examples of **correct** code for this rule:

```js
/*eslint node/no-process-exit: "error"*/

Process.exit();
var exit = process.exit;
```

## 🔎 Implementation

- [Rule source](../../lib/rules/no-process-exit.js)
- [Test source](../../tests/lib/rules/no-process-exit.js)
