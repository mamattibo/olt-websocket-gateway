require('dotenv').config();

const SSHManager = require('./src/services/SSHManager');
const CommandQueue = require('./src/services/CommandQueue');
const CommandService = require('./src/services/CommandService');

(async () => {

    const ssh = new SSHManager();
    await ssh.start();

    while (!ssh.isReady()) {
        await new Promise(r => setTimeout(r, 100));
    }
    const commands = new CommandService(ssh);
    await commands.start();

    const result = await commands.execute('showCard');

    console.log(result);

})();