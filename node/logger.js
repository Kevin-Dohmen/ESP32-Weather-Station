const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'api.log');

function formatParams(params) {
    return Object.entries(params).map(([key, value]) => `${key}: ${value}`).join(', ');
}

function logFunctionCall(functionName, params) {
    const timestamp = new Date().toISOString();
    const formattedParams = formatParams(params);
    const logMessage = `[${timestamp}] Function: ${functionName}, Params: ${formattedParams}\n`;
    fs.appendFileSync(logFilePath, logMessage);
}

module.exports = logFunctionCall;