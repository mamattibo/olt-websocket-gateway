const ResponseFactory = require('../src/protocol/ResponseFactory');
const ProtocolError = require('../src/protocol/ProtocolError');
const ErrorCodes = require('../src/protocol/ErrorCodes');

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
    } catch (err) {
        console.error(`✗ ${name}`);
        console.error(err.message);
    }
}

console.log('\n=== ResponseFactory Test ===\n');

/*
|--------------------------------------------------------------------------
| Success Response
|--------------------------------------------------------------------------
*/

test('Success Response', () => {

    const response = ResponseFactory.success(
        '1',
        {
            cards: []
        }
    );

    if (response.type !== 'response')
        throw new Error('Invalid response type');

    if (response.id !== '1')
        throw new Error('Invalid response id');

    if (!response.data)
        throw new Error('Missing response data');

    if (!Array.isArray(response.data.cards))
        throw new Error('Invalid response data');

});

/*
|--------------------------------------------------------------------------
| Protocol Error Response
|--------------------------------------------------------------------------
*/

test('Protocol Error Response', () => {

    const err = new ProtocolError(
        ErrorCodes.REQUEST_INVALID_TYPE,
        'Invalid request type'
    );

    const response = ResponseFactory.error(
        '2',
        err
    );

    if (response.type !== 'error')
        throw new Error('Invalid response type');

    if (response.id !== '2')
        throw new Error('Invalid response id');

    if (response.code !== ErrorCodes.REQUEST_INVALID_TYPE)
        throw new Error('Invalid error code');

    if (response.message !== 'Invalid request type')
        throw new Error('Invalid error message');

});

/*
|--------------------------------------------------------------------------
| Internal Error Response
|--------------------------------------------------------------------------
*/

test('Internal Error Response', () => {

    const err = new Error(
        'Database disconnected'
    );

    const response = ResponseFactory.error(
        '3',
        err
    );

    if (response.type !== 'error')
        throw new Error('Invalid response type');

    if (response.id !== '3')
        throw new Error('Invalid response id');

    if (response.code !== ErrorCodes.INTERNAL_ERROR)
        throw new Error('Invalid internal error code');

    if (response.message !== 'Database disconnected')
        throw new Error('Invalid internal error message');

});

/*
|--------------------------------------------------------------------------
| Unknown Error Object
|--------------------------------------------------------------------------
*/

test('Unknown Error Object', () => {

    const response = ResponseFactory.error(
        '4',
        {}
    );

    if (response.type !== 'error')
        throw new Error('Invalid response type');

    if (response.id !== '4')
        throw new Error('Invalid response id');

    if (response.code !== ErrorCodes.INTERNAL_ERROR)
        throw new Error('Invalid internal error code');

    if (response.message !== 'Internal error')
        throw new Error('Invalid default error message');

});

/*
|--------------------------------------------------------------------------
| Null Error
|--------------------------------------------------------------------------
*/

test('Null Error', () => {

    const response = ResponseFactory.error(
        '5',
        null
    );

    if (response.type !== 'error')
        throw new Error('Invalid response type');

    if (response.id !== '5')
        throw new Error('Invalid response id');

    if (response.code !== ErrorCodes.INTERNAL_ERROR)
        throw new Error('Invalid internal error code');

    if (response.message !== 'Internal error')
        throw new Error('Invalid default error message');

});

console.log('\nDone.');