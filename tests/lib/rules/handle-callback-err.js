/**
 * @author Jamund Ferguson
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/handle-callback-err")

const EXPECTED_DECL_ERROR = {
    messageId: "expected",
    type: "FunctionDeclaration",
}
const EXPECTED_FUNC_ERROR = {
    messageId: "expected",
    type: "FunctionExpression",
}

new RuleTester().run("handle-callback-err", rule, {
    valid: [
        "function test(error) {}",
        "function test(err) {console.log(err);}",
        "function test(err, data) {if(err){ data = 'ERROR';}}",
        "var test = function(err) {console.log(err);};",
        "var test = function(err) {if(err){/* do nothing */}};",
        "var test = function(err) {if(!err){doSomethingHere();}else{};}",
        "var test = function(err, data) {if(!err) { good(); } else { bad(); }}",
        "try { } catch(err) {}",
        "getData(function(err, data) {if (err) {}getMoreDataWith(data, function(err, moreData) {if (err) {}getEvenMoreDataWith(moreData, function(err, allOfTheThings) {if (err) {}});});});",
        "var test = function(err) {if(! err){doSomethingHere();}};",
        "function test(err, data) {if (data) {doSomething(function(err) {console.error(err);});} else if (err) {console.log(err);}}",
        "function handler(err, data) {if (data) {doSomethingWith(data);} else if (err) {console.log(err);}}",
        "function handler(err) {logThisAction(function(err) {if (err) {}}); console.log(err);}",
        "function userHandler(err) {process.nextTick(function() {if (err) {}})}",
        "function help() { function userHandler(err) {function tester() { err; process.nextTick(function() { err; }); } } }",
        "function help(done) { var err = new Error('error'); done(); }",
        { code: "var test = err => err;", parserOptions: { ecmaVersion: 6 } },
        { code: "var test = err => !err;", parserOptions: { ecmaVersion: 6 } },
        {
            code: "var test = err => err.message;",
            parserOptions: { ecmaVersion: 6 },
        },
        {
            code: "var test = function(error) {if(error){/* do nothing */}};",
            options: ["error"],
        },
        {
            code: "var test = (error) => {if(error){/* do nothing */}};",
            options: ["error"],
            parserOptions: { ecmaVersion: 6 },
        },
        {
            code:
                "var test = function(error) {if(! error){doSomethingHere();}};",
            options: ["error"],
        },
        {
            code: "var test = function(err) { console.log(err); };",
            options: ["^(err|error)$"],
        },
        {
            code: "var test = function(error) { console.log(error); };",
            options: ["^(err|error)$"],
        },
        {
            code: "var test = function(anyError) { console.log(anyError); };",
            options: ["^.+Error$"],
        },
        {
            code: "var test = function(any_error) { console.log(anyError); };",
            options: ["^.+Error$"],
        },
        {
            code: "var test = function(any_error) { console.log(any_error); };",
            options: ["^.+(e|E)rror$"],
        },
    ],
    invalid: [
        { code: "function test(err) {}", errors: [EXPECTED_DECL_ERROR] },
        { code: "function test(err, data) {}", errors: [EXPECTED_DECL_ERROR] },
        {
            code: "function test(err) {errorLookingWord();}",
            errors: [EXPECTED_DECL_ERROR],
        },
        {
            code: "function test(err) {try{} catch(err) {}}",
            errors: [EXPECTED_DECL_ERROR],
        },
        {
            code:
                "function test(err, callback) { foo(function(err, callback) {}); }",
            errors: [EXPECTED_DECL_ERROR, EXPECTED_FUNC_ERROR],
        },
        {
            code: "var test = (err) => {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "expected" }],
        },
        { code: "var test = function(err) {};", errors: [EXPECTED_FUNC_ERROR] },
        {
            code: "var test = function test(err, data) {};",
            errors: [EXPECTED_FUNC_ERROR],
        },
        {
            code: "var test = function test(err) {/* if(err){} */};",
            errors: [EXPECTED_FUNC_ERROR],
        },
        {
            code:
                "function test(err) {doSomethingHere(function(err){console.log(err);})}",
            errors: [EXPECTED_DECL_ERROR],
        },
        {
            code: "function test(error) {}",
            options: ["error"],
            errors: [EXPECTED_DECL_ERROR],
        },
        {
            code:
                "getData(function(err, data) {getMoreDataWith(data, function(err, moreData) {if (err) {}getEvenMoreDataWith(moreData, function(err, allOfTheThings) {if (err) {}});}); });",
            errors: [EXPECTED_FUNC_ERROR],
        },
        {
            code:
                "getData(function(err, data) {getMoreDataWith(data, function(err, moreData) {getEvenMoreDataWith(moreData, function(err, allOfTheThings) {if (err) {}});}); });",
            errors: [EXPECTED_FUNC_ERROR, EXPECTED_FUNC_ERROR],
        },
        {
            code:
                "function userHandler(err) {logThisAction(function(err) {if (err) { console.log(err); } })}",
            errors: [EXPECTED_DECL_ERROR],
        },
        {
            code:
                "function help() { function userHandler(err) {function tester(err) { err; process.nextTick(function() { err; }); } } }",
            errors: [EXPECTED_DECL_ERROR],
        },
        {
            code: "var test = function(anyError) { console.log(otherError); };",
            options: ["^.+Error$"],
            errors: [EXPECTED_FUNC_ERROR],
        },
        {
            code: "var test = function(anyError) { };",
            options: ["^.+Error$"],
            errors: [EXPECTED_FUNC_ERROR],
        },
        {
            code: "var test = function(err) { console.log(error); };",
            options: ["^(err|error)$"],
            errors: [EXPECTED_FUNC_ERROR],
        },
    ],
})
