# Suggest correct usage of shebang (node/shebang)

When we make a CLI tool on Node.js, we add `bin` field to `package.json`, then we add a shebang the entry file.
This rule suggests correct usage of shebang.

## Rule Details

This rule looks up `package.json` file from each linitng target file.
Starting from the directory of the target file, it goes up ancestor directories until found.

If `package.json` was not found, this rule does nothing.

This rule checks `bin` field of `package.json`, then if a target file matches one of `bin` files, it checks whether or not there is a correct shebang.
Otherwise it checks whether or not there is not a shebang.

### For files in `bin` field of `package.json`:

The following patterns are considered problems:

```js
console.log("hello"); /*error This file needs shebang "#!/usr/bin/env node".*/
```

The following patterns are considered not problems:

```js
#!/usr/bin/env node
console.log("hello");
```

### For other files:

The following patterns are considered problems:

```js
#!/usr/bin/env node   /*error This file needs no shebang.*/
console.log("hello");
```

The following patterns are considered not problems:

```js
console.log("hello");
```

## When Not To Use It

If you don't want to be notified about usage of shebang, then it's safe to disable this rule.
