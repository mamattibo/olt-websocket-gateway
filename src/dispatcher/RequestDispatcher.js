const ResponseFactory = require('../protocol/ResponseFactory');

const logger = require('../logger');

class RequestDispatcher {
    constructor(commandService, validator) {
        this.commandService = commandService;
        this.validator = validator;
    }

    async dispatch(session, request) {
        try {
            request = this.validator.validate(request);

            logger.debug(
                `Request : ${request.command}`
            );
            const result = await this.commandService.execute(
                request?.command,
                ...request?.args
            );
            session.sendJson(
                ResponseFactory.success(
                    request.id,
                    result
                )
            );

        } catch (err) {
            const command = request?.command ?? '-';
            logger.error(
                `Request Failed : ${command} : ${err.message}`
            );
            session.sendJson(
                ResponseFactory.error(
                    request?.id,
                    err
                )
            );
        }
    }
}

module.exports = RequestDispatcher;