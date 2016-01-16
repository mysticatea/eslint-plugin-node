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
    //--------------------------------------------------------------------------
    // Syntax
    //--------------------------------------------------------------------------

    "defaultParameters": {
        name: "Default Parameters",
        node: NaN
    },
    "restParameters": {
        name: "Rest Parameters",
        node: NaN
    },
    "spreadOperators": {
        name: "Spread Operators",
        node: 5
    },
    "objectLiteralExtensions": {
        name: "Object Literal Extensions",
        node: 4
    },
    "forOf": {
        name: "'for..of' Loops",
        node: 0.12
    },
    "binaryNumberLiterals": {
        name: "Binary Number Literals",
        node: 4
    },
    "octalNumberLiterals": {
        name: "Octal Number Literals",
        node: 4
    },
    "templateStrings": {
        name: "Template Strings",
        node: 4
    },
    "regexpY": {
        name: "RegExp 'y' Flags",
        node: NaN
    },
    "regexpU": {
        name: "RegExp 'u' Flags",
        node: NaN
    },
    "destructuring": {
        name: "Destructuring",
        node: NaN
    },
    "unicodeCodePointEscapes": {
        name: "Unicode Code Point Escapes",
        node: 4
    },
    "new.target": {
        name: "'new.target'",
        node: 5
    },
    "const": {
        name: "'const' Declarations",
        node: {
            sloppy: NaN,
            strict: 4
        }
    },
    "let": {
        name: "'let' Declarations",
        node: {
            sloppy: NaN,
            strict: 4
        }
    },
    "blockScopedFunctions": {
        name: "Block-Scoped Functions",
        node: {
            sloppy: NaN,
            strict: 4
        }
    },
    "arrowFunctions": {
        name: "Arrow Functions",
        node: 4
    },
    "generatorFunctions": {
        name: "Generator Functions",
        node: 4
    },
    "classes": {
        name: "Classes",
        node: {
            sloppy: NaN,
            strict: 4
        }
    },
    "modules": {
        name: "Import and Export Declarations",
        node: NaN
    },

    //--------------------------------------------------------------------------
    // Runtime
    //--------------------------------------------------------------------------

    "Object.assign": {
        name: "'Object.assign'",
        singular: true,
        node: 4
    },
    "Object.is": {
        name: "'Object.is'",
        singular: true,
        node: 0.12
    },
    "Object.getOwnPropertySymbols": {
        name: "'Object.getOwnPropertySymbols'",
        singular: true,
        node: 0.12
    },
    "Object.setPrototypeOf": {
        name: "'Object.setPrototypeOf'",
        singular: true,
        node: 0.12
    },

    "String.raw": {
        name: "'String.raw'",
        singular: true,
        node: 4
    },
    "String.fromCodePoint": {
        name: "'String.fromCodePoint'",
        singular: true,
        node: 4
    },

    "Array.from": {
        name: "'Array.from'",
        singular: true,
        node: 4
    },
    "Array.of": {
        name: "'Array.of'",
        singular: true,
        node: 4
    },

    "Number.isFinite": {
        name: "'Number.isFinite'",
        singular: true,
        node: 0.10
    },
    "Number.isInteger": {
        name: "'Number.isInteger'",
        singular: true,
        node: 0.12
    },
    "Number.isSafeInteger": {
        name: "'Number.isSafeInteger'",
        singular: true,
        node: 0.12
    },
    "Number.isNaN": {
        name: "'Number.isNaN'",
        singular: true,
        node: 0.10
    },
    "Number.EPSILON": {
        name: "'Number.EPSILON'",
        singular: true,
        node: 0.12
    },
    "Number.MIN_SAFE_INTEGER": {
        name: "'Number.MIN_SAFE_INTEGER'",
        singular: true,
        node: 0.12
    },
    "Number.MAX_SAFE_INTEGER": {
        name: "'Number.MAX_SAFE_INTEGER'",
        singular: true,
        node: 0.12
    },

    "Math.clz32": {
        name: "'Math.clz32'",
        singular: true,
        node: 0.12
    },
    "Math.imul": {
        name: "'Math.imul'",
        singular: true,
        node: 0.12
    },
    "Math.sign": {
        name: "'Math.sign'",
        singular: true,
        node: 0.12
    },
    "Math.log10": {
        name: "'Math.log10'",
        singular: true,
        node: 0.12
    },
    "Math.log2": {
        name: "'Math.log2'",
        singular: true,
        node: 0.12
    },
    "Math.log1p": {
        name: "'Math.log1p'",
        singular: true,
        node: 0.12
    },
    "Math.expm1": {
        name: "'Math.expm1'",
        singular: true,
        node: 0.12
    },
    "Math.cosh": {
        name: "'Math.cosh'",
        singular: true,
        node: 0.12
    },
    "Math.sinh": {
        name: "'Math.sinh'",
        singular: true,
        node: 0.12
    },
    "Math.tanh": {
        name: "'Math.tanh'",
        singular: true,
        node: 0.12
    },
    "Math.acosh": {
        name: "'Math.acosh'",
        singular: true,
        node: 0.12
    },
    "Math.asinh": {
        name: "'Math.asinh'",
        singular: true,
        node: 0.12
    },
    "Math.atanh": {
        name: "'Math.atanh'",
        singular: true,
        node: 0.12
    },
    "Math.trunc": {
        name: "'Math.trunc'",
        singular: true,
        node: 0.12
    },
    "Math.fround": {
        name: "'Math.fround'",
        singular: true,
        node: 0.12
    },
    "Math.cbrt": {
        name: "'Math.cbrt'",
        singular: true,
        node: 0.12
    },
    "Math.hypot": {
        name: "'Math.hypot'",
        singular: true,
        node: 0.12
    },

    "Int8Array": {
        name: "'Int8Array'",
        singular: true,
        node: 0.12
    },
    "Uint8Array": {
        name: "'Uint8Array'",
        singular: true,
        node: 0.12
    },
    "Uint8ClampedArray": {
        name: "'Uint8ClampedArray'",
        singular: true,
        node: 0.12
    },
    "Int16Array": {
        name: "'Int16Array'",
        singular: true,
        node: 0.12
    },
    "Uint16Array": {
        name: "'Uint16Array'",
        singular: true,
        node: 0.12
    },
    "Int32Array": {
        name: "'Int32Array'",
        singular: true,
        node: 0.12
    },
    "Uint32Array": {
        name: "'Uint32Array'",
        singular: true,
        node: 0.12
    },
    "Float32Array": {
        name: "'Float32Array'",
        singular: true,
        node: 0.12
    },
    "Float64Array": {
        name: "'Float64Array'",
        singular: true,
        node: 0.12
    },
    "DataView": {
        name: "'DataView'",
        singular: true,
        node: 0.12
    },
    "Map": {
        name: "'Map'",
        singular: true,
        node: 0.12
    },
    "Set": {
        name: "'Set'",
        singular: true,
        node: 0.12
    },
    "WeakMap": {
        name: "'WeakMap'",
        singular: true,
        node: 0.12
    },
    "WeakSet": {
        name: "'WeakSet'",
        singular: true,
        node: 0.12
    },
    "Proxy": {
        name: "'Proxy'",
        singular: true,
        node: NaN
    },
    "Reflect": {
        name: "'Reflect'",
        singular: true,
        node: NaN
    },
    "Promise": {
        name: "'Promise'",
        singular: true,
        node: 0.12
    },
    "Symbol": {
        name: "'Symbol'",
        singular: true,
        node: 0.12
    },

    "Symbol.hasInstance": {
        name: "'Symbol.hasInstance'",
        singular: true,
        node: NaN
    },
    "Symbol.isConcatSpreadablec": {
        name: "'Symbol.isConcatSpreadablec'",
        singular: true,
        node: NaN
    },
    "Symbol.iterator": {
        name: "'Symbol.iterator'",
        singular: true,
        node: 0.12
    },
    "Symbol.species": {
        name: "'Symbol.species'",
        singular: true,
        node: NaN
    },
    "Symbol.replace": {
        name: "'Symbol.replace'",
        singular: true,
        node: NaN
    },
    "Symbol.search": {
        name: "'Symbol.search'",
        singular: true,
        node: NaN
    },
    "Symbol.split": {
        name: "'Symbol.split'",
        singular: true,
        node: NaN
    },
    "Symbol.match": {
        name: "'Symbol.match'",
        singular: true,
        node: NaN
    },
    "Symbol.toPrimitive": {
        name: "'Symbol.toPrimitive'",
        singular: true,
        node: NaN
    },
    "Symbol.toStringTag": {
        name: "'Symbol.toStringTag'",
        singular: true,
        node: NaN
    },
    "Symbol.unscopables": {
        name: "'Symbol.unscopables'",
        singular: true,
        node: 4
    },

    "extendsArray": {
        name: "Subclassing of 'Array'",
        singular: true,
        node: NaN
    },
    "extendsRegExp": {
        name: "Subclassing of 'RegExp'",
        singular: true,
        node: 5
    },
    "extendsFunction": {
        name: "Subclassing of 'Function'",
        singular: true,
        node: NaN
    },
    "extendsPromise": {
        name: "Subclassing of 'Promise'",
        singular: true,
        node: 5
    },
    "extendsBoolean": {
        name: "Subclassing of 'Boolean'",
        singular: true,
        node: 4
    },
    "extendsNumber": {
        name: "Subclassing of 'Number'",
        singular: true,
        node: 4
    },
    "extendsString": {
        name: "Subclassing of 'String'",
        singular: true,
        node: 4
    },
    "extendsMap": {
        name: "Subclassing of 'Map'",
        singular: true,
        node: 4
    },
    "extendsSet": {
        name: "Subclassing of 'Set'",
        singular: true,
        node: 4
    }
};
