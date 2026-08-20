import { env } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './config/logger';
import { createApp } from './app';

async function main() {
  await connectDatabase();
  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`API ready on ${env.SERVER_URL}${env.API_PREFIX}`);
  });
}

main().catch((error) => {
  logger.fatal(error, 'Failed to start server');
  process.exit(1);
});
