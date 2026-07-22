class BaseCommand {

    constructor(queue) {
        this.queue = queue;
    }

    command() {
        throw new Error("command() not implemented");
    }

    parse(raw) {
        return raw;
    }

    async execute(...args) {
        const raw = await this.queue.execute(
            this.command(...args)
        );
        return this.parse(raw);
    }

}

module.exports = BaseCommand;