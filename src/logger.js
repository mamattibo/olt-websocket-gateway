const path = require('path');
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => {
            return `[${info.timestamp}] ${info.level.toUpperCase()} : ${info.message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: path.resolve(__dirname, '../logs/app.log')
        })
    ]
});
module.exports = logger;
