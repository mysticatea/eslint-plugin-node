# Require that `process.exit()` expressions use the same code path as `throw` (`n/process-exit-as-throw`)

💼 This rule is enabled in the following configs: ✅ `recommended`, ☑️ `recommended-module`, ✔️ `recommended-script`.

<!-- end auto-generated rule header -->

## 📖 Rule Details

```js
function foo(a) {
    if (a) {
        return new Bar();
    } else {
        process.exit(1);
    }
}
```

ESLint does not address `process.exit()` as stop in code path analysis, then [consistent-return] rule will warn the above code.

If you turn this rule on, ESLint comes to address `process.exit()` as throw in code path analysis. So, above code will get expected code path.

This rule itself never warn code.

## 📚 Related Rules

- [consistent-return]
- [no-fallthrough]
- [no-unreachable]

[consistent-return]: http://eslint.org/docs/rules/consistent-return
[no-fallthrough]: http://eslint.org/docs/rules/no-fallthrough
[no-unreachable]: http://eslint.org/docs/rules/no-unreachable

## 🔎 Implementation

- [Rule source](../../lib/rules/process-exit-as-throw.js)
- [Test source](../../tests/lib/rules/process-exit-as-throw.js)
