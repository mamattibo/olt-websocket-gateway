const BaseCommand = require('./BaseCommand');

class ShowCardCommand extends BaseCommand {

    async execute() {

        const raw = await this.queue.execute(
            'show card'
        );

        return this.parse(raw);

    }

    parse(raw) {

        return raw;

    }

}

module.exports = ShowCardCommand;