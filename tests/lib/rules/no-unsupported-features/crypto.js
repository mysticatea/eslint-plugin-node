/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/no-unsupported-features/crypto")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    globals: {
        require: false,
    },
}).run("no-unsupported-features/crypto", rule, {
    valid: [
        {
            code: "require('crypto').constants",
            options: [{ version: "6.3.0" }],
        },
        {
            code: "var hooks = require('crypto'); hooks.constants",
            options: [{ version: "6.3.0" }],
        },
        {
            code: "var { constants } = require('crypto'); constants",
            options: [{ version: "6.3.0" }],
        },
        {
            code: "import crypto from 'crypto'; crypto.constants",
            options: [{ version: "6.3.0" }],
        },
        {
            code: "import { constants } from 'crypto'; constants",
            options: [{ version: "6.3.0" }],
        },
        {
            code: "require('crypto').Certificate.exportChallenge()",
            options: [{ version: "9.0.0" }],
        },
        {
            code:
                "var { Certificate: c } = require('crypto'); c.exportChallenge()",
            options: [{ version: "9.0.0" }],
        },
        {
            code:
                "var { Certificate: c } = require('crypto'); c.exportPublicKey()",
            options: [{ version: "9.0.0" }],
        },
        {
            code: "var { Certificate: c } = require('crypto'); c.verifySpkac()",
            options: [{ version: "9.0.0" }],
        },
        {
            code: "require('crypto').fips",
            options: [{ version: "6.0.0" }],
        },
        {
            code: "require('crypto').getCurves",
            options: [{ version: "2.3.0" }],
        },
        {
            code: "require('crypto').getFips",
            options: [{ version: "10.0.0" }],
        },
        {
            code: "require('crypto').privateEncrypt",
            options: [{ version: "1.1.0" }],
        },
        {
            code: "require('crypto').publicDecrypt",
            options: [{ version: "1.1.0" }],
        },
        {
            code: "require('crypto').randomFillSync",
            options: [{ version: "7.10.0" }],
        },
        {
            code: "require('crypto').randomFill",
            options: [{ version: "7.10.0" }],
        },
        {
            code: "require('crypto').scrypt",
            options: [{ version: "10.5.0" }],
        },
        {
            code: "require('crypto').scryptSync",
            options: [{ version: "10.5.0" }],
        },
        {
            code: "require('crypto').setFips",
            options: [{ version: "10.0.0" }],
        },
        {
            code: "require('crypto').timingSafeEqual",
            options: [{ version: "6.6.0" }],
        },

        // Ignores.
        {
            code: "require('crypto').constants",
            options: [{ version: "6.2.9", ignores: ["crypto.constants"] }],
        },
        {
            code: "var hooks = require('crypto'); hooks.constants",
            options: [{ version: "6.2.9", ignores: ["crypto.constants"] }],
        },
        {
            code: "var { constants } = require('crypto'); constants",
            options: [{ version: "6.2.9", ignores: ["crypto.constants"] }],
        },
        {
            code: "import crypto from 'crypto'; crypto.constants",
            options: [{ version: "6.2.9", ignores: ["crypto.constants"] }],
        },
        {
            code: "import { constants } from 'crypto'; constants",
            options: [{ version: "6.2.9", ignores: ["crypto.constants"] }],
        },
        {
            code: "require('crypto').Certificate.exportChallenge()",
            options: [
                {
                    version: "8.9.9",
                    ignores: ["crypto.Certificate.exportChallenge"],
                },
            ],
        },
        {
            code:
                "var { Certificate: c } = require('crypto'); c.exportChallenge()",
            options: [
                {
                    version: "8.9.9",
                    ignores: ["crypto.Certificate.exportChallenge"],
                },
            ],
        },
        {
            code:
                "var { Certificate: c } = require('crypto'); c.exportPublicKey()",
            options: [
                {
                    version: "8.9.9",
                    ignores: ["crypto.Certificate.exportPublicKey"],
                },
            ],
        },
        {
            code: "var { Certificate: c } = require('crypto'); c.verifySpkac()",
            options: [
                {
                    version: "8.9.9",
                    ignores: ["crypto.Certificate.verifySpkac"],
                },
            ],
        },
        {
            code: "require('crypto').fips",
            options: [{ version: "5.9.9", ignores: ["crypto.fips"] }],
        },
        {
            code: "require('crypto').getCurves",
            options: [{ version: "2.2.9", ignores: ["crypto.getCurves"] }],
        },
        {
            code: "require('crypto').getFips",
            options: [{ version: "9.9.9", ignores: ["crypto.getFips"] }],
        },
        {
            code: "require('crypto').privateEncrypt",
            options: [{ version: "1.0.9", ignores: ["crypto.privateEncrypt"] }],
        },
        {
            code: "require('crypto').publicDecrypt",
            options: [{ version: "1.0.9", ignores: ["crypto.publicDecrypt"] }],
        },
        {
            code: "require('crypto').randomFillSync",
            options: [{ version: "7.9.9", ignores: ["crypto.randomFillSync"] }],
        },
        {
            code: "require('crypto').randomFill",
            options: [{ version: "7.9.9", ignores: ["crypto.randomFill"] }],
        },
        {
            code: "require('crypto').scrypt",
            options: [{ version: "10.4.9", ignores: ["crypto.scrypt"] }],
        },
        {
            code: "require('crypto').scryptSync",
            options: [{ version: "10.4.9", ignores: ["crypto.scryptSync"] }],
        },
        {
            code: "require('crypto').setFips",
            options: [{ version: "9.9.9", ignores: ["crypto.setFips"] }],
        },
        {
            code: "require('crypto').timingSafeEqual",
            options: [
                { version: "6.5.9", ignores: ["crypto.timingSafeEqual"] },
            ],
        },
    ],
    invalid: [
        {
            code: "require('crypto').constants",
            options: [{ version: "6.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.constants",
                        supported: "6.3.0",
                        version: "6.2.9",
                    },
                },
            ],
        },
        {
            code: "var hooks = require('crypto'); hooks.constants",
            options: [{ version: "6.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.constants",
                        supported: "6.3.0",
                        version: "6.2.9",
                    },
                },
            ],
        },
        {
            code: "var { constants } = require('crypto'); constants",
            options: [{ version: "6.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.constants",
                        supported: "6.3.0",
                        version: "6.2.9",
                    },
                },
            ],
        },
        {
            code: "import crypto from 'crypto'; crypto.constants",
            options: [{ version: "6.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.constants",
                        supported: "6.3.0",
                        version: "6.2.9",
                    },
                },
            ],
        },
        {
            code: "import { constants } from 'crypto'; constants",
            options: [{ version: "6.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.constants",
                        supported: "6.3.0",
                        version: "6.2.9",
                    },
                },
            ],
        },
        {
            code: "require('crypto').Certificate.exportChallenge()",
            options: [{ version: "8.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.Certificate.exportChallenge",
                        supported: "9.0.0",
                        version: "8.9.9",
                    },
                },
            ],
        },
        {
            code:
                "var { Certificate: c } = require('crypto'); c.exportChallenge()",
            options: [{ version: "8.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.Certificate.exportChallenge",
                        supported: "9.0.0",
                        version: "8.9.9",
                    },
                },
            ],
        },
        {
            code:
                "var { Certificate: c } = require('crypto'); c.exportPublicKey()",
            options: [{ version: "8.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.Certificate.exportPublicKey",
                        supported: "9.0.0",
                        version: "8.9.9",
                    },
                },
            ],
        },
        {
            code: "var { Certificate: c } = require('crypto'); c.verifySpkac()",
            options: [{ version: "8.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.Certificate.verifySpkac",
                        supported: "9.0.0",
                        version: "8.9.9",
                    },
                },
            ],
        },
        {
            code: "require('crypto').fips",
            options: [{ version: "5.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.fips",
                        supported: "6.0.0",
                        version: "5.9.9",
                    },
                },
            ],
        },
        {
            code: "require('crypto').getCurves",
            options: [{ version: "2.2.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.getCurves",
                        supported: "2.3.0",
                        version: "2.2.9",
                    },
                },
            ],
        },
        {
            code: "require('crypto').getFips",
            options: [{ version: "9.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.getFips",
                        supported: "10.0.0",
                        version: "9.9.9",
                    },
                },
            ],
        },
        {
            code: "require('crypto').privateEncrypt",
            options: [{ version: "1.0.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.privateEncrypt",
                        supported: "1.1.0",
                        version: "1.0.9",
                    },
                },
            ],
        },
        {
            code: "require('crypto').publicDecrypt",
            options: [{ version: "1.0.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.publicDecrypt",
                        supported: "1.1.0",
                        version: "1.0.9",
                    },
                },
            ],
        },
        {
            code: "require('crypto').randomFillSync",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.randomFillSync",
                        supported: "7.10.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "require('crypto').randomFill",
            options: [{ version: "7.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.randomFill",
                        supported: "7.10.0",
                        version: "7.9.9",
                    },
                },
            ],
        },
        {
            code: "require('crypto').scrypt",
            options: [{ version: "10.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.scrypt",
                        supported: "10.5.0",
                        version: "10.4.9",
                    },
                },
            ],
        },
        {
            code: "require('crypto').scryptSync",
            options: [{ version: "10.4.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.scryptSync",
                        supported: "10.5.0",
                        version: "10.4.9",
                    },
                },
            ],
        },
        {
            code: "require('crypto').setFips",
            options: [{ version: "9.9.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.setFips",
                        supported: "10.0.0",
                        version: "9.9.9",
                    },
                },
            ],
        },
        {
            code: "require('crypto').timingSafeEqual",
            options: [{ version: "6.5.9" }],
            errors: [
                {
                    messageId: "unsupported",
                    data: {
                        name: "crypto.timingSafeEqual",
                        supported: "6.6.0",
                        version: "6.5.9",
                    },
                },
            ],
        },
    ],
})
