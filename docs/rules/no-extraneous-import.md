# Disallow `import` declarations which import extraneous modules (no-extraneous-import)

If a `import` declaration's source is extraneous (it's not written in `package.json`), the program works in local, but will not work after dependencies are re-installed. It will cause troubles to your team/contributors.
This rule disallows `import` declarations of extraneous modules.

## Rule Details

This rule warns `import` declarations of extraneous modules.

## Options

```json
{
    "rules": {
        "node/no-extraneous-import": ["error", {
            "allowModules": []
        }]
    }
}
```

### allowModules

Some platforms have additional embedded modules.
For example, Electron has `electron` module.

We can specify additional embedded modules with this option.
This option is an array of strings as module names.

```json
{
    "rules": {
        "node/no-extraneous-import": ["error", {
            "allowModules": ["electron"]
        }]
    }
}
```

## Shared Settings

The following options can be set by [shared settings](http://eslint.org/docs/user-guide/configuring.html#adding-shared-settings).
Several rules have the same option, but we can set this option at once.

- `allowModules`

For Example:

```json
{
    "settings": {
        "node": {
            "allowModules": ["electron"]
        }
    },
    "rules": {
        "node/no-extraneous-import": "error"
    }
}
```
