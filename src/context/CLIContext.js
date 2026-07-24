const PromptParser = require('./PromptParser');
const PromptModes = require('./PromptModes');
const ContextGraph = require('./ContextGraph');

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

    async ensureConfig() {
        if (!this.current)
            throw new Error('Unknown CLI context');

        while (!this.isConfig()) {
            if (this.isExec()) {
                await this.execute(
                    'configure terminal'
                );
            } else {
                await this.execute(
                    'exit'
                );
            }
        }
    }

    async enter(mode, target = null) {
        if (mode === PromptModes.EXEC) {
            throw new Error(
                'Cannot enter EXEC mode'
            );
        }

        await this.ensureConfig();
        const node = ContextGraph[mode];
        if (!node) {
            throw new Error(
                `Unknown context : ${mode}`
            );
        }

        if (!node.command) {
            return;
        }

        await this.execute(
            node.command(target)
        );
    }

    isConfig() {
        return this.current &&
            this.current.mode === PromptModes.CONFIG;
    }

    isExec() {
        return this.current &&
            this.current.mode === PromptModes.EXEC;
    }

    getMode() {
        return this.current
            ? this.current.mode
            : null;
    }

}

module.exports = CLIContext;