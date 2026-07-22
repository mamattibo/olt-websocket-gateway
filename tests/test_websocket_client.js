const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {

    console.log('CONNECTED');

    ws.send(JSON.stringify({
        type: 'request',
        id: '1',
        command: 'showCard',
        args: []
    }));
});
ws.on('close', () => {
    console.log('DISCONNECTED');
    process.exit(0);

});

ws.on('message', (data) => {
    console.log(data.toString());
    setTimeout(() => {
        ws.close();
    }, 2000);

});

ws.on('error', err => {

    console.error(err);

    process.exit(1);

});