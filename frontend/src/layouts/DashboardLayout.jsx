import React from 'react';
import DashboardPage from '../pages/DashboardPage';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <DashboardPage />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;