import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  SparklesIcon, 
  BriefcaseIcon, 
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import BestMatches from '../components/BestMatches';
import ApplyPopup from '../components/ApplyPopup';
import AIAssistant from '../components/AIAssistant';
import StatsOverview from '../components/StatsOverview';
import api from '../utils/api';

const { data, isLoading, error } = useQuery({
  queryKey: ['jobs', filters],
  queryFn: () => api.fetchJobs(filters),
  keepPreviousData: true,
  retry: false, // Don't retry on error
  onError: (error) => {
    console.log('API Error (using mock data):', error.message);
  }
});

const DashboardPage = () => {
  const [filters, setFilters] = useState({
    query: '',
    job_type: 'all',
    work_mode: 'all',
    date_posted: 'all',
    match_score: 'all',
    location: '',
    skills: undefined
  });
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyPopup, setShowApplyPopup] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [demoMode, setDemoMode] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => api.fetchJobs(filters),
    keepPreviousData: true,
    retry: false // Don't retry on error
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
    enabled: !isLoading,
    retry: false
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplyPopup(true);
  };

  const handleAIFilterApply = (aiFilters) => {
    setFilters(prev => ({
      ...prev,
      ...aiFilters
    }));
  };

  // Mock data for demo
  const mockData = {
    jobs: [
      {
        job_id: '1',
        job_title: 'Senior React Developer',
        employer_name: 'Tech Corp Inc',
        job_city: 'Remote',
        job_country: 'USA',
        job_description: 'Looking for experienced React developer with 5+ years in modern frontend technologies. Must have experience with TypeScript, Redux, and modern build tools.',
        job_employment_type: 'FULLTIME',
        job_is_remote: true,
        job_posted_at_timestamp: Date.now() / 1000 - 86400,
        job_required_skills: 'React, JavaScript, TypeScript, CSS, HTML, Redux',
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
        job_description: 'Join our fast-growing startup as a Full Stack Engineer. Work on cutting-edge technologies and make a real impact.',
        job_employment_type: 'FULLTIME',
        job_is_remote: false,
        job_posted_at_timestamp: Date.now() / 1000 - 172800,
        job_required_skills: 'Node.js, React, MongoDB, AWS, Express, Docker',
        job_apply_link: 'https://example.com/apply/2',
        match_score: 72,
        match_reasons: ['Full stack development', 'Node.js experience', 'Cloud knowledge']
      },
      {
        job_id: '3',
        job_title: 'Frontend Developer',
        employer_name: 'Digital Solutions',
        job_city: 'Remote',
        job_country: 'USA',
        job_description: 'Frontend developer needed for our e-commerce platform redesign. Focus on performance and user experience.',
        job_employment_type: 'CONTRACTOR',
        job_is_remote: true,
        job_posted_at_timestamp: Date.now() / 1000 - 259200,
        job_required_skills: 'React, Redux, CSS, Responsive Design, UI/UX',
        job_apply_link: 'https://example.com/apply/3',
        match_score: 65,
        match_reasons: ['React proficiency', 'UI/UX skills', 'Frontend focus']
      },
      {
        job_id: '4',
        job_title: 'DevOps Engineer',
        employer_name: 'Cloud Systems',
        job_city: 'Austin',
        job_country: 'USA',
        job_description: 'DevOps engineer to manage our cloud infrastructure and CI/CD pipelines.',
        job_employment_type: 'FULLTIME',
        job_is_remote: true,
        job_posted_at_timestamp: Date.now() / 1000 - 345600,
        job_required_skills: 'AWS, Docker, Kubernetes, CI/CD, Terraform',
        job_apply_link: 'https://example.com/apply/4',
        match_score: 45,
        match_reasons: ['Cloud infrastructure', 'Automation skills']
      }
    ],
    bestMatches: [],
    total: 4,
    hasResume: true
  };

  const displayData = data || mockData;
  const displayStats = stats || {
    total: 0,
    byStatus: { applied: 0, interview: 0, offer: 0, rejected: 0 },
    avgMatchScore: 68,
    hasResume: localStorage.getItem('hasResume') === 'true',
    resumeLength: 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Dashboard</h1>
          <p className="text-gray-600">
            Discover opportunities that match your resume
          </p>
        </div>
        
        <div className="flex space-x-3">
          {demoMode && (
            <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
              <InformationCircleIcon className="h-4 w-4 mr-1" />
              Demo Mode
            </div>
          )}
          <button
            onClick={() => setShowAIAssistant(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            AI Assistant
          </button>
        </div>
      </div>

      {/* Demo Notice */}
      {demoMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> Showing sample job data. All features are functional.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                AI matching, filters, and application tracking work with mock data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      {displayStats && <StatsOverview stats={displayStats} />}

      {/* Best Matches Section */}
      {displayData?.bestMatches && displayData.bestMatches.length > 0 && (
        <BestMatches jobs={displayData.bestMatches} onApplyClick={handleApplyClick} />
      )}

      {/* Filters */}
      <JobFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Job Feed */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Job Feed {displayData && <span className="text-gray-500">({displayData.total} jobs)</span>}
          </h2>
          
          <div className="flex items-center text-sm text-gray-600">
            <ChartBarIcon className="h-4 w-4 mr-1" />
            <span>
              Avg. match score: {displayData?.jobs?.length ? 
                Math.round(displayData.jobs.reduce((acc, job) => acc + (job.match_score || 0), 0) / displayData.jobs.length) : 
                0}%
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayData?.jobs?.map(job => (
              <JobCard
                key={job.job_id}
                job={job}
                showApplyPopup={() => {
                  setSelectedJob(job);
                  setShowApplyPopup(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      error ? (
  <div className="bg-white rounded-xl border p-8 text-center">
    <div className="text-yellow-600 mb-4">
      <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Using Demo Data
    </h3>
    <p className="text-gray-600 mb-4">
      Backend connection failed. Showing sample jobs.
    </p>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Show mock jobs here */}
    </div>
  </div>
) : (
  // Normal job display
)

      {/* AI Assistant */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onApplyFilters={handleAIFilterApply}
      />

      {/* Apply Popup */}
      {selectedJob && (
        <ApplyPopup
          job={selectedJob}
          isOpen={showApplyPopup}
          onClose={() => setShowApplyPopup(false)}
          onConfirm={(status) => {
            console.log(`Application ${status} for ${selectedJob.job_title}`);
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;