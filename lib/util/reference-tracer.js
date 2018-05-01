/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const getValueIfString = require("../util/get-value-if-string")

const READ = Symbol("read")
const CALL = Symbol("call")
const CONSTRUCT = Symbol("construct")
const ESM = Symbol("esm")
const SENTINEL_TYPE = /^(?:.+?Statement|.+?Declaration|(?:Array|ArrowFunction|Assignment|Call|Class|Function|Member|New|Object)Expression|AssignmentPattern|Program|VariableDeclarator)$/
const IMPORT_TYPE = /^(?:Import|Export(?:All|Default|Named))Declaration$/
const has = Function.call.bind(Object.hasOwnProperty)

/**
 * Gets the property name from a MemberExpression node or a Property node.
 *
 * @param {ASTNode} node - A node to get.
 * @returns {string|null} The property name of the node.
 */
function getPropertyName(node) {
    switch (node.type) {
        case "MemberExpression":
            if (node.computed) {
                return getValueIfString(node.property)
            }
            return node.property.name

        case "Property":
            if (node.computed) {
                return getValueIfString(node.key)
            }
            if (node.key.type === "Literal") {
                return String(node.key.value)
            }
            return node.key.name

        // no default
    }

    /* istanbul ignore next: unreachable */
    return null
}

/**
 * Get the innermost scope which contains a given location.
 * @param {escope.Scope} initialScope The initial scope to search.
 * @param {number} location The location to search.
 * @returns {escope.Scope} The innermost scope.
 */
function getInnermostScope(initialScope, location) {
    let scope = initialScope
    while (scope.childScopes.length !== 0) {
        for (const childScope of scope.childScopes) {
            const range = childScope.block.range

            if (range[0] <= location && location < range[1]) {
                scope = childScope
                break
            }
        }
    }
    return scope
}

/**
 * Iterate all entry of a given trace map.
 * @param {Node} node The AST node to report.
 * @param {string[]} path The current path.
 * @param {object} traceMap The trace map.
 * @returns {IterableIterator<{node:Node,path:string[],type:symbol,entry:object}>} The iterator to iterate references.
 */
function* iterateAll(node, path, traceMap) {
    for (const key of Object.keys(traceMap)) {
        const nextTraceMap = traceMap[key]

        path.push(key)
        try {
            if (nextTraceMap[READ]) {
                yield { node, path, type: READ, entry: nextTraceMap }
            } else if (nextTraceMap[CALL]) {
                yield { node, path, type: CALL, entry: nextTraceMap }
            } else if (nextTraceMap[CONSTRUCT]) {
                yield { node, path, type: CONSTRUCT, entry: nextTraceMap }
            } else {
                yield* iterateAll(node, path, nextTraceMap)
            }
        } finally {
            path.pop()
        }
    }
}

/**
 * This is a predicate function for Array#filter.
 * @param {string} name A name part.
 * @param {number} index The index of the name.
 * @returns {boolean} `false` if it's default.
 */
function exceptDefault(name, index) {
    return !(index === 1 && name === "default")
}

/**
 * The reference tracer.
 */
class ReferenceTracer {
    /**
     * Initialize this tracer.
     * @param {escope.Scope} globalScope The global scope.
     * @param {"legacy"|"esm"} mode The mode to determine the ImportDeclaration's behavior.
     */
    constructor(globalScope, mode = "legacy") {
        this.variableStack = []
        this.globalScope = globalScope
        this.mode = mode
    }

    /**
     * Iterate the references of global variables.
     * @param {object} traceMap The trace map.
     * @returns {IterableIterator<{node:Node,path:string[],type:symbol,entry:object}>} The iterator to iterate references.
     */
    *iterateGlobalReferences(traceMap) {
        for (const key of Object.keys(traceMap)) {
            const nextTraceMap = traceMap[key]
            const path = [key]
            const variable = this.globalScope.set.get(key)

            if (variable == null || variable.defs.length !== 0) {
                continue
            }

            yield* this._iterateVariableReferences(variable, path, nextTraceMap)
        }
    }

    /**
     * Iterate the references of CommonJS modules.
     * @param {object} traceMap The trace map.
     * @returns {IterableIterator<{node:Node,path:string[],type:symbol,entry:object}>} The iterator to iterate references.
     */
    *iterateCjsReferences(traceMap) {
        const variable = this.globalScope.set.get("require")

        if (variable == null || variable.defs.length !== 0) {
            return
        }

        for (const reference of variable.references) {
            const reqNode = reference.identifier
            const callNode = reqNode.parent

            if (
                !reference.isRead() ||
                callNode.type !== "CallExpression" ||
                callNode.callee !== reqNode
            ) {
                continue
            }
            const key = getValueIfString(callNode.arguments[0])

            if (key == null || !has(traceMap, key)) {
                continue
            }
            const nextTraceMap = traceMap[key]
            const path = [key]

            if (nextTraceMap[READ]) {
                yield { node: callNode, path, type: READ, entry: nextTraceMap }
            } else {
                yield* this._iteratePropertyReferences(
                    callNode,
                    path,
                    nextTraceMap
                )
            }
        }
    }

    /**
     * Iterate the references of ES modules.
     * @param {object} traceMap The trace map.
     * @returns {IterableIterator<{node:Node,path:string[],type:symbol,entry:object}>} The iterator to iterate references.
     */
    *iterateEsmReferences(traceMap) {
        const programNode = this.globalScope.block

        for (const node of programNode.body) {
            if (!IMPORT_TYPE.test(node.type) || node.source == null) {
                continue
            }
            const moduleId = node.source.value

            if (!has(traceMap, moduleId)) {
                continue
            }
            const nextTraceMap = traceMap[moduleId]
            const path = [moduleId]

            if (nextTraceMap[READ]) {
                yield { node, path, type: READ, entry: nextTraceMap }
            } else if (node.type === "ExportAllDeclaration") {
                yield* iterateAll(node, path, nextTraceMap)
            } else {
                for (const specifier of node.specifiers) {
                    const esm = has(nextTraceMap, ESM)
                    const it = this._iterateImportReferences(
                        specifier,
                        path,
                        esm
                            ? nextTraceMap
                            : this.mode === "legacy"
                                ? Object.assign(
                                      { default: nextTraceMap },
                                      nextTraceMap
                                  )
                                : { default: nextTraceMap }
                    )

                    if (esm) {
                        yield* it
                    } else {
                        for (const report of it) {
                            report.path = report.path.filter(exceptDefault)
                            yield report
                        }
                    }
                }
            }
        }
    }

    /**
     * Finds the variable object of a given Identifier node.
     * @param {ASTNode} node - An Identifier node to find.
     * @returns {escope.Variable|null} Found variable object.
     */
    _findVariable(node) {
        let scope = getInnermostScope(this.globalScope, node.range[0])
        while (scope != null) {
            const variable = scope.set.get(node.name)
            if (variable != null) {
                return variable
            }

            scope = scope.upper
        }

        return null
    }

    /**
     * Iterate the references for a given variable.
     * @param {escope.Variable} variable The variable to iterate that references.
     * @param {string[]} path The current path.
     * @param {object} traceMap The trace map.
     * @returns {IterableIterator<{node:Node,path:string[],type:symbol,entry:object}>} The iterator to iterate references.
     */
    *_iterateVariableReferences(variable, path, traceMap) {
        if (this.variableStack.includes(variable)) {
            return
        }
        this.variableStack.push(variable)
        try {
            for (const reference of variable.references) {
                if (!reference.isRead()) {
                    continue
                }
                const node = reference.identifier

                if (traceMap[READ]) {
                    yield { node, path, type: READ, entry: traceMap }
                } else {
                    yield* this._iteratePropertyReferences(node, path, traceMap)
                }
            }
        } finally {
            this.variableStack.pop()
        }
    }

    /**
     * Iterate the references for a given AST node.
     * @param {identifier} rootNode The AST node to iterate references.
     * @param {string[]} path The current path.
     * @param {object} traceMap The trace map.
     * @returns {IterableIterator<{node:Node,path:string[],type:symbol,entry:object}>} The iterator to iterate references.
     */
    //eslint-disable-next-line complexity, require-jsdoc
    *_iteratePropertyReferences(rootNode, path, traceMap) {
        let node = rootNode
        while (!SENTINEL_TYPE.test(node.parent.type)) {
            node = node.parent
        }

        const parent = node.parent
        if (parent.type === "MemberExpression") {
            if (parent.object === node) {
                const key = getPropertyName(parent)
                if (key == null || !has(traceMap, key)) {
                    return
                }

                path.push(key)
                try {
                    const nextTraceMap = traceMap[key]
                    if (nextTraceMap[READ]) {
                        yield {
                            node: parent,
                            path,
                            type: READ,
                            entry: nextTraceMap,
                        }
                    } else {
                        yield* this._iteratePropertyReferences(
                            parent,
                            path,
                            nextTraceMap
                        )
                    }
                } finally {
                    path.pop()
                }
            }
            return
        }
        if (parent.type === "CallExpression") {
            if (parent.callee === node && traceMap[CALL]) {
                yield { node: parent, path, type: CALL, entry: traceMap }
            }
            return
        }
        if (parent.type === "NewExpression") {
            if (parent.callee === node && traceMap[CONSTRUCT]) {
                yield { node: parent, path, type: CONSTRUCT, entry: traceMap }
            }
            return
        }
        if (parent.type === "AssignmentExpression") {
            if (parent.right === node) {
                yield* this._iterateLhsReferences(parent.left, path, traceMap)
                yield* this._iteratePropertyReferences(parent, path, traceMap)
            }
            return
        }
        if (parent.type === "AssignmentPattern") {
            if (parent.right === node) {
                yield* this._iterateLhsReferences(parent.left, path, traceMap)
            }
            return
        }
        if (parent.type === "VariableDeclarator") {
            if (parent.init === node) {
                yield* this._iterateLhsReferences(parent.id, path, traceMap)
            }
        }
    }

    /**
     * Iterate the references for a given Pattern node.
     * @param {identifier} patternNode The Pattern node to iterate references.
     * @param {string[]} path The current path.
     * @param {object} traceMap The trace map.
     * @returns {IterableIterator<{node:Node,path:string[],type:symbol,entry:object}>} The iterator to iterate references.
     */
    *_iterateLhsReferences(patternNode, path, traceMap) {
        if (patternNode.type === "Identifier") {
            const variable = this._findVariable(patternNode)
            if (variable != null) {
                yield* this._iterateVariableReferences(variable, path, traceMap)
            }
            return
        }
        if (patternNode.type === "ObjectPattern") {
            for (const property of patternNode.properties) {
                const key = getPropertyName(property)

                if (key == null || !has(traceMap, key)) {
                    continue
                }

                path.push(key)
                try {
                    const nextTraceMap = traceMap[key]
                    if (nextTraceMap[READ]) {
                        yield {
                            node: property,
                            path,
                            type: READ,
                            entry: nextTraceMap,
                        }
                    } else {
                        yield* this._iterateLhsReferences(
                            property.value,
                            path,
                            nextTraceMap
                        )
                    }
                } finally {
                    path.pop()
                }
            }
            return
        }
        if (patternNode.type === "AssignmentPattern") {
            yield* this._iterateLhsReferences(patternNode.left, path, traceMap)
        }
    }

    /**
     * Iterate the references for a given ModuleSpecifier node.
     * @param {identifier} specifierNode The ModuleSpecifier node to iterate references.
     * @param {string[]} path The current path.
     * @param {object} traceMap The trace map.
     * @returns {IterableIterator<{node:Node,path:string[],type:symbol,entry:object}>} The iterator to iterate references.
     */
    *_iterateImportReferences(specifierNode, path, traceMap) {
        const type = specifierNode.type

        if (type === "ImportSpecifier" || type === "ImportDefaultSpecifier") {
            const key =
                type === "ImportDefaultSpecifier"
                    ? "default"
                    : specifierNode.imported.name
            if (!has(traceMap, key)) {
                return
            }

            path.push(key)
            try {
                const nextTraceMap = traceMap[key]
                if (nextTraceMap[READ]) {
                    yield {
                        node: specifierNode,
                        path,
                        type: READ,
                        entry: nextTraceMap,
                    }
                } else {
                    yield* this._iterateVariableReferences(
                        this._findVariable(specifierNode.local),
                        path,
                        nextTraceMap
                    )
                }
            } finally {
                path.pop()
            }

            return
        }

        if (type === "ImportNamespaceSpecifier") {
            yield* this._iterateVariableReferences(
                this._findVariable(specifierNode.local),
                path,
                traceMap
            )
            return
        }

        if (type === "ExportSpecifier") {
            const key = specifierNode.local.name
            if (!has(traceMap, key)) {
                return
            }

            path.push(key)
            try {
                const nextTraceMap = traceMap[key]
                if (nextTraceMap[READ]) {
                    yield {
                        node: specifierNode.local,
                        path,
                        type: READ,
                        entry: nextTraceMap,
                    }
                } else {
                    yield* iterateAll(specifierNode.local, path, nextTraceMap)
                }
            } finally {
                path.pop()
            }
        }
    }
}

ReferenceTracer.READ = READ
ReferenceTracer.CALL = CALL
ReferenceTracer.CONSTRUCT = CONSTRUCT
ReferenceTracer.ESM = ESM

module.exports = ReferenceTracer
