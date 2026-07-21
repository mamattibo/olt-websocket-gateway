require('dotenv').config();
const SSHManager = require('./src/services/SSHManager');

(async () => {
    const ssh = new SSHManager();

    try {
        await ssh.start();

        // Tunggu sampai READY
        while (!ssh.isReady()) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log("===== SHOW CARD =====");

        const result = await ssh.sendCommand("show card");

        console.log(result);

    } catch (err) {

        console.error(err);

    } finally {

        await ssh.stop();

    }

})();
