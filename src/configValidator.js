class ConfigValidator {

    static validate(config) {

        const required = [

            ['APP_NAME', config.app.name],

            ['WS_PORT', config.websocket.port],

            ['SSH_HOST', config.ssh.host],

            ['SSH_PORT', config.ssh.port],

            ['SSH_USERNAME', config.ssh.username],

            ['SSH_PASSWORD', config.ssh.password]

        ];

        for (const [name, value] of required) {

            if (
                value === undefined ||
                value === null ||
                value === ''
            ) {

                throw new Error(
                    `Configuration Error : ${name} belum diisi`
                );

            }

        }

    }

}

module.exports = ConfigValidator;