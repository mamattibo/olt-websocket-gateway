class PromptParser {

    parse(prompt) {

        if (typeof prompt !== 'string') {
            throw new Error('Prompt must be a string');
        }

        prompt = prompt.trim();

        // contoh:
        // ZXAN#
        // ZXAN(config)#
        // ZXAN(config-if)#
        // ZXAN(gpon-onu-mng 1/2/1:1)#

        const match = prompt.match(
            /^([A-Za-z0-9_-]+)(?:\(([^)]*)\))?#$/
        );

        if (!match) {
            throw new Error(
                `Invalid prompt : ${prompt}`
            );
        }

        const hostname = match[1];

        let mode = null;
        let target = null;

        if (match[2]) {

            const text = match[2].trim();

            const pos = text.indexOf(' ');

            if (pos === -1) {

                mode = text;

            } else {

                mode = text.substring(0, pos);

                target = text.substring(pos + 1).trim();

            }

        }

        return {
            hostname,
            mode,
            target
        };

    }

}

module.exports = PromptParser;