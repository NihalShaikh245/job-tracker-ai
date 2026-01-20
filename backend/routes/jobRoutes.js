async function jobRoutes(fastify, options) {
  const jobService = require('../services/jobService');
  const applicationService = require('../services/applicationService');
  const chatService = require('../services/chatService');
  const redisService = require('../services/redisService');

  // Get jobs
  fastify.get('/jobs', async (request, reply) => {
    try {
      const filters = request.query;
      const userId = request.headers['x-user-id'] || 'default';
      
      // Get resume for matching
      const resumeText = await redisService.getUserResume(userId) || '';
      
      // Fetch jobs
      let jobs = [];
      if (Object.keys(filters).length === 0) {
        // Use mock data for now
        jobs = jobService.getMockJobs();
      } else {
        jobs = await jobService.fetchJobs(filters);
      }
      
      // Add match scores
      const jobsWithScores = await jobService.addMatchScores(jobs, resumeText);
      
      // Get best matches
      const bestMatches = jobsWithScores
        .filter(job => job.match_score >= 70)
        .slice(0, 6);
      
      return {
        jobs: jobsWithScores,
        bestMatches,
        total: jobsWithScores.length,
        hasResume: !!resumeText
      };
    } catch (error) {
      console.error('Error:', error);
      reply.code(500).send({ error: 'Failed to fetch jobs' });
    }
  });

  // Upload resume
  fastify.post('/resume/upload', async (request, reply) => {
    try {
      const { text, fileName, userId = 'default' } = request.body;
      
      if (!text) {
        reply.code(400).send({ error: 'Resume text is required' });
        return;
      }
      
      await redisService.setUserResume(userId, text);
      
      return { 
        success: true, 
        message: 'Resume uploaded',
        fileName,
        length: text.length
      };
    } catch (error) {
      console.error('Error:', error);
      reply.code(500).send({ error: 'Failed to upload resume' });
    }
  });

  // Apply to job
  fastify.post('/applications', async (request, reply) => {
    try {
      const { job, userId = 'default' } = request.body;
      
      if (!job) {
        reply.code(400).send({ error: 'Job data is required' });
        return;
      }
      
      const application = await applicationService.createApplication(userId, job);
      
      return {
        success: true,
        application,
        message: 'Application tracked'
      };
    } catch (error) {
      console.error('Error:', error);
      reply.code(500).send({ error: 'Failed to track application' });
    }
  });

  // Get applications
  fastify.get('/applications', async (request, reply) => {
    try {
      const userId = request.headers['x-user-id'] || 'default';
      const filters = request.query;
      
      const applications = await applicationService.getApplications(userId, filters);
      const stats = await applicationService.getStats(userId);
      
      return { applications, stats };
    } catch (error) {
      console.error('Error:', error);
      reply.code(500).send({ error: 'Failed to get applications' });
    }
  });

  // AI Chat
  fastify.post('/chat', async (request, reply) => {
    try {
      const { message } = request.body;
      
      if (!message) {
        reply.code(400).send({ error: 'Message is required' });
        return;
      }
      
      const response = await chatService.processQuery(message);
      
      return {
        success: true,
        ...response
      };
    } catch (error) {
      console.error('Error:', error);
      reply.code(500).send({ error: 'Chat service failed' });
    }
  });

  // Stats
  fastify.get('/stats', async (request, reply) => {
    try {
      const userId = request.headers['x-user-id'] || 'default';
      
      const stats = await applicationService.getStats(userId);
      const resumeText = await redisService.getUserResume(userId);
      
      return {
        ...stats,
        hasResume: !!resumeText,
        resumeLength: resumeText ? resumeText.length : 0
      };
    } catch (error) {
      console.error('Error:', error);
      reply.code(500).send({ error: 'Failed to get stats' });
    }
  });
}

module.exports = jobRoutes;