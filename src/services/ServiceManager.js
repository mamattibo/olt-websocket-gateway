const logger = require('../logger');

class ServiceManager {

    constructor() {
        this.services = new Map();
    }

    register(name, service) {

        if (this.services.has(name)) {
            throw new Error(`Service '${name}' sudah terdaftar.`);
        }

        this.services.set(name, service);

        logger.info(`Service Registered : ${name}`);

    }

    get(name) {
        return this.services.get(name);
    }

    async startAll() {

        logger.info('Starting Services...');

        for (const [name, service] of this.services) {

            logger.info(`Start : ${name}`);

            await service.start();

        }

        logger.info('All Services Started.');

    }

    async stopAll() {

        logger.info('Stopping Services...');

        const list = Array.from(this.services.entries()).reverse();

        for (const [name, service] of list) {

            logger.info(`Stop : ${name}`);

            await service.stop();

        }

        logger.info('All Services Stopped.');

    }

}

module.exports = ServiceManager;
