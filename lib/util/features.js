/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    defaultParameters: {
        name: "Default Parameters",
        node: NaN
    },
    restParameters: {
        name: "Rest Parameters",
        node: NaN
    },
    spreadOperators: {
        name: "Spread Operators",
        node: 5
    },
    objectLiteralExtensions: {
        name: "Object Literal Extensions",
        node: 4
    },
    forOf: {
        name: "For..of Loops",
        node: 0.12
    },
    binaryNumberLiterals: {
        name: "Binary Number Literals",
        node: 4
    },
    octalNumberLiterals: {
        name: "Octal Number Literals",
        node: 4
    },
    templateStrings: {
        name: "Template Strings",
        node: 4
    },
    regexpY: {
        name: "RegExp \"y\" Flags",
        node: NaN
    },
    regexpU: {
        name: "RegExp \"u\" Flags",
        node: NaN
    },
    destructuring: {
        name: "Destructuring",
        node: NaN
    },
    unicodeCodePointEscapes: {
        name: "Unicode Code Point Escapes",
        node: 4
    },
    newTarget: {
        name: "\"new.target\"",
        node: 5
    },
    const: {
        name: "\"const\" Declarations",
        node: {
            sloppy: NaN,
            strict: 4
        }
    },
    let: {
        name: "\"let\" Declarations",
        node: {
            sloppy: NaN,
            strict: 4
        }
    },
    blockScopedFunctions: {
        name: "Block-Scoped Functions",
        node: {
            sloppy: NaN,
            strict: 4
        }
    },
    arrowFunctions: {
        name: "Arrow Functions",
        node: 4
    },
    generatorFunctions: {
        name: "Generator Functions",
        node: 4
    },
    classes: {
        name: "Classes",
        node: {
            sloppy: NaN,
            strict: 4
        }
    },
    typedArrays: {
        name: "Typed Arrays",
        node: 0.12
    },
    mapSet: {
        name: "Map and Set",
        node: 0.12
    },
    weakMapSet: {
        name: "WeakMap and WeakSet",
        node: 0.12
    },
    proxy: {
        name: "Proxy",
        singular: true,
        node: NaN
    },
    reflect: {
        name: "Reflect",
        singular: true,
        node: NaN
    },
    promise: {
        name: "Promise",
        singular: true,
        node: 0.12
    },
    symbol: {
        name: "Symbol",
        singular: true,
        node: 0.12
    },
    modules: {
        name: "Import and Export Declarations",
        node: NaN
    }
};
