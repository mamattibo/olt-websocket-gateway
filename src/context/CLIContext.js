const PromptParser = require('./PromptParser');

class CLIContext {

    constructor(queue) {

        this.queue = queue;

        this.parser = new PromptParser();

        this.current = null;

    }

    getCurrent() {
        return this.current;
    }

    async execute(command) {

        const result =
            await this.queue.executeRaw(command);

        this.current =
            this.parser.parse(
                result.prompt
            );

        return result;

    }

}

module.exports = CLIContext;