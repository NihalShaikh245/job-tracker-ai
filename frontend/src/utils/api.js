import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add userId header
api.interceptors.request.use(config => {
  const userId = localStorage.getItem('userId') || 'default';
  config.headers['x-user-id'] = userId;
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const apiService = {
  // Jobs
  fetchJobs: (filters) => 
    api.get('/jobs', { params: filters }),
  
  // Resume
  uploadResume: (text, fileName) =>
    api.post('/resume/upload', { text, fileName, userId: 'default' }),
  
  // Applications
  applyToJob: (job) =>
    api.post('/applications', { job, userId: 'default' }),
  
  getApplications: (filters) =>
    api.get('/applications', { params: filters }),
  
  updateApplicationStatus: (applicationId, status) =>
    api.patch(`/applications/${applicationId}`, { status, userId: 'default' }),
  
  // AI Chat
  chatWithAI: (message) =>
    api.post('/chat', { message }),
  
  // Stats
  getStats: () =>
    api.get('/stats')
};

export default apiService;