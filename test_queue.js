require('dotenv').config();
const SSHManager = require('./src/services/SSHManager');
const CommandQueue = require('./src/services/CommandQueue');

(async()=>{

    const ssh = new SSHManager();

    await ssh.start();

    while(!ssh.isReady()){
        await new Promise(r=>setTimeout(r,100));
    }

    const queue = new CommandQueue(ssh);

    await queue.start();

    const p1 = queue.execute("show card");

    const p2 = queue.execute("show card");

    const p3 = queue.execute("show card");

    const result = await Promise.all([p1,p2,p3]);
})();