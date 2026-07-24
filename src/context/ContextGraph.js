const PromptModes = require('./PromptModes');

module.exports = Object.freeze({

    [PromptModes.EXEC]: {
        parent: null,
        enter: null,
        exit: null
    },

    [PromptModes.CONFIG]: {
        parent: PromptModes.EXEC,
        enter: () => [
            'configure terminal'
        ],
        exit: () => [
            'exit'
        ]
    },

    [PromptModes.CONFIG_GPON]: {
        parent: PromptModes.CONFIG,
        enter: () => [
            'gpon'
        ],
        exit: () => [
            'exit'
        ]
    },

    [PromptModes.CONFIG_PON]: {
        parent: PromptModes.CONFIG,
        enter: () => [
            'pon'
        ],
        exit: () => [
            'exit'
        ]
    },

    [PromptModes.CONFIG_IF]: {
        parent: PromptModes.CONFIG,
        enter: (target) => [
            `interface ${target}`
        ],
        exit: () => [
            'exit'
        ]
    },

    [PromptModes.GPON_ONU_MNG]: {
        parent: PromptModes.CONFIG,
        enter: (target) => [
            `pon-onu-mng ${target}`
        ],
        exit: () => [
            'exit'
        ]
    }

});