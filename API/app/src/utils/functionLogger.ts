
import logger from './logger'; // Assuming this is the path to your Winston logger setup

// LogFunction implementation
export const FunctionLogger = (
    functionName: string,
    args?: { [key: string]: any },
    logType: 'info' | 'error' | 'warn' | 'debug' = 'info'
) => {
    const caller = functionName;
    const argsString = args
        ? Object.entries(args)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')
        : 'no arguments';
    if (logType === 'error') {
        logger.error(`Function: ${caller} with: ${argsString}`);
        return;
    }
    else if (logType === 'warn') {
        logger.warn(`Function: ${caller} with: ${argsString}`);
        return;
    }
    else if (logType === 'debug') {
        logger.debug(`Function: ${caller} with: ${argsString}`);
        return;
    }
    else {
        logger.info(`Function: ${caller} with: ${argsString}`);
        return;
    }
};