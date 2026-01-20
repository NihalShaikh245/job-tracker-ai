import React, { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const JobFilters = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const jobTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'fulltime', label: 'Full-time' },
    { value: 'parttime', label: 'Part-time' },
    { value: 'contractor', label: 'Contract' },
    { value: 'intern', label: 'Internship' }
  ];

  const workModes = [
    { value: 'all', label: 'All Modes' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'onsite', label: 'On-site' }
  ];

  const dateFilters = [
    { value: 'all', label: 'Any Time' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' }
  ];

  const matchScores = [
    { value: 'all', label: 'All Scores' },
    { value: 'high', label: 'High (>70%)' },
    { value: 'medium', label: 'Medium (40-70%)' },
    { value: 'low', label: 'Low (<40%)' }
  ];

  const skillsOptions = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
    'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL',
    'GraphQL', 'Redux', 'Vue', 'Angular', 'Figma', 'UX'
  ];

  const handleSkillToggle = (skill) => {
    const currentSkills = filters.skills ? filters.skills.split(',') : [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    
    onFilterChange({
      ...filters,
      skills: newSkills.length > 0 ? newSkills.join(',') : undefined
    });
  };

  const clearFilters = () => {
    onFilterChange({
      query: '',
      job_type: 'all',
      work_mode: 'all',
      date_posted: 'all',
      match_score: 'all',
      location: '',
      skills: undefined
    });
  };

  const activeFilterCount = Object.keys(filters).filter(
    key => filters[key] && filters[key] !== 'all' && filters[key] !== ''
  ).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear all
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        </div>
      </div>

      {/* Search and Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Jobs
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={filters.query || ''}
              onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
              placeholder="Job title, keywords, or company"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>
          <select
            value={filters.job_type || 'all'}
            onChange={(e) => onFilterChange({ ...filters, job_type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {jobTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Mode
          </label>
          <select
            value={filters.work_mode || 'all'}
            onChange={(e) => onFilterChange({ ...filters, work_mode: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {workModes.map(mode => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                placeholder="City, state, or country"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Posted
              </label>
              <select
                value={filters.date_posted || 'all'}
                onChange={(e) => onFilterChange({ ...filters, date_posted: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {dateFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Match Score
              </label>
              <select
                value={filters.match_score || 'all'}
                onChange={(e) => onFilterChange({ ...filters, match_score: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {matchScores.map(score => (
                  <option key={score.value} value={score.value}>
                    {score.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Skills Filter */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {skillsOptions.map(skill => {
                const isSelected = filters.skills?.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {filters.query && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Search: {filters.query}
                <button
                  onClick={() => onFilterChange({ ...filters, query: '' })}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.job_type && filters.job_type !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                {jobTypes.find(t => t.value === filters.job_type)?.label}
                <button
                  onClick={() => onFilterChange({ ...filters, job_type: 'all' })}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.skills && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Skills: {filters.skills.split(',').length} selected
                <button
                  onClick={() => onFilterChange({ ...filters, skills: undefined })}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFilters;