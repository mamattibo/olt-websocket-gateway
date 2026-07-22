const WebSocketService = require('../src/services/WebSocketService');

(async () => {

    const service = new WebSocketService();

    await service.start();

    console.log('WebSocket running...');

})();