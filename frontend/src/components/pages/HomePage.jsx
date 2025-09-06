import React from "react";
import { Link } from 'react-router-dom';
import Navbar from "../shared/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">



      {/* Hero Section */}
      <main className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Bridge the Gap Between Education & Employment
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            AI-powered job readiness platform helping 3 million+ young Bangladeshis prepare for
            their dream careers with personalized coaching, mock interviews, and skill assessments.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 mb-16">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors duration-200">
              Get Started Free
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200">
              Watch Demo
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">3M+</div>
              <div className="text-gray-600 font-medium">Young Job Seekers Annually</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">70%</div>
              <div className="text-gray-600 font-medium">Lack Job Readiness Skills</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">1.5M</div>
              <div className="text-gray-600 font-medium">Formal Jobs Created</div>
            </div>
          </div>
        </div>
      </main>
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Career Preparation
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to land your dream job in Bangladesh
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* AI CV Review */}
            <div className="bg-blue-50 rounded-2xl p-8 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI CV Review</h3>
              <p className="text-gray-600 mb-6">
                Upload DOC/PDF resume format. Get feedback tailored to Bangladeshi job formats (S.S.C. → Secondary School Certificate).
              </p>
              <div className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                Registered Users Only
              </div>
              <div>
                <Link to="/cv-review" className="text-blue-600 font-medium hover:text-blue-700">
                  Try CV Review →
                </Link>
              </div>
            </div>

            {/* Domain-Specific Tests */}
            <div className="bg-green-50 rounded-2xl p-8 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Domain-Specific Tests</h3>
              <p className="text-gray-600 mb-6">
                Banking (Bangladesh Bank), Tech, Government exams with instant AI-evaluated feedback and explanations.
              </p>
              <div className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                Registered Users Only
              </div>
              <div>
                <a href="#" className="text-green-600 font-medium hover:text-green-700">
                  Start Testing →
                </a>
              </div>
            </div>

            {/* AI Mock Interviews */}
            <div className="bg-purple-50 rounded-2xl p-8 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Mock Interviews</h3>
              <p className="text-gray-600 mb-6">
                Voice clarity, filler words, eye contact analysis. Get AI-generated ideal answers for improvement.
              </p>
              <div className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                Registered Users Only
              </div>
              <div>
                <a href="#" className="text-purple-600 font-medium hover:text-purple-700">
                  Start Interview →
                </a>
              </div>
            </div>

            {/* Progress Dashboard */}
            <div className="bg-yellow-50 rounded-2xl p-8 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Progress Dashboard</h3>
              <p className="text-gray-600 mb-6">
                Historical data tracking: "Aptitude Score: 62% → 78% over 3 weeks" with career trajectory predictions.
              </p>
              <div className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                Registered Users Only
              </div>
              <div>
                <a href="#" className="text-yellow-600 font-medium hover:text-yellow-700">
                  View Progress →
                </a>
              </div>
            </div>

            {/* Skill Gap Analyzer */}
            <div className="bg-red-50 rounded-2xl p-8 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Skill Gap Analyzer</h3>
              <p className="text-gray-600 mb-6">
                "For Junior DevOps in BD, Docker and Jenkins are essential. You currently lack experience in both."
              </p>
              <div className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                Registered Users Only
              </div>
              <div>
                <a href="#" className="text-red-600 font-medium hover:text-red-700">
                  Analyze Skills →
                </a>
              </div>
            </div>

            {/* Personalized Roadmap */}
            <div className="bg-indigo-50 rounded-2xl p-8 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalized Roadmap</h3>
              <p className="text-gray-600 mb-6">
                JS Bangla YouTube tutorials, Coursera BD scholarships, freeCodeCamp BD lessons based on your gaps.
              </p>
              <div className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                Registered Users Only
              </div>
              <div>
                <a href="#" className="text-indigo-600 font-medium hover:text-indigo-700">
                  Get Roadmap →
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;