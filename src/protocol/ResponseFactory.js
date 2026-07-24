const ErrorCodes = require('./ErrorCodes');
const ProtocolError = require('./ProtocolError');

class ResponseFactory {

    static success(id, data) {
        return {
            type: 'response',
            id,
            data
        };
    }

    static error(id, err) {
        if (err instanceof ProtocolError) {
            return {
                type: 'error',
                id,
                code: err.code,
                message: err.message
            };
        }

        return {
            type: 'error',
            id,
            code: ErrorCodes.INTERNAL_ERROR,
            message: err?.message ?? 'Internal error'
        };
    }

}

module.exports = ResponseFactory;