class ProtocolError extends Error {

    constructor(code, message) {
        super(message);

        this.name = 'ProtocolError';
        this.code = code;

        Error.captureStackTrace?.(
            this,
            ProtocolError
        );
    }

}

module.exports = ProtocolError;