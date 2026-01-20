const fastify = require('fastify')({ 
  logger: true,
  trustProxy: true 
});
const cors = require('@fastify/cors');
require('dotenv').config();

// Enable CORS for all origins
fastify.register(cors, {
  origin: '*',  // Allow all in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
});

// ========== HEALTH CHECK ==========
fastify.get('/api/health', async () => {
  return { 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'job-tracker-api',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };
});

// ========== JOBS API ==========
fastify.get('/api/jobs', async (request, reply) => {
  try {
    const filters = request.query || {};
    
    // Mock job data
    const mockJobs = [
      {
        job_id: '1',
        job_title: 'Senior React Developer',
        employer_name: 'Tech Corp Inc',
        job_city: 'Remote',
        job_country: 'USA',
        job_description: 'Looking for experienced React developer with 5+ years experience.',
        job_employment_type: 'FULLTIME',
        job_is_remote: true,
        job_posted_at_timestamp: Math.floor(Date.now() / 1000) - 86400,
        job_required_skills: 'React, JavaScript, TypeScript, CSS',
        job_apply_link: 'https://example.com/apply/1',
        match_score: 85,
        match_reasons: ['React experience', 'JavaScript skills']
      },
      {
        job_id: '2',
        job_title: 'Full Stack Engineer',
        employer_name: 'Startup XYZ',
        job_city: 'New York',
        job_country: 'USA',
        job_description: 'Full stack developer needed for fast-growing startup.',
        job_employment_type: 'FULLTIME',
        job_is_remote: false,
        job_posted_at_timestamp: Math.floor(Date.now() / 1000) - 172800,
        job_required_skills: 'Node.js, React, MongoDB, AWS',
        job_apply_link: 'https://example.com/apply/2',
        match_score: 72,
        match_reasons: ['Full stack skills', 'Node.js experience']
      }
    ];
    
    return {
      jobs: mockJobs,
      bestMatches: mockJobs.filter(job => job.match_score >= 70),
      total: mockJobs.length,
      hasResume: true
    };
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    reply.code(500).send({ error: 'Failed to fetch jobs' });
  }
});

// ========== RESUME UPLOAD ==========
fastify.post('/api/resume/upload', async (request, reply) => {
  try {
    const { text, fileName } = request.body || {};
    
    if (!text) {
      return reply.code(400).send({ error: 'Resume text is required' });
    }
    
    console.log('Resume uploaded:', fileName?.substring(0, 50) + '...');
    
    return { 
      success: true, 
      message: 'Resume uploaded successfully',
      fileName: fileName || 'resume.pdf',
      length: text.length
    };
    
  } catch (error) {
    console.error('Error uploading resume:', error);
    reply.code(500).send({ error: 'Failed to upload resume' });
  }
});

// ========== APPLICATIONS ==========
fastify.post('/api/applications', async (request, reply) => {
  try {
    const { job } = request.body || {};
    
    if (!job) {
      return reply.code(400).send({ error: 'Job data is required' });
    }
    
    const application = {
      id: `app_${Date.now()}`,
      job_title: job.job_title || 'Unknown',
      company: job.employer_name || 'Unknown',
      status: 'applied',
      applied_date: new Date().toISOString(),
      match_score: job.match_score || 0
    };
    
    return {
      success: true,
      application,
      message: 'Application tracked successfully'
    };
    
  } catch (error) {
    console.error('Error tracking application:', error);
    reply.code(500).send({ error: 'Failed to track application' });
  }
});

fastify.get('/api/applications', async (request, reply) => {
  try {
    return {
      applications: [],
      stats: {
        total: 0,
        byStatus: { applied: 0, interview: 0, offer: 0, rejected: 0 },
        avgMatchScore: 0
      }
    };
  } catch (error) {
    console.error('Error getting applications:', error);
    reply.code(500).send({ error: 'Failed to get applications' });
  }
});

// ========== AI CHAT ==========
fastify.post('/api/chat', async (request, reply) => {
  try {
    const { message } = request.body || {};
    
    if (!message) {
      return reply.code(400).send({ error: 'Message is required' });
    }
    
    const response = {
      response: `I'm your AI assistant. You asked: "${message}". In demo mode, I can suggest job filters based on your query.`,
      filters: {},
      type: 'jobs'
    };
    
    // Simple keyword matching for filters
    if (message.toLowerCase().includes('remote')) {
      response.filters.work_mode = 'remote';
    }
    if (message.toLowerCase().includes('react')) {
      response.filters.skills = 'react';
    }
    
    return {
      success: true,
      ...response
    };
    
  } catch (error) {
    console.error('Error processing chat:', error);
    reply.code(500).send({ error: 'Chat service failed' });
  }
});

// ========== STATS ==========
fastify.get('/api/stats', async (request, reply) => {
  try {
    return {
      total: 0,
      byStatus: { applied: 0, interview: 0, offer: 0, rejected: 0 },
      avgMatchScore: 0,
      hasResume: false,
      resumeLength: 0
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    reply.code(500).send({ error: 'Failed to get stats' });
  }
});

// ========== ROOT ==========
fastify.get('/', async () => {
  return { 
    message: 'Job Tracker API is running',
    endpoints: [
      'GET  /api/health',
      'GET  /api/jobs',
      'POST /api/resume/upload',
      'POST /api/applications',
      'GET  /api/applications',
      'POST /api/chat',
      'GET  /api/stats'
    ]
  };
});

// ========== 404 HANDLER ==========
fastify.setNotFoundHandler((request, reply) => {
  reply.code(404).send({ 
    error: 'Route not found',
    path: request.url,
    method: request.method,
    availableRoutes: [
      'GET  /',
      'GET  /api/health',
      'GET  /api/jobs',
      'POST /api/resume/upload',
      'POST /api/applications',
      'GET  /api/applications',
      'POST /api/chat',
      'GET  /api/stats'
    ]
  });
});

// ========== START SERVER ==========
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
    console.log(`🌐 CORS: Enabled for all origins`);
    
  } catch (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
};

start();