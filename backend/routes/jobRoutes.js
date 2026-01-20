async function jobRoutes(fastify, options) {
  const jobService = require('../services/jobService');
  const aiService = require('../services/aiService');
  const redisService = require('../services/redisService');
  const applicationService = require('../services/applicationService');
  const chatService = require('../services/chatService');

  // Get jobs with AI matching
  fastify.get('/jobs', async (request, reply) => {
    try {
      const filters = request.query;
      const userId = request.headers['x-user-id'] || 'default';
      
      // Get user's resume for matching
      const resumeText = await redisService.getUserResume(userId);
      
      // Fetch and filter jobs
      const jobs = await jobService.fetchJobs(filters);
      
      // Add AI match scores
      const jobsWithScores = await jobService.addMatchScores(jobs, resumeText);
      
      // Apply match score filter if specified
      let filteredJobs = jobsWithScores;
      if (filters.match_score) {
        filteredJobs = jobsWithScores.filter(job => {
          if (filters.match_score === 'high') return job.match_score >= 70;
          if (filters.match_score === 'medium') return job.match_score >= 40 && job.match_score < 70;
          return true;
        });
      }
      
      // Get best matches (top 6)
      const bestMatches = filteredJobs
        .filter(job => job.match_score >= 70)
        .slice(0, 6);
      
      return {
        jobs: filteredJobs,
        bestMatches,
        total: filteredJobs.length,
        hasResume: !!resumeText
      };
    } catch (error) {
      console.error('Error in /jobs:', error);
      reply.code(500).send({ error: 'Failed to fetch jobs' });
    }
  });

fastify.get('/jobs', async (request, reply) => {
  const { error, value } = validateJobFilters(request.query);
  if (error) {
    reply.code(400).send({ error: error.details[0].message });
    return;
  }
  // Rest of handler...
});

  // Upload resume
  fastify.post('/resume/upload', async (request, reply) => {
    const { userId = 'default', text, fileName } = request.body;
    
    if (!text) {
      reply.code(400).send({ error: 'Resume text is required' });
      return;
    }
    
    await redisService.setUserResume(userId, text);
    
    return { 
      success: true, 
      message: 'Resume uploaded successfully',
      fileName,
      length: text.length,
      extracted: this.extractResumeInfo(text)
    };
  });

  // Apply to job
  fastify.post('/applications', async (request, reply) => {
    const { userId = 'default', job, status = 'applied' } = request.body;
    
    if (!job || !job.job_id) {
      reply.code(400).send({ error: 'Job data is required' });
      return;
    }
    
    const application = await applicationService.createApplication(userId, {
      ...job,
      status
    });
    
    return {
      success: true,
      application,
      message: 'Application tracked successfully'
    };
  });

  // Get user applications
  fastify.get('/applications', async (request, reply) => {
    const userId = request.headers['x-user-id'] || 'default';
    const filters = request.query;
    
    const applications = await applicationService.getApplications(userId, filters);
    const stats = await applicationService.getStats(userId);
    
    return { applications, stats };
  });

  // Update application status
  fastify.patch('/applications/:id', async (request, reply) => {
    const { id } = request.params;
    const { userId = 'default', status, notes } = request.body;
    
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    
    const updated = await applicationService.updateApplication(userId, id, updates);
    
    return {
      success: true,
      application: updated
    };
  });

  // AI Chat endpoint
  fastify.post('/chat', async (request, reply) => {
    const { message, context } = request.body;
    
    if (!message) {
      reply.code(400).send({ error: 'Message is required' });
      return;
    }
    
    const response = await chatService.processQuery(message, context);
    
    return {
      success: true,
      ...response
    };
  });

  // Get application statistics
  fastify.get('/stats', async (request, reply) => {
    const userId = request.headers['x-user-id'] || 'default';
    
    const stats = await applicationService.getStats(userId);
    const resumeText = await redisService.getUserResume(userId);
    
    return {
      ...stats,
      hasResume: !!resumeText,
      resumeLength: resumeText ? resumeText.length : 0
    };
  });
}

module.exports = jobRoutes;