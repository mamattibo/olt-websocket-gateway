class BaseCommand {

    constructor(queue) {
        this.queue = queue;
    }

    getName() {
        return this.constructor.name;
    }

    async execute(params = {}) {
        throw new Error('execute() must be implemented');
    }

    parse(raw) {
        return raw;
    }

}

module.exports = BaseCommand;