import axios from 'axios';

// USE YOUR ACTUAL BACKEND URL
const API_BASE_URL = 'https://job-tracker-api-stsv.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// API methods
export default {
  fetchJobs: (filters) => api.get('/jobs', { params: filters }),
  
  uploadResume: (text, fileName) => 
    api.post('/resume/upload', { 
      text: text || 'Demo resume content', 
      fileName: fileName || 'resume.pdf',
      userId: 'demo_user'
    }),
  
  applyToJob: (job) => 
    api.post('/applications', { 
      job: {
        job_id: job.job_id || '1',
        job_title: job.job_title || 'Demo Job',
        employer_name: job.employer_name || 'Demo Company',
        match_score: job.match_score || 75
      },
      userId: 'demo_user'
    }),
  
  getApplications: () => api.get('/applications'),
  
  chatWithAI: (message) => api.post('/chat', { 
    message: message || 'Hello'
  }),
  
  getStats: () => api.get('/stats')
};