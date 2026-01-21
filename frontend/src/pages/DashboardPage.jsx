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

// Mock data for demo
const mockJobs = [
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
    job_required_skills: 'React, JavaScript, TypeScript, CSS, HTML, Redux',
    job_apply_link: 'https://example.com/apply/1',
    match_score: 85,
    match_reasons: ['Strong React experience', 'JavaScript expertise']
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
    job_required_skills: 'Node.js, React, MongoDB, AWS, Express, Docker',
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
    job_description: 'Frontend developer needed for e-commerce platform redesign.',
    job_employment_type: 'CONTRACTOR',
    job_is_remote: true,
    job_posted_at_timestamp: Date.now() / 1000 - 259200,
    job_required_skills: 'React, Redux, CSS, Responsive Design, UI/UX',
    job_apply_link: 'https://example.com/apply/3',
    match_score: 65,
    match_reasons: ['React proficiency', 'UI/UX skills']
  }
];

const DashboardPage = () => {
  // ✅ MUST define filters FIRST
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

  // ✅ Now useQuery can safely use filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => {
      // Return mock data immediately for demo
      return Promise.resolve({
        jobs: mockJobs,
        bestMatches: mockJobs.filter(job => job.match_score >= 70),
        total: mockJobs.length,
        hasResume: true
      });
    },
    keepPreviousData: true
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => Promise.resolve({
      total: 0,
      byStatus: { applied: 0, interview: 0, offer: 0, rejected: 0 },
      avgMatchScore: 68,
      hasResume: true,
      resumeLength: 1500
    })
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

  const displayData = data || {
    jobs: mockJobs,
    bestMatches: [],
    total: mockJobs.length,
    hasResume: true
  };

  const displayStats = stats || {
    total: 0,
    byStatus: { applied: 0, interview: 0, offer: 0, rejected: 0 },
    avgMatchScore: 68,
    hasResume: true,
    resumeLength: 1500
  };

  return (
    <div className="space-y-6">
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

      {demoMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> Showing sample job data.
              </p>
            </div>
          </div>
        </div>
      )}

      {displayStats && <StatsOverview stats={displayStats} />}

      {displayData?.bestMatches && displayData.bestMatches.length > 0 && (
        <BestMatches jobs={displayData.bestMatches} onApplyClick={handleApplyClick} />
      )}

      <JobFilters filters={filters} onFilterChange={handleFilterChange} />

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Job Feed <span className="text-gray-500">({displayData.total} jobs)</span>
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

      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onApplyFilters={handleAIFilterApply}
      />

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