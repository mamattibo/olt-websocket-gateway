const ErrorCodes = require('./ErrorCodes');
const ProtocolError = require('./ProtocolError');

class RequestValidator {

    validate(request) {

        if (!request || typeof request !== 'object' || Array.isArray(request)) {
            throw new ProtocolError(
                ErrorCodes.REQUEST_INVALID,
                'Request is required'
            );
        }

        if (request.type !== 'request') {
           throw new ProtocolError(
                ErrorCodes.REQUEST_INVALID_TYPE,
                'Invalid request type'
            );
        }

        const idType = typeof request.id;
        if (idType !== 'string' && idType !== 'number') {
            throw new ProtocolError(
                ErrorCodes.REQUEST_INVALID_ID,
                'Invalid request id'
            );
        }

        if (typeof request.command !== 'string') {
            throw new ProtocolError(
                ErrorCodes.REQUEST_INVALID_COMMAND,
                'Invalid command'
            );
        }

        request.command = request.command.trim();

        if (request.command.length === 0) {
            throw new ProtocolError(
                ErrorCodes.REQUEST_INVALID_COMMAND,
                'Invalid command'
            );
        }

        if (request.args === undefined) {
            request.args = [];
        }

        if (!Array.isArray(request.args)) {
            throw new ProtocolError(
                ErrorCodes.REQUEST_INVALID_ARGUMENTS,
                'Invalid arguments'
            );
        }

        return request;
    }

}

module.exports = RequestValidator;