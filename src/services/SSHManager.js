const { Client } = require('ssh2');
const STATE = require('../constants/SSHState');
const BaseService = require('./BaseService');
const config = require('../config');
const logger = require('../logger');
const commandTimeout = config.commandTimeout;

class SSHManager extends BaseService {
    constructor() {
        super('SSHManager');
        this.client = null;
        this.shell = null;
        this.state = STATE.STOPPED;
        this.reconnectTimer = null;
        this.buffer = "";
        this.prompt = null;
        this.currentCommand = null;
    }

    setState(state) {
        if (!Object.values(STATE).includes(state)) {
            throw new Error(`Invalid SSH state: ${state}`);
        }
        if (this.state === state) {
            return;
        }
        this.state = state;
        logger.info(`SSH State : ${state}`);
    }

    getState() {
        return this.state;
    }

    isReady() {
        return this.state === STATE.READY;
    }
    isConnected() {
        return (
            this.state === STATE.CONNECTED ||
            this.state === STATE.READY
        );
    }

    async start() {
        await super.start();
        logger.info('Starting SSH Manager...');
        await this.connect();
    }

    async stop() {
        logger.info('Stopping SSH Manager...');
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.shell) {
            this.shell.destroy();
            this.shell = null;
        }
        if (this.client) {
            this.client.end();
            this.client = null;
        }
        this.setState(STATE.STOPPED);
        await super.stop();
    }

    connect() {
        if (this.client) {
            logger.warn('SSH Client already exists.');
            return;
        }

        this.setState(STATE.CONNECTING);
        logger.info('Connecting to OLT...');
        this.client = new Client();
        this.registerClientEvents();

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

    }
    openShell() {
        return new Promise((resolve,reject)=>{
            this.client.shell((err,stream)=>{
                if(err){
                    reject(err);
                    return;
                }
                this.shell = stream;
                this.shell.on('data',(data)=>{
                    this.handleData(data.toString());
                });

                this.shell.on('close',()=>{
                    logger.warn(
                        "SSH Shell Closed"
                    );
                });

                this.shell.on("error", (err) => {
                    logger.error(err.message);
                });
                resolve();
            });
        });
    }
    disconnect() {
        if (this.shell) {
            this.shell.destroy();
            this.shell = null;
        }

        if (this.client) {
            this.client.end();
            this.client = null;
        }

        this.buffer = "";
        this.currentCommand = null;
        this.prompt = null;
    }
    registerClientEvents() {
        this.client.on('ready', async () => {
            this.setState(STATE.CONNECTED);
            logger.info('SSH Connected');
            try {
                await this.openShell();
                logger.info("Interactive shell opened");
            } catch (err) {
                logger.error(err.message);
                this.disconnect();
            }
        });

        this.client.on('error', (err) => {
            logger.error(`SSH Error : ${err.message}`);
        });

        this.client.on('close', () => {
            logger.warn('SSH Connection Closed');
            this.setState(STATE.DISCONNECTED);
            this.shell = null;
            this.client = null;
        });

        this.client.on('end', () => {
            logger.warn('SSH Connection Ended');
        });

    }

    handleData(chunk) {
        const text = chunk.toString();
        this.buffer += text;

        if (!this.prompt) {
            const match = this.buffer.match(/([A-Za-z0-9_-]+)(?:\([^)]+\))?#\s*$/m);
            if (match) {
                this.prompt = match[1];
                logger.info(
                    `Prompt detected : ${this.prompt}`
                );
                this.setState(STATE.READY);
            }
        }
        if (!this.currentCommand)
            return;
        if (this.isPrompt()) {
            const response = this.buffer;
            clearTimeout(this.currentCommand.timeout);
            this.currentCommand.resolve(response);
            this.currentCommand = null;
            this.buffer = "";
        }
    }

    isPrompt() {
        if (!this.prompt)
            return false;

        const regex = new RegExp(
            `(?:^|\\r?\\n)${this.prompt}(?:\\([^)]+\\))?#\\s*$`
        );
        return regex.test(this.buffer);
    }
    sendCommand(command, timeout = commandTimeout) {
        if (!this.isReady())
            throw new Error("SSH Shell not ready");
        if (!this.shell)
            throw new Error("Shell not available"); 
        if (this.currentCommand)
            throw new Error("Another command is still running");
        return new Promise((resolve, reject) => {
            this.buffer = "";
            this.currentCommand = {
                command,
                resolve,
                reject,
                timeout: setTimeout(() => {
                    this.buffer = "";
                    this.currentCommand = null;
                    reject(new Error("Command timeout"));
                }, timeout),
                startTime: Date.now()
            };
            logger.debug(
                `SEND > ${command}`
            );
            this.shell.write(command + "\n");

        });
    }
}

module.exports = SSHManager;