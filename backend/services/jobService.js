const axios = require('axios');
const crypto = require('crypto');
const aiService = require('./aiService');
const redisService = require('./redisService');
const cacheService = require('./cacheService');

class JobService {
  constructor() {
    this.rapidApiKey = process.env.RAPIDAPI_KEY;
    this.rapidApiHost = process.env.RAPIDAPI_HOST;
    this.useMockData = !this.rapidApiKey;
  }

  // Fetch jobs from cache or API
  async fetchJobs(filters = {}) {
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(filters);
      const cached = await redisService.getCachedJobs(cacheKey);
      if (cached) return cached;

      let jobs = [];

      if (this.useMockData) {
        jobs = this.getMockJobs();
      } else {
        jobs = await this.fetchFromRapidAPI(filters);
      }

      // Apply local filters
      jobs = this.applyLocalFilters(jobs, filters);

      // Cache the results
      await redisService.cacheJobs(cacheKey, jobs);

      return jobs;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return this.getMockJobs();
    }
  }

  async fetchFromRapidAPI(filters) {
    const options = {
      method: 'GET',
      url: `https://${this.rapidApiHost}/search`,
      params: {
        query: filters.query || 'developer',
        page: filters.page || 1,
        num_pages: filters.num_pages || 1,
        employment_types: filters.job_type,
        date_posted: filters.date_posted,
        remote_jobs_only: filters.work_mode === 'remote' ? true : undefined,
        ...this.mapFilters(filters)
      },
      headers: {
        'X-RapidAPI-Key': this.rapidApiKey,
        'X-RapidAPI-Host': this.rapidApiHost
      }
    };

    const response = await axios.request(options);
    return response.data.data || [];
  }

  mapFilters(filters) {
    const mapped = {};
    if (filters.location) mapped.location = filters.location;
    if (filters.salary_min) mapped.salary_min = filters.salary_min;
    if (filters.experience) mapped.experience = filters.experience;
    return mapped;
  }

  applyLocalFilters(jobs, filters) {
    let filtered = [...jobs];

    // Job type
    if (filters.job_type && filters.job_type !== 'all') {
      filtered = filtered.filter(
        job => job.job_employment_type?.toLowerCase() === filters.job_type.toLowerCase()
      );
    }

    // Work mode
    if (filters.work_mode && filters.work_mode !== 'all') {
      if (filters.work_mode === 'remote') {
        filtered = filtered.filter(job => job.job_is_remote);
      } else if (filters.work_mode === 'hybrid') {
        filtered = filtered.filter(job =>
          job.job_description?.toLowerCase().includes('hybrid')
        );
      } else if (filters.work_mode === 'onsite') {
        filtered = filtered.filter(job => !job.job_is_remote);
      }
    }

    // Skills filter
    if (filters.skills && filters.skills.length > 0) {
      const skills = filters.skills.split(',');
      filtered = filtered.filter(job => {
        const jobText = `${job.job_title} ${job.job_description} ${job.job_required_skills || ''}`.toLowerCase();
        return skills.some(skill => jobText.includes(skill.toLowerCase()));
      });
    }

    // Date posted
    if (filters.date_posted) {
      const now = Date.now();
      const cutoff = {
        '24h': now - 24 * 60 * 60 * 1000,
        'week': now - 7 * 24 * 60 * 60 * 1000,
        'month': now - 30 * 24 * 60 * 60 * 1000
      }[filters.date_posted];

      if (cutoff) {
        filtered = filtered.filter(job => {
          const jobDate = new Date(job.job_posted_at_timestamp * 1000);
          return jobDate.getTime() > cutoff;
        });
      }
    }

    return filtered;
  }

  generateCacheKey(filters) {
    return Object.keys(filters)
      .sort()
      .map(key => `${key}=${filters[key]}`)
      .join('&');
  }

  getMockJobs() {
    const jobTitles = [
      'Senior React Developer',
      'Full Stack Engineer',
      'DevOps Engineer',
      'UX Designer',
      'Product Manager',
      'Backend Developer',
      'Frontend Developer',
      'Data Scientist'
    ];

    const companies = [
      'Tech Corp Inc',
      'Startup XYZ',
      'Big Tech Co',
      'Innovation Labs',
      'Digital Solutions'
    ];

    const skills = [
      'React, JavaScript, TypeScript',
      'Node.js, MongoDB, AWS',
      'Python, Django, PostgreSQL',
      'Figma, Sketch, Adobe XD',
      'Kubernetes, Docker, CI/CD'
    ];

    return Array.from({ length: 20 }, (_, i) => ({
      job_id: `mock_${i}`,
      job_title: jobTitles[i % jobTitles.length],
      employer_name: companies[i % companies.length],
      job_country: 'USA',
      job_city: ['San Francisco', 'New York', 'Austin', 'Remote'][i % 4],
      job_description: `We are looking for a skilled ${jobTitles[i % jobTitles.length]} with experience in modern technologies.`,
      job_employment_type: ['FULLTIME', 'PARTTIME', 'CONTRACTOR', 'INTERN'][i % 4],
      job_is_remote: i % 3 === 0,
      job_posted_at_timestamp: Date.now() / 1000 - (i * 86400),
      job_required_skills: skills[i % skills.length],
      job_apply_link: `https://example.com/apply/${i}`,
      job_salary: i % 2 === 0 ? '$120,000 - $150,000' : null
    }));
  }

  // Add AI match scores
  async addMatchScores(jobs, resumeText) {
    if (!resumeText) {
      return jobs.map(job => ({
        ...job,
        match_score: 0,
        match_reasons: [],
        match_level: 'low'
      }));
    }

    const resumeHash = crypto
      .createHash('md5')
      .update(resumeText)
      .digest('hex')
      .substring(0, 8);

    const jobsWithScores = await Promise.all(
      jobs.map(async (job) => {
        const cacheKey = cacheService.generateMatchScoreKey(resumeHash, job.job_id);

        // Try cache
        const cached = await cacheService.get(cacheKey);
        if (cached) return cached;

        // Calculate fresh match
        const jobText = `${job.job_title} ${job.job_description} ${job.job_required_skills || ''}`;
        const match = await aiService.calculateMatchScore(resumeText, jobText);

        const result = {
          ...job,
          match_score: match.score,
          match_reasons: match.reasons || [],
          match_level: this.getMatchLevel(match.score)
        };

        // Cache for 24 hours
        await cacheService.set(cacheKey, result, 86400);

        return result;
      })
    );

    // Sort by match score descending
    return jobsWithScores.sort((a, b) => b.match_score - a.match_score);
  }

  getMatchLevel(score) {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }
}

module.exports = new JobService();
