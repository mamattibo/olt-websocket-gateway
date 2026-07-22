class Config {
    constructor() {
        this.app = {
            name: process.env.APP_NAME || 'OLT WebSocket Gateway',
            env: process.env.APP_ENV || 'development'
        };

        this.websocket = {
            port: parseInt(process.env.WS_PORT || 8080)
        };

        this.ssh = {
            host: process.env.SSH_HOST,
            port: parseInt(process.env.SSH_PORT || 22),
            username: process.env.SSH_USERNAME,
            password: process.env.SSH_PASSWORD
        };

        this.logger = {
            level: process.env.LOG_LEVEL || 'info'
        };

        this.command = {
            timeout: parseInt(process.env.COMMAND_TIMEOUT || 10000)
        };

        this.keepAlive = {
            interval: parseInt(process.env.KEEPALIVE_INTERVAL || 30000)
        };

        this.queue = {
            limit: parseInt(process.env.QUEUE_LIMIT || 100)
        };

    }

}

module.exports = new Config();
