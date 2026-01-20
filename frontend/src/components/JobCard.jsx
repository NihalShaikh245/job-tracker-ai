import React, { useState } from 'react';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  ClockIcon, 
  ComputerDesktopIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const JobCard = ({ job, showApplyPopup }) => {
  const [isApplying, setIsApplying] = useState(false);

  const getMatchColor = (score) => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getMatchText = (score) => {
    if (score >= 70) return 'High Match';
    if (score >= 40) return 'Medium Match';
    return 'Low Match';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const date = new Date(timestamp * 1000);
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const handleApply = () => {
    setIsApplying(true);
    
    // Open job link in new tab if available
    if (job.job_apply_link) {
      window.open(job.job_apply_link, '_blank');
    }
    
    // Show popup after delay
    setTimeout(() => {
      showApplyPopup();
      setIsApplying(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {job.job_title || 'Job Title'}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <BriefcaseIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">{job.employer_name || 'Company Name'}</span>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.match_score)}`}>
          {job.match_score || 0}% - {getMatchText(job.match_score || 0)}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {job.job_city || 'Location'}, {job.job_country || 'Country'}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">{formatDate(job.job_posted_at_timestamp)}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <ComputerDesktopIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {job.job_is_remote ? 'Remote' : 'On-site'} • {job.job_employment_type || 'Full-time'}
          </span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {job.job_description || 'No description available.'}
      </p>

      {job.match_reasons && job.match_reasons.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Why it matches:</h4>
          <div className="flex flex-wrap gap-2">
            {job.match_reasons.slice(0, 3).map((reason, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
              >
                {reason}
              </span>
            ))}
          </div>
        </div>
      )}

      {job.job_required_skills && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {job.job_required_skills.split(',').slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        {job.job_salary && (
          <span className="text-green-600 font-medium">{job.job_salary}</span>
        )}
        
        <button
          onClick={handleApply}
          disabled={isApplying}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
        >
          {isApplying ? (
            <>
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Tracking...
            </>
          ) : (
            <>
              Apply Now
              <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default JobCard;