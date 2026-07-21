const BaseService = require('./BaseService');
const CommandQueue = require('./CommandQueue');
const logger = require('../logger');

const ShowCardCommand = require('../commands/ShowCardCommand');

class CommandService extends BaseService {

    constructor(sshManager) {
        super('CommandService');

        this.queue = new CommandQueue(sshManager);
        this.commands = new Map();

        this.register(
            'showCard',
            new ShowCardCommand(this.queue)
        );
    }

    register(name, command) {

        if (this.commands.has(name)) {
            throw new Error(`Command already registered : ${name}`);
        }

        this.commands.set(name, command);

        logger.debug(`Command Registered : ${name}`);

    }

    has(name) {
        return this.commands.has(name);
    }

    get(name) {
        return this.commands.get(name);
    }

    async execute(name, params = {}) {

        const command = this.commands.get(name);

        if (!command) {
            throw new Error(`Unknown command : ${name}`);
        }

        logger.debug(`Execute Command : ${name}`);

        return await command.execute(params);

    }

    list() {
        return [...this.commands.keys()];
    }

    async start() {
        await super.start();
        logger.info('Starting Command Service...');
    }

    async stop() {
        logger.info('Stopping Command Service...');
        await super.stop();
    }

}

module.exports = CommandService;