import environments from '../configs/environments.mjs';
import logger from '../configs/winston.mjs';

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Écoute l'événement de fin de réponse
  res.on('finish', () => {
    const duration = Date.now() - start;

    if (environments.NODE_ENV === 'production') {
      // In production mode to reduce logs size, only errors are logged
      if (res.statusCode >= 400) {
        logger.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
      }
    } else {
      // Log every requests on development
      logger.info(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    }
  });

  next();
}

export default requestLogger;