// SIMPLIFIED VERSION - No API calls, just return mock data
const mockJobs = [
  {
    job_id: '1',
    job_title: 'Senior React Developer',
    employer_name: 'Tech Corp Inc',
    job_city: 'Remote',
    job_country: 'USA',
    job_description: 'Looking for experienced React developer.',
    job_employment_type: 'FULLTIME',
    job_is_remote: true,
    match_score: 85,
    job_required_skills: 'React, JavaScript, TypeScript'
  }
];

export default {
  fetchJobs: () => Promise.resolve({
    jobs: mockJobs,
    bestMatches: [],
    total: mockJobs.length,
    hasResume: true
  }),
  
  uploadResume: () => Promise.resolve({
    success: true,
    message: 'Resume uploaded (demo)'
  }),
  
  applyToJob: () => Promise.resolve({
    success: true,
    application: {
      id: 'demo_app',
      status: 'applied'
    }
  }),
  
  getApplications: () => Promise.resolve({
    applications: [],
    stats: { total: 0 }
  }),
  
  chatWithAI: () => Promise.resolve({
    response: 'AI Assistant: Try filtering jobs using the filters above!',
    filters: {}
  }),
  
  getStats: () => Promise.resolve({
    total: 0,
    avgMatchScore: 68,
    hasResume: true
  })
};