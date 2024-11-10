export function logger(Message, level = logLevel.INFO) {
    switch (level) {
        case logLevel.INFO:
            console.log(Message);
            break;
        case logLevel.WARNING:
            console.warn(Message);
            break;
        case logLevel.ERROR:
            console.error(Message);
            break;
        default:
            console.log(Message);
            break;
    }
}

export const logLevel = {
    INFO: 'INFO',
    WARNING: 'WARNING',
    ERROR: 'ERROR'
}