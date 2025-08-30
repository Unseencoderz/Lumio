import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { uploadRoutes } from './routes/upload';
import { jobRoutes } from './routes/jobs';
import { analyzeRoutes } from './routes/analyze';
import { historyRoutes } from './routes/history';
import { initSentry } from './utils/sentry';
import { redisClient } from './utils/redis';
import { startWorker } from './workers/processJob';

// Initialize Sentry for error tracking
initSentry();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Request parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logging middleware
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  }, 'Incoming request');
  next();
});

// Rate limiting
app.use('/api', rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api', uploadRoutes);
app.use('/api', jobRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', historyRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  await redisClient.quit();
  process.exit(0);
});

// Start background worker
startWorker().catch((error) => {
  logger.error(error, 'Failed to start worker');
  process.exit(1);
});

export { app };