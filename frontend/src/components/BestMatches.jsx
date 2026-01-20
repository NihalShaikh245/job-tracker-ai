import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

const BestMatches = ({ jobs, onApplyClick }) => {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <SparklesIcon className="h-5 w-5 text-yellow-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Best Matches for You</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.slice(0, 6).map((job) => (
          <div
            key={job.job_id}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{job.job_title}</h3>
                <p className="text-sm text-gray-600">{job.employer_name}</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {job.match_score}% Match
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-4 line-clamp-2">
              {job.job_description}
            </p>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {job.job_city} • {job.job_is_remote ? 'Remote' : 'On-site'}
              </div>
              <button
                onClick={() => onApplyClick(job)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View & Apply →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestMatches;