const { Redis } = require('@upstash/redis');

class RedisService {
  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  async setUserResume(userId, resumeText) {
    await this.redis.set(`user:${userId}:resume`, resumeText);
  }

  async getUserResume(userId) {
    return await this.redis.get(`user:${userId}:resume`);
  }

  async cacheJobs(key, jobs, ttl = 3600) {
    await this.redis.setex(`jobs:${key}`, ttl, JSON.stringify(jobs));
  }

  async getCachedJobs(key) {
    const data = await this.redis.get(`jobs:${key}`);
    return data ? JSON.parse(data) : null;
  }
}

module.exports = new RedisService();