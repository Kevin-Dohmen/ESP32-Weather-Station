import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create logger instance
const logger = createLogger({
  level: 'info',  // Default level is info, you can adjust it
  format: combine(
    colorize(),  // Add colors to log levels
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(),  // Log to the console
    new transports.File({ filename: 'logs/app.log' })  // Log to a file
  ],
});


export default logger;