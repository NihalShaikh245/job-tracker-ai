import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: HomeIcon, label: 'Dashboard', path: '/dashboard' },
    { icon: BriefcaseIcon, label: 'Job Feed', path: '/dashboard' },
    { icon: DocumentTextIcon, label: 'Applications', path: '/applications' },
    { icon: ChatBubbleLeftRightIcon, label: 'AI Assistant', path: '#' },
    { icon: Cog6ToothIcon, label: 'Settings', path: '#' },
  ];

  const hasResume = localStorage.getItem('hasResume') === 'true';
  const resumeFileName = localStorage.getItem('resumeFileName') || 'No resume uploaded';

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-80px)]">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700">Resume Status</h2>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              {hasResume ? `📄 Resume uploaded: ${resumeFileName}` : '📄 No resume uploaded'}
            </p>
            <button className="mt-2 text-xs text-blue-600 hover:text-blue-800">
              {hasResume ? 'Update Resume' : 'Upload Resume'}
            </button>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;