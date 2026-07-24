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
                reject,
                raw: false
            });
            logger.debug(
                `Queue +1 (${this.queue.length}) : ${command}`
            );
            this.processQueue();
        });
    }

    executeRaw(command) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                command,
                resolve,
                reject,
                raw: true
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
                const raw = await this.ssh.sendCommand(
                    item.command
                );

                const result = item.raw
                    ? this.parseResponse(
                        item.command,
                        raw
                    )
                    : this.cleanResponse(
                        item.command,
                        raw
                    );

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

    parseResponse(command, raw) {
        let lines = raw
            .replace(/\r/g, '')
            .split('\n');

        // hapus echo
        if (
            lines.length &&
            lines[0].trim() === command
        ) {
            lines.shift();
        }

        let prompt = null;
        if (
            lines.length &&
            /^.+(?:\([^)]+\))?#\s*$/.test(
                lines[lines.length - 1]
            )
        ) {
            prompt = lines.pop().trim();
        }

        return {
            response: lines.join('\n').trim(),
            prompt
        };
    }

    cleanResponse(command, response) {
        let lines = response
            .replace(/\r/g, '')
            .split('\n');
        // hapus echo command
        if (lines.length && lines[0].trim() === command) {
            lines.shift();
        }
        // hapus prompt terakhir
        if (lines.length &&
            /^.+(?:\([^)]+\))?#\s*$/.test(lines[lines.length - 1])) {
            lines.pop();
        }
        return lines.join('\n').trim();
    }

    isProcessing() {
        return this.processing;
    }

    getQueueLength() {
        return this.queue.length;
    }

}

module.exports = CommandQueue;