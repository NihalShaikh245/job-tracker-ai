import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BriefcaseIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';

const ApplicationsPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['applications', statusFilter, searchQuery],
    queryFn: () => api.getApplications({ 
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchQuery 
    }),
  });

  const applications = applicationsData?.applications || [];
  const stats = applicationsData?.stats || {};

  const statusOptions = [
    { value: 'all', label: 'All Applications', color: 'gray', count: stats.total || 0 },
    { value: 'applied', label: 'Applied', color: 'yellow', count: stats.byStatus?.applied || 0 },
    { value: 'interview', label: 'Interview', color: 'blue', count: stats.byStatus?.interview || 0 },
    { value: 'offer', label: 'Offer', color: 'green', count: stats.byStatus?.offer || 0 },
    { value: 'rejected', label: 'Rejected', color: 'red', count: stats.byStatus?.rejected || 0 },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'interview': return <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500" />;
      case 'offer': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default: return <BriefcaseIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-blue-100 text-blue-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-600">
          Track and manage your job applications
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusOptions.map((option) => (
          <div
            key={option.value}
            className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
              statusFilter === option.value ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setStatusFilter(option.value)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{option.label}</p>
                <p className="text-2xl font-bold text-gray-900">{option.count}</p>
              </div>
              <div className={`p-2 rounded-lg ${getStatusColor(option.value)}`}>
                {getStatusIcon(option.value)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search applications by job title or company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {applications.length} applications
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? "You haven't tracked any applications yet."
                : `No ${statusFilter} applications found.`}
            </p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {app.job_title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {app.company} • {app.location} • {app.job_type}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">
                    Applied {formatDate(app.applied_date)}
                  </div>
                  <div className="text-sm">
                    Match Score: <span className="font-semibold">{app.match_score}%</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Work Mode:</span> {app.work_mode}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {formatDate(app.last_updated)}
                  </div>
                  {app.notes && (
                    <div className="w-full">
                      <span className="font-medium">Notes:</span> {app.notes}
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-4 space-x-3">
                  <button
                    onClick={() => window.open(app.apply_link, '_blank')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    View Job
                  </button>
                  <button
                    onClick={() => {/* TODO: Implement status update */}}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;