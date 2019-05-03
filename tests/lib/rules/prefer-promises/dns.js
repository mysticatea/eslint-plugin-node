/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/prefer-promises/dns")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("prefer-promises/dns", rule, {
    valid: [
        "const dns = require('dns'); dns.lookupSync()",
        "const dns = require('dns'); dns.promises.lookup()",
        "const {promises} = require('dns'); promises.lookup()",
        "const {promises: dns} = require('dns'); dns.lookup()",
        "const {promises: {lookup}} = require('dns'); lookup()",
        "import dns from 'dns'; dns.promises.lookup()",
        "import * as dns from 'dns'; dns.promises.lookup()",
        "import {promises} from 'dns'; promises.lookup()",
        "import {promises as dns} from 'dns'; dns.lookup()",
    ],
    invalid: [
        {
            code: "const dns = require('dns'); dns.lookup()",
            errors: [{ messageId: "preferPromises", data: { name: "lookup" } }],
        },
        {
            code: "const {lookup} = require('dns'); lookup()",
            errors: [{ messageId: "preferPromises", data: { name: "lookup" } }],
        },
        {
            code: "import dns from 'dns'; dns.lookup()",
            errors: [{ messageId: "preferPromises", data: { name: "lookup" } }],
        },
        {
            code: "import * as dns from 'dns'; dns.lookup()",
            errors: [{ messageId: "preferPromises", data: { name: "lookup" } }],
        },
        {
            code: "import {lookup} from 'dns'; lookup()",
            errors: [{ messageId: "preferPromises", data: { name: "lookup" } }],
        },

        // Other members
        {
            code: "const dns = require('dns'); dns.lookupService()",
            errors: [
                {
                    messageId: "preferPromises",
                    data: { name: "lookupService" },
                },
            ],
        },
        {
            code: "const dns = require('dns'); new dns.Resolver()",
            errors: [
                { messageId: "preferPromisesNew", data: { name: "Resolver" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.getServers()",
            errors: [
                { messageId: "preferPromises", data: { name: "getServers" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.resolve()",
            errors: [
                { messageId: "preferPromises", data: { name: "resolve" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.resolve4()",
            errors: [
                { messageId: "preferPromises", data: { name: "resolve4" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.resolve6()",
            errors: [
                { messageId: "preferPromises", data: { name: "resolve6" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.resolveAny()",
            errors: [
                { messageId: "preferPromises", data: { name: "resolveAny" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.resolveCname()",
            errors: [
                { messageId: "preferPromises", data: { name: "resolveCname" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.resolveMx()",
            errors: [
                { messageId: "preferPromises", data: { name: "resolveMx" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.resolveNaptr()",
            errors: [
                { messageId: "preferPromises", data: { name: "resolveNaptr" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.resolveNs()",
            errors: [
                { messageId: "preferPromises", data: { name: "resolveNs" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.resolvePtr()",
            errors: [
                { messageId: "preferPromises", data: { name: "resolvePtr" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.resolveSoa()",
            errors: [
                { messageId: "preferPromises", data: { name: "resolveSoa" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.resolveSrv()",
            errors: [
                { messageId: "preferPromises", data: { name: "resolveSrv" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.resolveTxt()",
            errors: [
                { messageId: "preferPromises", data: { name: "resolveTxt" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.reverse()",
            errors: [
                { messageId: "preferPromises", data: { name: "reverse" } },
            ],
        },
        {
            code: "const dns = require('dns'); dns.setServers()",
            errors: [
                { messageId: "preferPromises", data: { name: "setServers" } },
            ],
        },
    ],
})
