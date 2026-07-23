const ErrorCodes = Object.freeze({

    // Request

    REQUEST_INVALID:
        'REQUEST_INVALID',

    REQUEST_INVALID_TYPE:
        'REQUEST_INVALID_TYPE',

    REQUEST_INVALID_ID:
        'REQUEST_INVALID_ID',

    REQUEST_INVALID_COMMAND:
        'REQUEST_INVALID_COMMAND',

    REQUEST_INVALID_ARGUMENTS:
        'REQUEST_INVALID_ARGUMENTS',

    // Command

    COMMAND_UNKNOWN:
        'COMMAND_UNKNOWN',

    COMMAND_FAILED:
        'COMMAND_FAILED',

    COMMAND_NOT_SUPPORTED:
        'COMMAND_NOT_SUPPORTED',

    // Queue

    QUEUE_FULL:
        'QUEUE_FULL',

    QUEUE_TIMEOUT:
        'QUEUE_TIMEOUT',

    QUEUE_CANCELLED:
        'QUEUE_CANCELLED',

    // SSH

    SSH_DISCONNECTED:
        'SSH_DISCONNECTED',

    SSH_TIMEOUT:
        'SSH_TIMEOUT',

    SSH_AUTH_FAILED:
        'SSH_AUTH_FAILED',

    SSH_EXEC_FAILED:
        'SSH_EXEC_FAILED',

    // Session

    SESSION_CLOSED:
        'SESSION_CLOSED',

    SESSION_EXPIRED:
        'SESSION_EXPIRED',

    // Internal

    INTERNAL_ERROR:
        'INTERNAL_ERROR'

});

module.exports = ErrorCodes;