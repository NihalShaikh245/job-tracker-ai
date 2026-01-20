import React from 'react';
import ApplicationsPage from '../pages/ApplicationsPage';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const ApplicationsLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <ApplicationsPage />
        </main>
      </div>
    </div>
  );
};

export default ApplicationsLayout;