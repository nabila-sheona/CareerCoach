// src/components/pages/DashboardPage.jsx

import React from 'react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Your Dashboard</h1>
        
        {/* User Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Profile Status</h2>
            <p className="text-gray-700">80% complete — keep going!</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-600 mb-2">Applied Jobs</h2>
            <p className="text-gray-700">You have applied to 5 jobs this month.</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-600 mb-2">Upcoming Interview</h2>
            <p className="text-gray-700">Next mock interview: Aug 5, 3:00 PM</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-10 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>✅ Completed “Resume Writing 101” course</li>
            <li>✅ Scored 85% in Job Readiness Assessment</li>
            <li>📅 Booked a mock interview session</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
