const CommandQueue = require('../src/services/CommandQueue');
const CommandService = require('../src/services/CommandService');
const SSHManager = require('../src/services/SSHManager');

const ProtocolError = require('../src/protocol/ProtocolError');
const ErrorCodes = require('../src/protocol/ErrorCodes');

async function test(name, fn) {
    try {
        await fn();
        console.log(`✓ ${name}`);
    } catch (err) {
        console.error(`✗ ${name}`);
        console.error(err);
    }
}

(async () => {

    console.log('\n=== Command Registry Test ===\n');

    const ssh = new SSHManager();

    const queue = new CommandQueue(
        ssh
    );

    const command = new CommandService(
        queue
    );

    /*
    |--------------------------------------------------------------------------
    | Registry
    |--------------------------------------------------------------------------
    */

    await test(
        'showCard registered',
        async () => {

            if (!command.commands.has('showCard')) {
                throw new Error(
                    'showCard not registered'
                );
            }

        }
    );

    /*
    |--------------------------------------------------------------------------
    | Unknown Command
    |--------------------------------------------------------------------------
    */

    await test(
        'Unknown command',
        async () => {

            try {

                await command.execute(
                    'not_exists'
                );

                throw new Error(
                    'Expected ProtocolError'
                );

            } catch (err) {

                if (!(err instanceof ProtocolError)) {
                    throw err;
                }

                if (
                    err.code !==
                    ErrorCodes.COMMAND_UNKNOWN
                ) {
                    throw new Error(
                        'Invalid error code'
                    );
                }

                if (
                    err.message !==
                    'Unknown command : not_exists'
                ) {
                    throw new Error(
                        'Invalid error message'
                    );
                }

            }

        }
    );

    console.log('\nDone.\n');

})();