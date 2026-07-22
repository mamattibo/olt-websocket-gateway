const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '..', '.env')
});
const SSHManager = require('../src/services/SSHManager');

async function createSSH() {

    const ssh = new SSHManager();

    await ssh.start();

    console.log("WAIT READY");

    while (!ssh.isReady()) {
        await new Promise(r => setTimeout(r, 100));
    }

    console.log("READY OK");

    return ssh;
}

module.exports = {
    createSSH
};