const config = require('./config');
const logger = require('./logger');
const ServiceManager = require('./services/ServiceManager');
const ConfigValidator = require('./configValidator');
const SSHManager = require('./services/SSHManager');

class App {

    constructor() {
        this.services = new ServiceManager();
        const ssh = new SSHManager();
        this.services.register(
            'ssh',
            ssh
        );
        this.services.register(
            'queue',
            new CommandQueue(ssh)
        );
    }

    async start() {

        logger.info('==========================================');
        logger.info(config.app.name);
        logger.info('Environment : ' + config.app.env);
        logger.info('Checking Configuration...');
        ConfigValidator.validate(config);
        logger.info('Configuration OK');
        await this.services.startAll();
        logger.info('Application Ready');
        logger.info('==========================================');

        process.on('SIGINT', async () => {
            logger.info('Stopping Application...');
            await this.services.stopAll();
            process.exit(0);
        });
    }
}

module.exports = App;
