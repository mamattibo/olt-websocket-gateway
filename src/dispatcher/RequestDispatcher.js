const logger = require('../logger');

class RequestDispatcher {
    constructor(commandService) {
        this.commandService = commandService;
    }

    async dispatch(session, request) {
        const error = this.validate(request);
        if (error) {
            session.sendJson(
                this.error(request?.id, error)
            );
            return;
        }

        try {
            logger.debug(
                `Request : ${request.command}`
            );
            const result = await this.commandService.execute(
                request.command,
                ...(request.args || [])
            );
            session.sendJson(
                this.success(
                    request.id,
                    result
                )
            );

        } catch (err) {
            logger.error(
                `Request Failed : ${request.command} : ${err.message}`
            );
            session.sendJson(
                this.error(
                    request.id,
                    err.message
                )
            );
        }
    }

    validate(request) {
        if (!request)
            return 'Request is required';
        if (request.type !== 'request')
            return 'Invalid request type';
        if (typeof request.id !== 'string')
            return 'Invalid request id';
        if (typeof request.command !== 'string')
            return 'Invalid command';
        if (
            request.args !== undefined &&
            !Array.isArray(request.args)
        ) {
            return 'Invalid arguments';
        }
        return null;
    }

    success(id, data) {
        return {
            type: 'response',
            id,
            data
        };
    }

    error(id, message) {
        return {
            type: 'error',
            id,
            message
        };
    }

}

module.exports = RequestDispatcher;