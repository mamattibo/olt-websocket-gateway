const PromptModes = require('./PromptModes');

module.exports = Object.freeze({

    [PromptModes.EXEC]: {
        parent: null,
        command: null
    },

    [PromptModes.CONFIG]: {
        parent: PromptModes.EXEC,
        command: () => 'configure terminal'
    },

    [PromptModes.CONFIG_GPON]: {
        parent: PromptModes.CONFIG,
        command: () => 'gpon'
    },

    [PromptModes.CONFIG_PON]: {
        parent: PromptModes.CONFIG,
        command: () => 'pon'
    },

    [PromptModes.CONFIG_IF]: {
        parent: PromptModes.CONFIG,
        command: (target) => `interface ${target}`
    },

    [PromptModes.GPON_ONU_MNG]: {
        parent: PromptModes.CONFIG,
        command: (target) => `pon-onu-mng ${target}`
    }

});