const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const logFilePath = path.join(__dirname, 'api-%DATE%.log');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
    ),
    transports: [
        new DailyRotateFile({
            filename: logFilePath,
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d'
        }),
        new transports.Console()
    ]
});

function formatParams(params) {
    return Object.entries(params).map(([key, value]) => `${key}: ${value}`).join(', ');
}

function logFunctionCall(functionName, params) {
    const formattedParams = formatParams(params);
    const logMessage = `Function: ${functionName}, Params: ${formattedParams}`;
    logger.info(logMessage);
}

module.exports = logFunctionCall;