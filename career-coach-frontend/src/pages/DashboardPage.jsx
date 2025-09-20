// src/components/pages/DashboardPage.jsx

import React, { useState, useEffect } from "react";
import { cvReviewAPI } from "../services/api";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Add a refresh function that can be called manually
  const refreshDashboard = () => {
    fetchDashboardData();
  };

  // Auto-refresh when the component becomes visible (user navigates back to dashboard)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      let userId = user?.email || 'test@example.com'; // Use email to match CVReviewPage implementation
      
      const response = await cvReviewAPI.getDashboardData(userId);
      setDashboardData(response.data);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      if (err.response?.status === 404) {
        setError('No CV review data found. Please upload and review your CV first.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to load dashboard data. Please try again later.');
      }
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
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Data Unavailable</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            {error.includes('No CV review data found') && (
              <div className="space-y-3">
                <a 
                  href="/cv-review" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload & Review CV
                </a>
                <p className="text-sm text-gray-500">Get started by uploading your CV for analysis</p>
              </div>
            )}
            {error.includes('log in') && (
              <button 
                onClick={() => window.location.reload()} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Refresh Page
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Check if dashboard data exists but has no reviews
  if (dashboardData && dashboardData.totalReviews === 0) {
    return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            CV Review Dashboard
          </h1>
          <button
            onClick={refreshDashboard}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No CV Reviews Yet</h3>
            <p className="text-gray-600 mb-6">You haven't uploaded any CVs for review yet. Get started by uploading your CV to receive personalized feedback and insights.</p>
            <div className="space-y-3">
              <a 
                href="/cv-review" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Upload Your First CV
              </a>
              <p className="text-sm text-gray-500">Start your career improvement journey today</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">
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
