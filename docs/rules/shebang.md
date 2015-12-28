# Suggest correct usage of shebang (node/shebang)

When we make a CLI tool on Node.js, we add `bin` field to `package.json`, then we add a shebang the entry file.
This rule suggests correct usage of shebang.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule looks up `package.json` file from each linitng target file.
Starting from the directory of the target file, it goes up ancestor directories until found.

If `package.json` was not found, this rule does nothing.

This rule checks `bin` field of `package.json`, then if a target file matches one of `bin` files, it checks whether or not there is a correct shebang.
Otherwise it checks whether or not there is not a shebang.

The following patterns are considered problems for files in `bin` field of `package.json`:

```js
console.log("hello"); /*error This file needs shebang "#!/usr/bin/env node".*/
```

The following patterns are considered problems for other files:

```js
#!/usr/bin/env node   /*error This file needs no shebang.*/
console.log("hello");
```

The following patterns are considered not problems for files in `bin` field of `package.json`:

```js
#!/usr/bin/env node
console.log("hello");
```

The following patterns are considered not problems for other files:

```js
console.log("hello");
```

### Options

```json
{
    "node/shebang": [2, {"convertBinPath": null}]
}
```

- `convertBinPath` (`null | string[]`) - Configure to convert `bin` paths.
  The purpose of this option is to handle source codes which are transpiled.
  The value is two strings, the first is a convert source, the second is a convert result.
  For example:

  ```json
  {
      "node/shebang": [2, {"convertBinPath": ["bin", "src/bin"]}]
  }
  ```

  Then if a `bin` path is `./bin/index.js`, this rule handles `./src/bin/index.js` as a `bin` file.

## When Not To Use It

If you don't want to be notified about usage of shebang, then it's safe to disable this rule.
