import React from 'react';
import { 
  BriefcaseIcon, 
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const StatsOverview = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BriefcaseIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-600">Total Applications</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-600">Interview Stage</p>
            <p className="text-2xl font-bold text-gray-900">{stats.byStatus?.interview || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <ClockIcon className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-600">Applied</p>
            <p className="text-2xl font-bold text-gray-900">{stats.byStatus?.applied || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ChartBarIcon className="h-5 w-5 text-purple-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-600">Avg. Match Score</p>
            <p className="text-2xl font-bold text-gray-900">{stats.avgMatchScore || 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;