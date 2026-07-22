class BaseCommand {

    constructor(queue) {
        this.queue = queue;
    }

    command() {
        throw new Error("command() not implemented");
    }

    lines(raw) {
        return raw
            .split('\n')
            .map(line => line.trimEnd());
    }

    isEmpty(line) {
        return line.trim().length === 0;
    }

    isSeparator(line) {
        return /^-+$/.test(line.trim());
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