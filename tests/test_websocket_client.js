const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {

    console.log('CONNECTED');

    setTimeout(() => {
        ws.close();
    }, 2000);

});

ws.on('close', () => {

    console.log('DISCONNECTED');

    process.exit(0);

});

ws.on('error', err => {

    console.error(err);

    process.exit(1);

});