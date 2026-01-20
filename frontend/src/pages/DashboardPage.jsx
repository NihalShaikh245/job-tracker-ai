import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  SparklesIcon, 
  BriefcaseIcon, 
  ChartBarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import BestMatches from '../components/BestMatches';
import ApplyPopup from '../components/ApplyPopup';
import AIAssistant from '../components/AIAssistant';
import StatsOverview from '../components/StatsOverview';
import api from '../utils/api';

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

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => api.fetchJobs(filters),
    keepPreviousData: true
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
    enabled: !isLoading
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
          <button
            onClick={() => setShowAIAssistant(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            AI Assistant
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && <StatsOverview stats={stats} />}

      {/* Best Matches Section */}
      {data?.bestMatches && data.bestMatches.length > 0 && (
        <BestMatches jobs={data.bestMatches} onApplyClick={handleApplyClick} />
      )}

      {/* Filters */}
      <JobFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Job Feed */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Job Feed {data && <span className="text-gray-500">({data.total} jobs)</span>}
          </h2>
          
          <div className="flex items-center text-sm text-gray-600">
            <ChartBarIcon className="h-4 w-4 mr-1" />
            <span>
              Avg. match score: {data?.jobs?.length ? 
                Math.round(data.jobs.reduce((acc, job) => acc + (job.match_score || 0), 0) / data.jobs.length) : 
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
        ) : error ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Unable to load jobs
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error fetching jobs. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : data?.jobs?.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => setFilters({
                query: '',
                job_type: 'all',
                work_mode: 'all',
                date_posted: 'all',
                match_score: 'all',
                location: '',
                skills: undefined
              })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data?.jobs?.map(job => (
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