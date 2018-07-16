/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { ReferenceTracker } = require("eslint-utils")

module.exports = function definePreferGlobalHandlers(context, trackMap) {
    const mode = context.options[0] || "always"
    const verify = {
        always() {
            const tracker = new ReferenceTracker(context.getScope(), {
                mode: "legacy",
            })

            for (const { node } of [
                ...tracker.iterateCjsReferences(trackMap.modules),
                ...tracker.iterateEsmReferences(trackMap.modules),
            ]) {
                context.report({ node, messageId: "preferGlobal" })
            }
        },

        never() {
            const tracker = new ReferenceTracker(context.getScope())

            for (const { node } of tracker.iterateGlobalReferences(
                trackMap.globals
            )) {
                context.report({ node, messageId: "preferModule" })
            }
        },
    }

    return {
        "Program:exit"() {
            verify[mode]()
        },
    }
}
