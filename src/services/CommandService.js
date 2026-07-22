const BaseService = require('./BaseService');
const CommandQueue = require('./CommandQueue');
const BaseCommand = require('../commands/BaseCommand');
const logger = require('../logger');

const Commands = require('../commands');

class CommandService extends BaseService {

    constructor(sshManager) {
        super('CommandService');

        this.queue = new CommandQueue(sshManager);
        this.commands = new Map();

        for (const [name, CommandClass] of Object.entries(Commands)) {
            const command = new CommandClass(this.queue);
            this.register(name, command);
        }
    }

    register(name, command) {
        if (!(command instanceof BaseCommand)) {
            throw new Error(`Invalid command: ${name}`);
        }

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

    async execute(name, ...args) {
        const command = this.commands.get(name);
        if (!command) {
            throw new Error(`Unknown command : ${name}`);
        }
        logger.debug(`Execute Command : ${name}`);
        return await command.execute(...args);
    }

    list() {
        return Array.from(
            this.commands.keys()
        );
    }

    async start() {
        await super.start();
        logger.info(
            "Starting Command Service..."
        );
        await this.queue.start();
    }

    async stop() {
        logger.info(
            "Stopping Command Service..."
        );
        await this.queue.stop();
        await super.stop();
    }

}

module.exports = CommandService;