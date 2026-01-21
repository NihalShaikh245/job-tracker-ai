const fastify = require('fastify')({ 
  logger: true,
  trustProxy: true 
});
const cors = require('@fastify/cors');
require('dotenv').config();

// Enable CORS
fastify.register(cors, {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
});

// Health check
fastify.get('/api/health', async () => {
  return { 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'job-tracker-api',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };
});

// Jobs API with filtering
fastify.get('/api/jobs', async (request, reply) => {
  try {
    const filters = request.query || {};
    const mockJobs = getMockJobs();
    let filteredJobs = [...mockJobs];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.job_title.toLowerCase().includes(query) ||
        job.employer_name.toLowerCase().includes(query)
      );
    }

    if (filters.match_score === 'high') {
      filteredJobs = filteredJobs.filter(job => job.match_score >= 70);
    } else if (filters.match_score === 'medium') {
      filteredJobs = filteredJobs.filter(job => job.match_score >= 40 && job.match_score < 70);
    }

    if (filters.job_type && filters.job_type !== 'all') {
      filteredJobs = filteredJobs.filter(job => 
        job.job_employment_type.toLowerCase() === filters.job_type
      );
    }

    if (filters.work_mode === 'remote') {
      filteredJobs = filteredJobs.filter(job => job.job_is_remote);
    } else if (filters.work_mode === 'onsite') {
      filteredJobs = filteredJobs.filter(job => !job.job_is_remote);
    }

    if (filters.skills) {
      const skills = filters.skills.toLowerCase().split(',');
      filteredJobs = filteredJobs.filter(job => {
        const jobSkills = job.job_required_skills.toLowerCase();
        return skills.some(skill => jobSkills.includes(skill.trim()));
      });
    }

    return {
      jobs: filteredJobs,
      bestMatches: filteredJobs.filter(job => job.match_score >= 70).slice(0, 6),
      total: filteredJobs.length,
      hasResume: true
    };

  } catch (error) {
    console.error('Error:', error);
    reply.code(500).send({ error: 'Failed to fetch jobs' });
  }
});

// Other endpoints...
fastify.post('/api/resume/upload', async (request, reply) => {
  const { text, fileName } = request.body || {};
  if (!text) return reply.code(400).send({ error: 'Resume text required' });
  return { success: true, message: 'Resume uploaded', fileName, length: text.length };
});

fastify.post('/api/applications', async (request, reply) => {
  const { job } = request.body || {};
  if (!job) return reply.code(400).send({ error: 'Job data required' });
  return { 
    success: true, 
    application: {
      id: `app_${Date.now()}`,
      job_title: job.job_title,
      company: job.employer_name,
      status: 'applied',
      applied_date: new Date().toISOString()
    }
  };
});

fastify.get('/api/applications', async (request, reply) => {
  return { applications: [], stats: { total: 0, byStatus: { applied: 0, interview: 0, offer: 0, rejected: 0 } } };
});

fastify.post('/api/chat', async (request, reply) => {
  const { message } = request.body || {};
  if (!message) return reply.code(400).send({ error: 'Message required' });
  
  const filters = {};
  const msg = message.toLowerCase();
  if (msg.includes('remote')) filters.work_mode = 'remote';
  if (msg.includes('react')) filters.skills = 'react';
  if (msg.includes('senior')) filters.query = 'senior developer';
  
  return {
    success: true,
    response: `AI Assistant: I'll help you find jobs. Try using the filters above!`,
    filters,
    type: 'jobs'
  };
});

fastify.get('/api/stats', async (request, reply) => {
  return {
    total: 0,
    byStatus: { applied: 0, interview: 0, offer: 0, rejected: 0 },
    avgMatchScore: 68,
    hasResume: true,
    resumeLength: 1500
  };
});

// Helper function
function getMockJobs() {
  return [
    {
      job_id: '1', job_title: 'Senior React Developer', employer_name: 'Tech Corp',
      job_city: 'Remote', job_country: 'USA', match_score: 85,
      job_description: 'Looking for React developer with 5+ years experience.',
      job_employment_type: 'FULLTIME', job_is_remote: true,
      job_posted_at_timestamp: Math.floor(Date.now() / 1000) - 86400,
      job_required_skills: 'React, JavaScript, TypeScript, CSS',
      job_apply_link: 'https://example.com/apply/1',
      match_reasons: ['React experience', 'JavaScript skills']
    },
    // Add 4-5 more mock jobs...
  ];
}

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 5000;
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    await fastify.listen({ port, host });
    console.log(`✅ Server running on ${host}:${port}`);
  } catch (err) {
    console.error('❌ Server failed:', err);
    process.exit(1);
  }
};

start();