import rateLimit from 'express-rate-limit';
import { config } from '../config/config';
import { redisClient } from '../utils/redis';

// Custom Redis store for rate limiting
class RedisStore {
  private prefix: string;

  constructor(prefix = 'rl:') {
    this.prefix = prefix;
  }

  async increment(key: string): Promise<{ totalHits: number; timeToExpire?: number }> {
    const redisKey = `${this.prefix}${key}`;
    
    const multi = redisClient.multi();
    multi.incr(redisKey);
    multi.expire(redisKey, 3600); // 1 hour TTL
    multi.ttl(redisKey);
    
    const results = await multi.exec();
    
    if (!results) {
      throw new Error('Redis transaction failed');
    }

    const totalHits = results[0]?.[1] as number;
    const ttl = results[2]?.[1] as number;
    
    return {
      totalHits,
      timeToExpire: ttl > 0 ? ttl * 1000 : undefined,
    };
  }

  async decrement(key: string): Promise<void> {
    const redisKey = `${this.prefix}${key}`;
    await redisClient.decr(redisKey);
  }

  async resetKey(key: string): Promise<void> {
    const redisKey = `${this.prefix}${key}`;
    await redisClient.del(redisKey);
  }
}

export const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: config.rateLimitUploadsPerHour,
  message: {
    error: `Too many upload requests. Limit is ${config.rateLimitUploadsPerHour} per hour.`,
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore('rate_limit:'),
  keyGenerator: (req) => {
    // Use IP address for rate limiting
    return req.ip || 'unknown';
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
});