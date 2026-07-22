const CommandQueue = require('../src/services/CommandQueue');
console.log(__filename);
console.log(process.cwd());

(async () => {

    try {

        const { createSSH } = require('./helper');

        const ssh = await createSSH();

        const queue = new CommandQueue(ssh);

        await queue.start();

        const result = await Promise.all([
            queue.execute("show card"),
            queue.execute("show card"),
            queue.execute("show card")
        ]);

        console.log(result.length);

    } catch (err) {

        console.error(err);

    }

})();