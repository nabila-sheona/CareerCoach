// src/components/pages/DashboardPage.jsx

import React, { useState, useEffect } from "react";
import { cvReviewAPI } from "./shared/api";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id || 'user123'; // Fallback to user123 for demo purposes
      const response = await cvReviewAPI.getDashboardData(userId);
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressIndicator = (hasImproved) => {
    return hasImproved ? (
      <span className="text-green-600 font-semibold">📈 Improved</span>
    ) : (
      <span className="text-orange-600 font-semibold">📊 No Change</span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          CV Review Dashboard
        </h1>

        {/* CV Review Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">
              Total Reviews
            </h2>
            <p className="text-3xl font-bold text-gray-800">
              {dashboardData?.totalReviews || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">CV reviews completed</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-600 mb-2">
              Progress Status
            </h2>
            <div className="text-2xl mb-2">
              {dashboardData?.progressComparison ? 
                getProgressIndicator(dashboardData.progressComparison.hasImproved) : 
                <span className="text-gray-500">No data</span>
              }
            </div>
            <p className="text-sm text-gray-500">
              {dashboardData?.progressComparison?.hasImproved ? 
                'Better than last review' : 'Same as last review'}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-purple-600 mb-2">
              Average Score
            </h2>
            <p className="text-3xl font-bold text-gray-800">
              {dashboardData?.metrics?.averageScore ? 
                `${Math.round(dashboardData.metrics.averageScore)}/100` : 'N/A'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Overall performance</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-orange-600 mb-2">
              Latest Review
            </h2>
            <p className="text-lg font-semibold text-gray-800">
              {dashboardData?.recentFeedback?.[0] ? 
                formatDate(dashboardData.recentFeedback[0].reviewDate) : 'No reviews yet'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Most recent analysis</p>
          </div>
        </div>

        {/* Key Metrics Section */}
        {dashboardData?.metrics && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Key Metrics Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800">Highest Score</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData.metrics.highestScore || 0}/100
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">Lowest Score</h3>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData.metrics.lowestScore || 0}/100
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800">Total Recommendations</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardData.metrics.totalRecommendations || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Trends Chart Placeholder */}
        {dashboardData?.progressTrends && dashboardData.progressTrends.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Progress Trends
            </h2>
            <div className="space-y-3">
              {dashboardData.progressTrends.slice(0, 5).map((trend, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">{formatDate(trend.date)}</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {Math.round(trend.overallScore)}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Feedback Section */}
        {dashboardData?.recentFeedback && dashboardData.recentFeedback.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Feedback
            </h2>
            <div className="space-y-4">
              {dashboardData.recentFeedback.map((review, index) => (
                <div key={review.id || index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">
                      Review #{dashboardData.recentFeedback.length - index}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.reviewDate)}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    <strong>Overall Score:</strong> {Math.round(review.overallMatch?.score || 0)}/100
                  </p>
                  <div className="text-sm text-gray-600">
                    <p><strong>Strengths:</strong> {review.strengths?.join(', ') || 'None specified'}</p>
                    <p><strong>Areas for Improvement:</strong> {review.weaknesses?.join(', ') || 'None specified'}</p>
                    <p><strong>Suitability:</strong> {review.suitability?.verdict || 'Not assessed'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Data Message */}
        {(!dashboardData || dashboardData.totalReviews === 0) && (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              No CV Reviews Yet
            </h2>
            <p className="text-gray-600 mb-4">
              Start by uploading and reviewing your CV to see insights and progress tracking.
            </p>
            <button 
              onClick={() => window.location.href = '/cv-review'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Review Your CV
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
