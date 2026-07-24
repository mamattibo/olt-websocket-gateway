const PromptParser = require('../src/context/PromptParser');
const PromptModes = require('../src/context/PromptModes');

const parser = new PromptParser();

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
    } catch (err) {
        console.log(`✗ ${name}`);
        console.error(err);
    }
}

console.log('\n=== PromptParser Test ===\n');

test('EXEC Prompt', () => {
    const r = parser.parse('ZXAN#');

    if (r.hostname !== 'ZXAN')
        throw new Error('Invalid hostname');

    if (r.mode !== PromptModes.EXEC)
        throw new Error('Invalid mode');

    if (r.target !== null)
        throw new Error('Invalid target');
});

test('CONFIG Prompt', () => {
    const r = parser.parse('ZXAN(config)#');

    if (r.mode !== PromptModes.CONFIG)
        throw new Error('Invalid mode');
});

test('CONFIG_GPON Prompt', () => {
    const r = parser.parse('ZXAN(config-gpon)#');

    if (r.mode !== PromptModes.CONFIG_GPON)
        throw new Error('Invalid mode');
});

test('CONFIG_PON Prompt', () => {
    const r = parser.parse('ZXAN(config-pon)#');

    if (r.mode !== PromptModes.CONFIG_PON)
        throw new Error('Invalid mode');
});

test('CONFIG_IF Prompt', () => {
    const r = parser.parse('ZXAN(config-if)#');

    if (r.mode !== PromptModes.CONFIG_IF)
        throw new Error('Invalid mode');
});

test('GPON_ONU_MNG Prompt', () => {
    const r = parser.parse(
        'ZXAN(gpon-onu-mng 1/2/1:1)#'
    );

    if (r.mode !== PromptModes.GPON_ONU_MNG)
        throw new Error('Invalid mode');

    if (r.target !== '1/2/1:1')
        throw new Error('Invalid target');
});

test('Invalid Prompt', () => {

    let ok = false;

    try {
        parser.parse('abcdef');
    } catch (err) {
        ok = true;
    }

    if (!ok)
        throw new Error('Should throw');

});

console.log('\nDone.');