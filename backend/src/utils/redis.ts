import { createClient } from 'redis';
import { config } from '../config/config';
import { logger } from './logger';

// Create Redis client with support for both local and cloud configurations
const createRedisClient = () => {
  // If we have individual Redis config (for cloud Redis), use that
  if (config.redisHost && config.redisPort) {
    return createClient({
      username: config.redisUsername || 'default',
      password: config.redisPassword,
      socket: {
        host: config.redisHost,
        port: config.redisPort,
      },
    });
  }
  
  // Otherwise, use the URL (for local Redis or URL-based cloud Redis)
  return createClient({
    url: config.redisUrl || 'redis://localhost:6379',
  });
};

export const redisClient = createRedisClient();

redisClient.on('error', (error) => {
  logger.error(error, 'Redis client error');
});

redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('disconnect', () => {
  logger.warn('Redis client disconnected');
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error(error, 'Failed to connect to Redis');
    process.exit(1);
  }
})();