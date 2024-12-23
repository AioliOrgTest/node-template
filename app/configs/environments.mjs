/**
 * All process.env.* must be set in this file and nowhere else
 */
const PORT = process.env.PORT || '8080';
const HOST = process.env.HOST || '0.0.0.0';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LOGGER_SILENT = process.env.LOGGER_SILENT;
const NODE_ENV = process.env.NODE_ENV;

/** 
 * All required environments variables can be checked here
*/
if (!NODE_ENV) {
  const message = 'NODE_ENV is not defined. Please provide it.';
  throw new Error(message);
}

if (!PORT) {
  const message = 'PORT is not defined. Please provide it.';
  throw new Error(message);
}

export default {
  NODE_ENV,
  HOST,
  PORT,
  LOG_LEVEL,
  LOGGER_SILENT,
}
