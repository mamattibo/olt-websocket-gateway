const BaseCommand = require('./BaseCommand');

class ShowCardCommand extends BaseCommand {

    async execute() {

        const raw = await this.queue.execute(
            'show card'
        );

        return this.parse(raw);

    }

    parse(raw) {
        const result = [];
        let inTable = false;

        for (const line of this.lines(raw)) {
            const text = line.trim();
            if (this.isEmpty(text))
                continue;
            if (text.startsWith('Rack Shelf Slot')) {
                inTable = true;
                continue;
            }

            if (!inTable)
                continue;

            if (this.isSeparator(text))
                continue;

            const col = text.split(/\s+/);
            result.push({
                rack: Number(col[0]),
                shelf: Number(col[1]),
                slot: Number(col[2]),
                cfgType: col[3],
                realType: col[4],
                port: Number(col[5]),
                hardVer: col[6],
                softVer: col[7],
                status: col.slice(8).join(' ')
            });

        }
        return {
            cards: result
        };
    }

}

module.exports = ShowCardCommand;