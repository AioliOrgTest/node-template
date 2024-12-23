import winston from 'winston';
import environments from './environments.mjs';

let loggerSilentFlag = false;
let logLevel = environments.LOG_LEVEL;

if (environments.LOGGER_SILENT === 'true') {
  loggerSilentFlag = true;
}

if (!logLevel) { logLevel = 'warn'; }

const transports = {
  // - Write all warn level logs to console
  // npm logging levels are prioritized from 0 to 5 (highest to lowest):
  /* {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
  } */
  console: new winston.transports.Console({ level: logLevel, handleExceptions: true }),
};

const logger = winston.createLogger({
  format: winston.format.combine(
    // winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports:  [transports.console],
  exitOnError: false,
  silent:      loggerSilentFlag,
});

// Alias for ss-node-rdkafka-lib that need the trace function
logger.trace = function (message) { logger.debug(message); };

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (environments.NODE_ENV !== 'production') {
  logger.remove(transports.console); // So let's remove the previous console logger
  // And add the new one.
  logger.add(new winston.transports.Console({
    format: winston.format.simple(), level: logLevel, handleExceptions: true,
  }));
}

export default logger;
