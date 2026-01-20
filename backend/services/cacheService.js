const { Redis } = require('@upstash/redis');

class CacheService {
  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    this.defaultTTL = 3600; // 1 hour
  }

  async get(key) {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = this.defaultTTL) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async getOrSet(key, fetchFn, ttl = this.defaultTTL) {
    const cached = await this.get(key);
    if (cached) return cached;

    const freshData = await fetchFn();
    await this.set(key, freshData, ttl);
    return freshData;
  }

  generateJobCacheKey(filters) {
    const sortedKeys = Object.keys(filters).sort();
    const keyParts = sortedKeys.map(k => `${k}=${filters[k]}`);
    return `jobs:${keyParts.join(':')}`;
  }

  generateMatchScoreKey(resumeHash, jobId) {
    return `match:${resumeHash}:${jobId}`;
  }
}

module.exports = new CacheService();