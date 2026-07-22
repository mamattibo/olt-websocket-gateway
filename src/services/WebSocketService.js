const { WebSocketServer } = require('ws');
const { randomUUID } = require('crypto');

const BaseService = require('./BaseService');
const logger = require('../logger');
const config = require('../config');

class WebSocketService extends BaseService {

    constructor() {
        super('WebSocketService');
        this.server = null;
        // clientId => WebSocket
        this.clients = new Map();
    }

    async start() {
        if (this.running)
            return;

        logger.info('Starting WebSocket Service...');

        this.server = new WebSocketServer({
            port: config.websocket.port
        });

        logger.info(
            `WebSocket listening on port ${config.websocket.port}`
        );

        this.server.on(
            'connection',
            (ws, request) => this.onConnection(ws, request)
        );

        this.server.on(
            'error',
            err => {
                logger.error(
                    `WebSocket Error : ${err.message}`
                );
            }
        );

        await super.start();

    }

    async stop() {

        if (!this.running)
            return;

        logger.info('Stopping WebSocket Service...');

        for (const ws of this.clients.values()) {
            ws.close();
        }

        this.clients.clear();

        if (this.server) {

            await new Promise(resolve => {
                this.server.close(resolve);
            });

            this.server = null;

        }

        await super.stop();

    }

    onConnection(ws, request) {

        const clientId = randomUUID();

        this.clients.set(clientId, ws);

        logger.info(
            `Client Connected : ${clientId}`
        );

        ws.on(
            'close',
            () => this.onClose(clientId)
        );

    }

    onClose(clientId) {

        this.clients.delete(clientId);

        logger.info(
            `Client Disconnected : ${clientId}`
        );

    }

}

module.exports = WebSocketService;