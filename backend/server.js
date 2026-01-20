const fastify = require('fastify')({
  logger: process.env.NODE_ENV === 'development',
  trustProxy: true
});

const cors = require('@fastify/cors');
require('dotenv').config();

// Frontend URL based on environment
const FRONTEND_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:3000';

// CORS
fastify.register(cors, {
  origin: FRONTEND_URL,
  credentials: true
});

// Rate limiting
fastify.register(require('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute'
});

// Routes
fastify.register(require('./routes/jobRoutes'), { prefix: '/api' });

// Test route
fastify.get('/api/test', async () => {
  return { message: 'API is working!' };
});

// Health check
fastify.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  if (error.statusCode === 429) {
    reply.code(429).send({
      error: 'Too many requests. Please try again later.'
    });
  } else {
    fastify.log.error(error);
    reply.code(error.statusCode || 500).send({
      error:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : error.message
    });
  }
});

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 5000,
      host: '0.0.0.0'
    });
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
