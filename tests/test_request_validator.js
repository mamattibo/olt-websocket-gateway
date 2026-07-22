const assert = require('assert');

const RequestValidator = require('../src/protocol/RequestValidator');

const validator = new RequestValidator();

function shouldPass(name, request, callback) {

    try {

        const result = validator.validate(request);

        if (callback) {
            callback(result);
        }

        console.log(`✓ ${name}`);

    } catch (err) {

        console.error(`✗ ${name}`);
        console.error(err.message);

    }

}

function shouldFail(name, request, message) {

    try {

        validator.validate(request);

        console.error(`✗ ${name}`);
        console.error('Expected validation error');

    } catch (err) {

        try {

            assert.strictEqual(err.message, message);

            console.log(`✓ ${name}`);

        } catch (e) {

            console.error(`✗ ${name}`);
            console.error(
                `Expected "${message}", got "${err.message}"`
            );

        }

    }

}

console.log('');
console.log('=== RequestValidator Test ===');
console.log('');

//
// VALID
//

shouldPass(
    'Valid Request',
    {
        type: 'request',
        id: '1',
        command: 'showCard',
        args: []
    }
);

shouldPass(
    'ID Number',
    {
        type: 'request',
        id: 1,
        command: 'showCard',
        args: []
    }
);

shouldPass(
    'Trim Command',
    {
        type: 'request',
        id: '1',
        command: '  showCard  '
    },
    (request) => {

        assert.strictEqual(
            request.command,
            'showCard'
        );

    }
);

shouldPass(
    'Default Args',
    {
        type: 'request',
        id: '1',
        command: 'showCard'
    },
    (request) => {

        assert.deepStrictEqual(
            request.args,
            []
        );

    }
);

//
// INVALID
//

shouldFail(
    'Null Request',
    null,
    'Request is required'
);

shouldFail(
    'Array Request',
    [],
    'Request is required'
);

shouldFail(
    'Invalid Type',
    {
        type: 'response',
        id: '1',
        command: 'showCard'
    },
    'Invalid request type'
);

shouldFail(
    'Missing ID',
    {
        type: 'request',
        command: 'showCard'
    },
    'Invalid request id'
);

shouldFail(
    'Invalid ID',
    {
        type: 'request',
        id: {},
        command: 'showCard'
    },
    'Invalid request id'
);

shouldFail(
    'Missing Command',
    {
        type: 'request',
        id: '1'
    },
    'Invalid command'
);

shouldFail(
    'Empty Command',
    {
        type: 'request',
        id: '1',
        command: '    '
    },
    'Invalid command'
);

shouldFail(
    'Invalid Args',
    {
        type: 'request',
        id: '1',
        command: 'showCard',
        args: {}
    },
    'Invalid arguments'
);

console.log('');
console.log('Done.');