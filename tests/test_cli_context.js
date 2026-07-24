const CLIContext = require('../src/context/CLIContext');
const PromptModes = require('../src/context/PromptModes');

class MockQueue {

    constructor() {
        this.prompt = 'ZXAN#';
    }

    async executeRaw(command) {

        switch (command) {

            case 'configure terminal':
                this.prompt = 'ZXAN(config)#';
                break;

            case 'gpon':
                this.prompt = 'ZXAN(config-gpon)#';
                break;

            case 'pon':
                this.prompt = 'ZXAN(config-pon)#';
                break;

            case 'interface gpon-olt_1/2/1':
                this.prompt = 'ZXAN(config-if)#';
                break;

            case 'pon-onu-mng gpon-onu_1/2/1:1':
                this.prompt =
                    'ZXAN(gpon-onu-mng 1/2/1:1)#';
                break;

            case 'exit':

                switch (this.prompt) {

                    case 'ZXAN(config-gpon)#':
                    case 'ZXAN(config-pon)#':
                    case 'ZXAN(config-if)#':
                    case 'ZXAN(gpon-onu-mng 1/2/1:1)#':
                        this.prompt = 'ZXAN(config)#';
                        break;

                    case 'ZXAN(config)#':
                        this.prompt = 'ZXAN#';
                        break;

                }

                break;

        }

        return {
            response: '',
            prompt: this.prompt
        };

    }

}

const context = new CLIContext(
    new MockQueue()
);

function test(name, fn) {

    try {

        fn();

        console.log(
            `✓ ${name}`
        );

    } catch (err) {

        console.log(
            `✗ ${name}`
        );

        console.error(err);

    }

}

(async () => {

    console.log('\n=== CLIContext Test ===\n');

    //----------------------------------
    // execute()
    //----------------------------------

    await context.execute(
        'configure terminal'
    );

    test('Enter CONFIG', () => {

        if (
            context.getCurrent().mode !==
            PromptModes.CONFIG
        ) {
            throw new Error(
                'Invalid CONFIG'
            );
        }

    });

    await context.execute(
        'gpon'
    );

    test('Enter GPON', () => {

        if (
            context.getCurrent().mode !==
            PromptModes.CONFIG_GPON
        ) {
            throw new Error(
                'Invalid GPON'
            );
        }

    });

    await context.execute(
        'interface gpon-olt_1/2/1'
    );

    test('Enter Interface', () => {

        if (
            context.getCurrent().mode !==
            PromptModes.CONFIG_IF
        ) {
            throw new Error(
                'Invalid CONFIG_IF'
            );
        }

    });

    await context.execute(
        'pon-onu-mng gpon-onu_1/2/1:1'
    );

    test('Enter ONU Management', () => {

        const c = context.getCurrent();

        if (
            c.mode !==
            PromptModes.GPON_ONU_MNG
        ) {
            throw new Error(
                'Invalid ONU_MNG'
            );
        }

        if (
            c.target !== '1/2/1:1'
        ) {
            throw new Error(
                'Invalid target'
            );
        }

    });

    //----------------------------------
    // ensureConfig()
    //----------------------------------

    await context.ensureConfig();

    test('Ensure Config from ONU', () => {

        if (
            context.getCurrent().mode !==
            PromptModes.CONFIG
        ) {
            throw new Error(
                'Should return CONFIG'
            );
        }

    });

    await context.execute(
        'gpon'
    );

    await context.ensureConfig();

    test('Ensure Config from GPON', () => {

        if (
            context.getCurrent().mode !==
            PromptModes.CONFIG
        ) {
            throw new Error(
                'Should return CONFIG'
            );
        }

    });

    //----------------------------------
    // enter()
    //----------------------------------

    await context.enter(
        PromptModes.CONFIG_IF,
        'gpon-olt_1/2/1'
    );

    test('Enter CONFIG_IF using enter()', () => {

        if (
            context.getCurrent().mode !==
            PromptModes.CONFIG_IF
        ) {
            throw new Error(
                'Invalid CONFIG_IF'
            );
        }

    });

    await context.ensureConfig();

    await context.enter(
        PromptModes.CONFIG_GPON
    );

    test('Enter GPON using enter()', () => {

        if (
            context.getCurrent().mode !==
            PromptModes.CONFIG_GPON
        ) {
            throw new Error(
                'Invalid CONFIG_GPON'
            );
        }

    });

    //----------------------------------
    // invalid context
    //----------------------------------

    let ok = false;

    try {

        await context.enter(
            'UNKNOWN_MODE'
        );

    } catch {

        ok = true;

    }

    test('Unknown Context', () => {

        if (!ok)
            throw new Error(
                'Should throw'
            );

    });

    //----------------------------------
    // EXEC not allowed
    //----------------------------------

    ok = false;

    try {

        await context.enter(
            PromptModes.EXEC
        );

    } catch {

        ok = true;

    }

    test('Cannot Enter EXEC', () => {

        if (!ok)
            throw new Error(
                'Should throw'
            );

    });

    console.log('\nDone.');

})();