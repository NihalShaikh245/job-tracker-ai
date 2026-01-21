const fastify = require('fastify')({ 
  logger: true,
  trustProxy: true 
});
const cors = require('@fastify/cors');

// Enable CORS
fastify.register(cors, {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
});

// ========== HEALTH CHECK ==========
fastify.get('/api/health', async (request, reply) => {
  return { 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'job-tracker-api',
    version: '1.0.0',
    port: process.env.PORT || 5000
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
      },
      {
        job_id: '3',
        job_title: 'Frontend Developer',
        employer_name: 'Digital Solutions',
        job_city: 'Remote',
        job_country: 'USA',
        job_description: 'Frontend developer needed for e-commerce platform.',
        job_employment_type: 'CONTRACTOR',
        job_is_remote: true,
        job_posted_at_timestamp: Math.floor(Date.now() / 1000) - 259200,
        job_required_skills: 'React, Redux, CSS, Responsive Design',
        job_apply_link: 'https://example.com/apply/3',
        match_score: 65,
        match_reasons: ['React proficiency', 'UI/UX skills']
      }
    ];
    
    // Apply simple filtering
    let filteredJobs = [...mockJobs];
    
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.job_title.toLowerCase().includes(query) ||
        job.employer_name.toLowerCase().includes(query) ||
        job.job_description.toLowerCase().includes(query)
      );
    }
    
    if (filters.match_score === 'high') {
      filteredJobs = filteredJobs.filter(job => job.match_score >= 70);
    } else if (filters.match_score === 'medium') {
      filteredJobs = filteredJobs.filter(job => job.match_score >= 40 && job.match_score < 70);
    }
    
    if (filters.job_type && filters.job_type !== 'all') {
      filteredJobs = filteredJobs.filter(job => 
        job.job_employment_type.toLowerCase() === filters.job_type.toLowerCase()
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
      response: `I'm your AI assistant. You asked: "${message}". I can help you find jobs based on your query.`,
      filters: {},
      type: 'jobs'
    };
    
    // Simple keyword matching for filters
    const msg = message.toLowerCase();
    if (msg.includes('remote')) {
      response.filters.work_mode = 'remote';
    }
    if (msg.includes('react')) {
      response.filters.skills = 'react';
    }
    if (msg.includes('python')) {
      response.filters.skills = 'python';
    }
    if (msg.includes('senior')) {
      response.filters.query = 'senior developer';
    }
    if (msg.includes('figma')) {
      response.filters.skills = 'figma';
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
      avgMatchScore: 65,
      hasResume: true,
      resumeLength: 1500
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
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const HOST = '0.0.0.0';  // CRITICAL: Must be 0.0.0.0 for Render
    
    await fastify.listen({ 
      port: PORT, 
      host: HOST,
      listenTextResolver: (address) => {
        return `Server listening on ${address}`;
      }
    });
    
    console.log(`✅ Server started successfully`);
    console.log(`🌐 Port: ${PORT}`);
    console.log(`🏠 Host: ${HOST}`);
    console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
    
  } catch (err) {
    console.error('❌ Server failed to start:', err);
    console.error('Error details:', err.message);
    process.exit(1);
  }
};

// Start the server
startServer();