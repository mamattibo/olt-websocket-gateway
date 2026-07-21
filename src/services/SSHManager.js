const STATE = Object.freeze({
    STOPPED: 'STOPPED',
    CONNECTING: 'CONNECTING',
    CONNECTED: 'CONNECTED',
    READY: 'READY',
    DISCONNECTED: 'DISCONNECTED',
    RECONNECTING: 'RECONNECTING'
});

const { Client } = require('ssh2');

const BaseService = require('./BaseService');
const config = require('../config');
const logger = require('../logger');

class SSHManager extends BaseService {
    constructor() {
        super('SSHManager');
        this.client = null;
        this.stream = null;
        this.state = STATE.STOPPED;
        this.reconnectTimer = null;
    }
    setState(state) {
        this.state = state;
        logger.info(`SSH State : ${state}`);
    }

    isReady() {
        return this.state === STATE.READY;
    }

    async start() {
        await super.start();
        this.connect();
    }

    async stop() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }

        if (this.stream) {
            this.stream.end();
        }

        if (this.client) {
            this.client.end();
        }
        await super.stop();
    }

    connect() {
        this.setState(STATE.CONNECTING);
        logger.info('Connecting SSH...');
        this.client = new Client();
        this.client.on('ready', () => {
            this.setState(STATE.CONNECTED);
            logger.info('SSH Connected');
        });

        this.client.on('error', (err) => {
            logger.error(err.message);
        });

        this.client.on('close', () => {
            logger.warn('SSH Closed');
        });

        this.client.connect({
            host: config.ssh.host,
            port: config.ssh.port,
            username: config.ssh.username,
            password: config.ssh.password,
            forcecrypto: true,
            algorithms: {
                kex: [
                    'diffie-hellman-group14-sha1',
                    'diffie-hellman-group1-sha1'
                ],

                cipher: [
                    'aes128-cbc',
                    'aes192-cbc',
                    'aes256-cbc',
                    '3des-cbc'
                ],

                serverHostKey: [
                    'ssh-rsa',
                    'ssh-dss'
                ]

            }

        });

        this.client.shell((err, stream) => {
            if (err) {
                logger.error(err.message);
                return;
            }

            this.stream = stream;
            logger.info('Interactive Shell Opened');
            this.setState(STATE.READY);
        });

    }

}


