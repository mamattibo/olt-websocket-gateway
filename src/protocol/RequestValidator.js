class RequestValidator {

    validate(request) {

        if (!request || typeof request !== 'object' || Array.isArray(request)) {
            throw new Error('Request is required');
        }

        if (request.type !== 'request') {
            throw new Error('Invalid request type');
        }

        const idType = typeof request.id;
        if (idType !== 'string' && idType !== 'number') {
            throw new Error('Invalid request id');
        }

        if (typeof request.command !== 'string') {
            throw new Error('Invalid command');
        }

        request.command = request.command.trim();

        if (request.command.length === 0) {
            throw new Error('Invalid command');
        }

        if (request.args === undefined) {
            request.args = [];
        }

        if (!Array.isArray(request.args)) {
            throw new Error('Invalid arguments');
        }

        return request;
    }

}

module.exports = RequestValidator;