const BaseService = require('./BaseService');
const logger = require('../logger');

class CommandQueue extends BaseService {
    constructor(sshManager) {
        super('CommandQueue');
        this.ssh = sshManager;
        this.queue = [];
        this.processing = false;
    }

    async start() {
        await super.start();
        logger.info('Starting Command Queue...');
    }

    async stop() {
        logger.info('Stopping Command Queue...');
        // Tolak semua command yang masih menunggu
        while (this.queue.length > 0) {
            const item = this.queue.shift();
            item.reject(new Error('Command queue stopped'));
        }
        this.processing = false;
        await super.stop();
    }

    execute(command) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                command,
                resolve,
                reject
            });
            logger.debug(
                `Queue +1 (${this.queue.length}) : ${command}`
            );
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.processing) {
            return;
        }
        this.processing = true;
        while (this.queue.length > 0) {
            const item = this.queue.shift();
            try {
                logger.debug(
                    `Execute : ${item.command}`
                );
                const result =
                    await this.ssh.sendCommand(item.command);
                item.resolve(result);
                logger.debug(
                    `Done : ${item.command}`
                );
            } catch (err) {
                logger.error(
                    `Command Failed : ${item.command} : ${err.message}`
                );
                item.reject(err);
            }
        }
        this.processing = false;
    }

    isProcessing() {
        return this.processing;
    }

    getQueueLength() {
        return this.queue.length;
    }

}

module.exports = CommandQueue;