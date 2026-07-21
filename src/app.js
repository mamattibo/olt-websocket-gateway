const config = require('./config');
const logger = require('./logger');

class App {

    start() {

        logger.info('==========================================');
        logger.info(config.app.name);
        logger.info('Environment : ' + config.app.env);
        logger.info('Application Started');
        logger.info('==========================================');

        process.on('SIGINT', () => {

            logger.info('Stopping Application...');

            process.exit(0);

        });

    }

}

module.exports = App;
