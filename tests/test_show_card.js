const CommandQueue = require('../src/services/CommandQueue');
const ShowCardCommand = require('../src/commands/ShowCardCommand');
const { createSSH } = require('./helper');

(async () => {

    try {

        const ssh = await createSSH();

        const queue = new CommandQueue(ssh);

        await queue.start();

        const cmd = new ShowCardCommand(queue);

        const result = await cmd.execute();

        console.log(result);

    } catch (err) {

        console.error(err);

    }

})();