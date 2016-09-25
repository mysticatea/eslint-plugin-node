# Make the same code path as throw at `process.exit()` (process-exit-as-throw)

## Rule Details

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

## Option

Nothing.

## Related Rules

- [consistent-return]
- [no-fallthrough]
- [no-unreachable]

[consistent-return]: http://eslint.org/docs/rules/consistent-return
[no-fallthrough]: http://eslint.org/docs/rules/no-fallthrough
[no-unreachable]: http://eslint.org/docs/rules/no-unreachable
