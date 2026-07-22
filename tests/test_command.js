const CommandQueue = require('../src/services/CommandQueue');
const CommandService = require('../src/services/CommandService');

(async () => {
    const { createSSH } = require('./helper');
    const ssh = await createSSH();

    const commands = new CommandService(ssh);
    await commands.start();

    const result = await commands.execute('showCard');

    console.log(result);

})();