import app from './app.mjs'
import environments from './configs/environments.mjs';
import logger from './configs/winston.mjs';

export default function start() {
  app.listen(environments.PORT, environments.HOST, () => {
    logger.info(`Listening on port ${environments.PORT}!`)
  });
}
