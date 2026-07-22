const { WebSocket } = require('ws');

class ClientSession {
    constructor(id, ws, request = null) {
        this.id = id;
        this.ws = ws;
        this.connectedAt = new Date();
        this.remoteAddress = request?.socket?.remoteAddress ?? null;
        // Data bebas untuk dispatcher / authentication / heartbeat / dll.
        this.data = {};
    }

    get isConnected() {
        return this.ws.readyState === WebSocket.OPEN;
    }

    send(text) {
        if (!this.isConnected)
            return false;

        this.ws.send(text);
        return true;
    }

    sendJson(object) {
        return this.send(
            JSON.stringify(object)
        );
    }

    close(code = 1000, reason = '') {
        if (!this.isConnected)
            return;
        this.ws.close(code, reason);
    }
}

module.exports = ClientSession;