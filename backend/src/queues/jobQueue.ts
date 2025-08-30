import { Queue } from 'bullmq';
import { redisClient } from '../utils/redis';
import { config } from '../config/config';
import { logger } from '../utils/logger';

// Create job queue
export const jobQueue = new Queue('document-processing', {
  connection: {
    host: redisClient.options?.socket?.host || 'localhost',
    port: redisClient.options?.socket?.port || 6379,
    password: redisClient.options?.password,
  },
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Queue event listeners
jobQueue.on('completed', (job) => {
  logger.info({
    jobId: job.id,
    duration: Date.now() - job.timestamp,
  }, 'Job completed');
});

jobQueue.on('failed', (job, error) => {
  logger.error({
    jobId: job?.id,
    error: error.message,
    stack: error.stack,
  }, 'Job failed');
});

jobQueue.on('stalled', (jobId) => {
  logger.warn({ jobId }, 'Job stalled');
});

jobQueue.on('progress', (job, progress) => {
  logger.debug({
    jobId: job.id,
    progress,
  }, 'Job progress updated');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Closing job queue...');
  await jobQueue.close();
});

process.on('SIGINT', async () => {
  logger.info('Closing job queue...');
  await jobQueue.close();
});