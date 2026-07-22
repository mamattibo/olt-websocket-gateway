class TextTable {

    static parse(text) {

        const lines = text
            .replace(/\r/g, '')
            .split('\n')
            .map(line => line.trimEnd())
            .filter(line => line.length);

        const separatorIndex = lines.findIndex(line =>
            /^-+$/.test(line)
        );

        if (separatorIndex < 1) {
            throw new Error("Table separator not found");
        }

        const headerLine = lines[separatorIndex - 1];

        const headers = this.parseHeaders(headerLine);

        const rows = [];

        for (let i = separatorIndex + 1; i < lines.length; i++) {

            const line = lines[i];

            if (line.startsWith("ZXAN"))
                break;

            rows.push(
                this.parseRow(line, headers)
            );

        }

        return {
            headers: headers.map(h => h.name),
            rows
        };

    }

    static parseHeaders(headerLine) {

        const headers = [];

        const regex = /\S+/g;

        let match;

        while ((match = regex.exec(headerLine)) !== null) {

            headers.push({
                name: match[0],
                start: match.index
            });

        }

        return headers;

    }

    static parseRow(line, headers) {

        const row = [];

        for (let i = 0; i < headers.length; i++) {

            const start = headers[i].start;

            const end =
                i === headers.length - 1
                    ? line.length
                    : headers[i + 1].start;

            row.push(
                line.substring(start, end).trim()
            );

        }

        return row;

    }

}

module.exports = TextTable;