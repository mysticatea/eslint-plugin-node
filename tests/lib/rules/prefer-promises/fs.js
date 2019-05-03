/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/prefer-promises/fs")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("prefer-promises/fs", rule, {
    valid: [
        "const fs = require('fs'); fs.createReadStream()",
        "const fs = require('fs'); fs.accessSync()",
        "const fs = require('fs'); fs.promises.access()",
        "const {promises} = require('fs'); promises.access()",
        "const {promises: fs} = require('fs'); fs.access()",
        "const {promises: {access}} = require('fs'); access()",
        "import fs from 'fs'; fs.promises.access()",
        "import * as fs from 'fs'; fs.promises.access()",
        "import {promises} from 'fs'; promises.access()",
        "import {promises as fs} from 'fs'; fs.access()",
    ],
    invalid: [
        {
            code: "const fs = require('fs'); fs.access()",
            errors: [{ messageId: "preferPromises", data: { name: "access" } }],
        },
        {
            code: "const {access} = require('fs'); access()",
            errors: [{ messageId: "preferPromises", data: { name: "access" } }],
        },
        {
            code: "import fs from 'fs'; fs.access()",
            errors: [{ messageId: "preferPromises", data: { name: "access" } }],
        },
        {
            code: "import * as fs from 'fs'; fs.access()",
            errors: [{ messageId: "preferPromises", data: { name: "access" } }],
        },
        {
            code: "import {access} from 'fs'; access()",
            errors: [{ messageId: "preferPromises", data: { name: "access" } }],
        },

        // Other members
        {
            code: "const fs = require('fs'); fs.copyFile()",
            errors: [
                { messageId: "preferPromises", data: { name: "copyFile" } },
            ],
        },
        {
            code: "const fs = require('fs'); fs.open()",
            errors: [{ messageId: "preferPromises", data: { name: "open" } }],
        },
        {
            code: "const fs = require('fs'); fs.rename()",
            errors: [{ messageId: "preferPromises", data: { name: "rename" } }],
        },
        {
            code: "const fs = require('fs'); fs.truncate()",
            errors: [
                { messageId: "preferPromises", data: { name: "truncate" } },
            ],
        },
        {
            code: "const fs = require('fs'); fs.rmdir()",
            errors: [{ messageId: "preferPromises", data: { name: "rmdir" } }],
        },
        {
            code: "const fs = require('fs'); fs.mkdir()",
            errors: [{ messageId: "preferPromises", data: { name: "mkdir" } }],
        },
        {
            code: "const fs = require('fs'); fs.readdir()",
            errors: [
                { messageId: "preferPromises", data: { name: "readdir" } },
            ],
        },
        {
            code: "const fs = require('fs');fs.readlink()",
            errors: [
                { messageId: "preferPromises", data: { name: "readlink" } },
            ],
        },
        {
            code: "const fs = require('fs'); fs.symlink()",
            errors: [
                { messageId: "preferPromises", data: { name: "symlink" } },
            ],
        },
        {
            code: "const fs = require('fs'); fs.lstat()",
            errors: [{ messageId: "preferPromises", data: { name: "lstat" } }],
        },
        {
            code: "const fs = require('fs'); fs.stat()",
            errors: [{ messageId: "preferPromises", data: { name: "stat" } }],
        },
        {
            code: "const fs = require('fs'); fs.link()",
            errors: [{ messageId: "preferPromises", data: { name: "link" } }],
        },
        {
            code: "const fs = require('fs'); fs.unlink()",
            errors: [{ messageId: "preferPromises", data: { name: "unlink" } }],
        },
        {
            code: "const fs = require('fs'); fs.chmod()",
            errors: [{ messageId: "preferPromises", data: { name: "chmod" } }],
        },
        {
            code: "const fs = require('fs'); fs.lchmod()",
            errors: [{ messageId: "preferPromises", data: { name: "lchmod" } }],
        },
        {
            code: "const fs = require('fs'); fs.lchown()",
            errors: [{ messageId: "preferPromises", data: { name: "lchown" } }],
        },
        {
            code: "const fs = require('fs'); fs.chown()",
            errors: [{ messageId: "preferPromises", data: { name: "chown" } }],
        },
        {
            code: "const fs = require('fs'); fs.utimes()",
            errors: [{ messageId: "preferPromises", data: { name: "utimes" } }],
        },
        {
            code: "const fs = require('fs'); fs.realpath()",
            errors: [
                { messageId: "preferPromises", data: { name: "realpath" } },
            ],
        },
        {
            code: "const fs = require('fs'); fs.mkdtemp()",
            errors: [
                { messageId: "preferPromises", data: { name: "mkdtemp" } },
            ],
        },
        {
            code: "const fs = require('fs'); fs.writeFile()",
            errors: [
                { messageId: "preferPromises", data: { name: "writeFile" } },
            ],
        },
        {
            code: "const fs = require('fs'); fs.appendFile()",
            errors: [
                { messageId: "preferPromises", data: { name: "appendFile" } },
            ],
        },
        {
            code: "const fs = require('fs'); fs.readFile()",
            errors: [
                { messageId: "preferPromises", data: { name: "readFile" } },
            ],
        },
    ],
})
