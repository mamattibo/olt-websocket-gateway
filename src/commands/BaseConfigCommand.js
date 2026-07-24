class BaseConfigCommand {

    constructor(queue) {
        this.queue = queue;
    }

    command() {
        throw new Error(
            "command() not implemented"
        );
    }

    parse(raw) {
        return raw;
    }

    async execute(...args) {

        const result =
            await this.queue.executeRaw(
                this.command(...args)
            );

        return this.parse(result);

    }

}

module.exports = BaseConfigCommand;