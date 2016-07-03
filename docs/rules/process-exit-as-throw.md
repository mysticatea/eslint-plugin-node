# Make the same code path as throw at `process.exit()` (process-exit-as-throw)

**Experimental:** This rule is an experimental thing. This may be changed without major bump in future.

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

## When Not To Use It

If you don't want to address `process.exit()` as throw in code path analysis, then it's safe to disable this rule.

[consistent-return]: http://eslint.org/docs/rules/consistent-return
