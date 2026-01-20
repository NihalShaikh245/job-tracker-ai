const redisService = require('./redisService');

class ApplicationService {
  async createApplication(userId, jobData) {
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const application = {
      id: applicationId,
      userId,
      job_id: jobData.job_id,
      job_title: jobData.job_title,
      company: jobData.employer_name,
      location: `${jobData.job_city}, ${jobData.job_country}`,
      job_type: jobData.job_employment_type,
      work_mode: jobData.job_is_remote ? 'remote' : 'onsite',
      apply_link: jobData.job_apply_link,
      status: 'applied',
      applied_date: new Date().toISOString(),
      match_score: jobData.match_score || 0,
      last_updated: new Date().toISOString(),
      notes: ''
    };
    
    await redisService.redis.hset(
      `user:${userId}:applications`,
      applicationId,
      JSON.stringify(application)
    );
    
    return application;
  }

  async getApplications(userId, filters = {}) {
    const applications = await redisService.redis.hgetall(`user:${userId}:applications`);
    
    if (!applications) return [];
    
    let appArray = Object.values(applications).map(app => JSON.parse(app));
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      appArray = appArray.filter(app => app.status === filters.status);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      appArray = appArray.filter(app => 
        app.job_title.toLowerCase().includes(searchTerm) ||
        app.company.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by date
    appArray.sort((a, b) => 
      new Date(b.applied_date) - new Date(a.applied_date)
    );
    
    return appArray;
  }

  async updateApplication(userId, applicationId, updates) {
    const appKey = `user:${userId}:applications`;
    
    const existing = await redisService.redis.hget(appKey, applicationId);
    if (!existing) throw new Error('Application not found');
    
    const application = JSON.parse(existing);
    const updated = {
      ...application,
      ...updates,
      last_updated: new Date().toISOString()
    };
    
    await redisService.redis.hset(appKey, applicationId, JSON.stringify(updated));
    
    return updated;
  }

  async deleteApplication(userId, applicationId) {
    await redisService.redis.hdel(`user:${userId}:applications`, applicationId);
    return true;
  }

  async getStats(userId) {
    const applications = await this.getApplications(userId);
    
    const stats = {
      total: applications.length,
      byStatus: {
        applied: 0,
        interview: 0,
        offer: 0,
        rejected: 0
      },
      avgMatchScore: 0,
      recentActivity: []
    };
    
    let totalScore = 0;
    
    applications.forEach(app => {
      stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;
      totalScore += app.match_score || 0;
      
      // Get recent updates (last 5)
      if (stats.recentActivity.length < 5) {
        stats.recentActivity.push({
          action: `${app.status.charAt(0).toUpperCase() + app.status.slice(1)}: ${app.job_title}`,
          date: app.last_updated,
          company: app.company
        });
      }
    });
    
    stats.avgMatchScore = applications.length > 0 
      ? Math.round(totalScore / applications.length) 
      : 0;
    
    return stats;
  }
}

module.exports = new ApplicationService();