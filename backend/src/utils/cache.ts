import { createHash } from 'crypto';
import { redisClient } from './redis';
import { logger } from './logger';
import { config } from '../config/config';

export class CacheService {
  private static readonly CACHE_PREFIX = 'Lumio:cache:';
  private static readonly DEFAULT_TTL = 24 * 60 * 60; // 24 hours

  static generateKey(text: string): string {
    const hash = createHash('sha256').update(text).digest('hex');
    return `${this.CACHE_PREFIX}${hash}`;
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redisClient.get(key);
      if (cached) {
        return JSON.parse(cached) as T;
      }
      return null;
    } catch (error) {
      logger.error(error, `Failed to get cache key: ${key}`);
      return null;
    }
  }

  static async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const ttl = ttlSeconds ?? this.DEFAULT_TTL;
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      logger.error(error, `Failed to set cache key: ${key}`);
    }
  }

  static async getCachedAnalysis(text: string): Promise<unknown | null> {
    const key = this.generateKey(text);
    return this.get(key);
  }

  static async setCachedAnalysis(text: string, analysis: unknown): Promise<void> {
    const key = this.generateKey(text);
    await this.set(key, analysis, config.jobTtlSeconds);
  }
}