const CLIContext = require('../src/context/CLIContext');
const PromptModes = require('../src/context/PromptModes');

class MockQueue {

    async executeRaw(command) {

        switch (command) {

            case 'configure terminal':
                return {
                    response: '',
                    prompt: 'ZXAN(config)#'
                };

            case 'gpon':
                return {
                    response: '',
                    prompt: 'ZXAN(config-gpon)#'
                };

            case 'pon':
                return {
                    response: '',
                    prompt: 'ZXAN(config-pon)#'
                };

            case 'interface gpon-olt_1/2/1':
                return {
                    response: '',
                    prompt: 'ZXAN(config-if)#'
                };

            case 'pon-onu-mng gpon-onu_1/2/1:1':
                return {
                    response: '',
                    prompt: 'ZXAN(gpon-onu-mng 1/2/1:1)#'
                };

            case 'exit':
                return {
                    response: '',
                    prompt: 'ZXAN(config)#'
                };

            default:
                return {
                    response: '',
                    prompt: 'ZXAN#'
                };

        }

    }

}

const context = new CLIContext(
    new MockQueue()
);

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
    } catch (err) {
        console.log(`✗ ${name}`);
        console.error(err);
    }
}

(async () => {

    console.log('\n=== CLIContext Test ===\n');

    await context.execute(
        'configure terminal'
    );

    test('Enter CONFIG', () => {

        const c = context.getCurrent();

        if (c.mode !== PromptModes.CONFIG)
            throw new Error('Invalid mode');

    });

    await context.execute(
        'gpon'
    );

    test('Enter GPON', () => {

        const c = context.getCurrent();

        if (c.mode !== PromptModes.CONFIG_GPON)
            throw new Error('Invalid mode');

    });

    await context.execute(
        'interface gpon-olt_1/2/1'
    );

    test('Enter Interface', () => {

        const c = context.getCurrent();

        if (c.mode !== PromptModes.CONFIG_IF)
            throw new Error('Invalid mode');

    });

    await context.execute(
        'pon-onu-mng gpon-onu_1/2/1:1'
    );

    test('Enter ONU Management', () => {

        const c = context.getCurrent();

        if (c.mode !== PromptModes.GPON_ONU_MNG)
            throw new Error('Invalid mode');

        if (c.target !== '1/2/1:1')
            throw new Error('Invalid target');

    });

    await context.execute(
        'exit'
    );

    test('Exit', () => {

        const c = context.getCurrent();

        if (c.mode !== PromptModes.CONFIG)
            throw new Error('Invalid mode');

    });

    console.log('\nDone.');

})();