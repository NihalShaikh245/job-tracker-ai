const crypto = require('crypto');

const securityMiddleware = async (request, reply) => {
  // Add security headers
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-Frame-Options', 'DENY');
  reply.header('X-XSS-Protection', '1; mode=block');
  reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Rate limiting per IP
  const ip = request.ip;
  const key = `rate:${ip}`;
  const requests = await redis.incr(key);
  
  if (requests === 1) {
    await redis.expire(key, 60);
  }
  
  if (requests > 100) {
    reply.code(429).send({ error: 'Too many requests' });
    return;
  }
  
  // Validate API keys format
  if (request.headers['x-api-key']) {
    const isValid = validateApiKey(request.headers['x-api-key']);
    if (!isValid) {
      reply.code(401).send({ error: 'Invalid API key' });
      return;
    }
  }
};

function validateApiKey(key) {
  // Simple validation - in production use proper key validation
  return key && key.length > 20;
}

function encryptData(data, secret) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secret), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    content: encrypted,
    tag: cipher.getAuthTag().toString('hex')
  };
}

module.exports = { securityMiddleware, encryptData };