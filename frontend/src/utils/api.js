import axios from 'axios';

// HARDCODE your Render backend URL here
const API_BASE_URL = 'https://jobtracker-api.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add error logging
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response.data;
  },
  error => {
    console.error('API Response Error:', error.message);
    console.error('Full error:', error);
    return Promise.reject(error);
  }
);

// Simple demo mode API calls
const apiService = {
  // Jobs - return mock data
  fetchJobs: () => Promise.resolve({
    jobs: [
      {
        job_id: '1',
        job_title: 'Senior React Developer',
        employer_name: 'Tech Corp Inc',
        job_city: 'Remote',
        job_country: 'USA',
        job_description: 'Looking for experienced React developer with 5+ years in modern frontend technologies.',
        job_employment_type: 'FULLTIME',
        job_is_remote: true,
        job_posted_at_timestamp: Date.now() / 1000 - 86400,
        job_required_skills: 'React, JavaScript, TypeScript, CSS, HTML',
        job_apply_link: 'https://example.com/apply/1',
        match_score: 85,
        match_reasons: ['Strong React experience', 'JavaScript expertise', 'TypeScript knowledge']
      },
      {
        job_id: '2',
        job_title: 'Full Stack Engineer',
        employer_name: 'Startup XYZ',
        job_city: 'New York',
        job_country: 'USA',
        job_description: 'Join our fast-growing startup as a Full Stack Engineer.',
        job_employment_type: 'FULLTIME',
        job_is_remote: false,
        job_posted_at_timestamp: Date.now() / 1000 - 172800,
        job_required_skills: 'Node.js, React, MongoDB, AWS, Express',
        job_apply_link: 'https://example.com/apply/2',
        match_score: 72,
        match_reasons: ['Full stack development', 'Node.js experience']
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
        job_posted_at_timestamp: Date.now() / 1000 - 259200,
        job_required_skills: 'React, Redux, CSS, Responsive Design',
        job_apply_link: 'https://example.com/apply/3',
        match_score: 65,
        match_reasons: ['React proficiency', 'UI/UX skills']
      }
    ],
    bestMatches: [],
    total: 3,
    hasResume: true
  }),
  
  // Resume - simulate upload
  uploadResume: (text, fileName) => {
    console.log('Simulating resume upload:', fileName);
    return Promise.resolve({
      success: true,
      message: 'Resume uploaded successfully (demo mode)',
      fileName,
      length: text?.length || 0
    });
  },
  
  // Applications - mock data
  applyToJob: (job) => {
    console.log('Tracking application for:', job.job_title);
    return Promise.resolve({
      success: true,
      application: {
        id: `app_${Date.now()}`,
        job_title: job.job_title,
        company: job.employer_name,
        status: 'applied',
        applied_date: new Date().toISOString()
      }
    });
  },
  
  getApplications: () => Promise.resolve({
    applications: [],
    stats: {
      total: 0,
      byStatus: { applied: 0, interview: 0, offer: 0, rejected: 0 },
      avgMatchScore: 0
    }
  }),
  
  // AI Chat - mock response
  chatWithAI: (message) => Promise.resolve({
    response: `I'm your AI assistant. In demo mode, I can't process "${message}". Try filtering jobs using the filters above!`,
    filters: {},
    type: 'help'
  }),
  
  // Stats - mock data
  getStats: () => Promise.resolve({
    total: 0,
    byStatus: { applied: 0, interview: 0, offer: 0, rejected: 0 },
    avgMatchScore: 0,
    hasResume: false,
    resumeLength: 0
  })
};

export default apiService;