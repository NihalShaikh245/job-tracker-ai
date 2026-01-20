const fastify = require('fastify')({ 
  logger: process.env.NODE_ENV === 'development',
  trustProxy: true 
});
const cors = require('@fastify/cors');  // Changed from fastify-cors
require('dotenv').config();

// Production CORS settings
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL, 'http://localhost:3000']
  : 'http://localhost:3000';

fastify.register(cors, {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
});

// Import routes
fastify.register(require('./routes/jobRoutes'), { prefix: '/api' });

// Health check endpoint
fastify.get('/api/health', async () => {
  return { 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'job-tracker-api',
    version: '1.0.0'
  };
});

// Root endpoint
fastify.get('/', async () => {
  return { 
    message: 'Job Tracker API is running',
    docs: '/api/health for health check'
  };
});

// Handle 404
fastify.setNotFoundHandler((request, reply) => {
  reply.code(404).send({ 
    error: 'Route not found',
    path: request.url,
    method: request.method,
    availableRoutes: ['/api/health', '/api/jobs', '/api/applications', '/api/chat']
  });
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  console.error('Server error:', error);
  
  if (error.statusCode === 429) {
    reply.code(429).send({ 
      error: 'Too many requests. Please try again later.' 
    });
  } else {
    reply.code(error.statusCode || 500).send({ 
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 5000;
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    await fastify.listen({ 
      port: port,
      host: host
    });
    
    console.log(`✅ Server running on ${host}:${port}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS allowed: ${allowedOrigins}`);
    
  } catch (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
};

start();