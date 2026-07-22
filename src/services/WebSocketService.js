const { WebSocketServer } = require('ws');
const { randomUUID } = require('crypto');

const BaseService = require('./BaseService');
const ClientSession = require('../models/ClientSession');

const logger = require('../logger');
const config = require('../config');

class WebSocketService extends BaseService {

    constructor(dispatcher) {
        super('WebSocketService');
        this.server = null;
        this.clients = new Map();
        this.dispatcher = dispatcher;
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

        for (const session of this.clients.values()) {
            session.close();
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

    get(clientId) {

        return this.clients.get(clientId);

    }

    count() {

        return this.clients.size;

    }

    onConnection(ws, request) {

        const clientId = randomUUID();

        const session = new ClientSession(
            clientId,
            ws,
            request
        );

        this.clients.set(
            clientId,
            session
        );

        logger.info(
            `Client Connected : ${clientId}`
        );

        ws.on(
            'close',
            () => this.onClose(session)
        );
        ws.on(
            'message',
            (message) => this.onMessage(
                session,
                message
            )
        );
    }

    onClose(session) {

        this.clients.delete(session.id);

        logger.info(
            `Client Disconnected : ${session.id}`
        );

    }
    async onMessage(session, message) {
        let request;
        try {
            request = JSON.parse(
                message.toString()
            );

        } catch (err) {
            logger.error(
                `Invalid JSON : ${err.message}`
            );

            session.sendJson({
                type: 'error',
                id: null,
                message: 'Invalid JSON'
            });
            return;
        }

        try {
            await this.dispatcher.dispatch(
                session,
                request
            );
        } catch (err) {
            logger.error(
                `Dispatcher Error : ${err.message}`
            );
            session.sendJson({
                type: 'error',
                id: request?.id ?? null,
                message: 'Internal Server Error'
            });
        }
    }
}

module.exports = WebSocketService;