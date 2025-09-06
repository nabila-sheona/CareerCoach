import React, { useState } from 'react';
import { toast } from 'react-toastify';
import fileParsingService from '../../services/fileParsingService';
import geminiService from '../../services/geminiService';

const CVReviewPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF or DOCX file only.');
        toast.error('Please upload a PDF or DOCX file only.');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        toast.error('File size must be less than 10MB.');
        return;
      }

      setUploadedFile(file);
      setError('');
      toast.success('CV uploaded successfully!');
    }
  };

  const handleAnalyzeCV = async () => {
    if (!uploadedFile) {
      setError('Please upload your CV first.');
      toast.error('Please upload your CV first.');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      toast.error('Please provide a job description.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);
    
    try {
      // Step 1: Extract text from uploaded file
      toast.info('Extracting text from your CV...');
      const extractedText = await fileParsingService.extractText(uploadedFile);
      
      // Step 2: Clean and validate the extracted text
      const cleanedText = fileParsingService.cleanExtractedText(extractedText);
      const validation = fileParsingService.validateCVContent(cleanedText);
      
      if (!validation.isValid) {
        setError(validation.message);
        toast.error(validation.message);
        return;
      }
      
      // Step 3: Analyze CV with Gemini API
      toast.info('Analyzing your CV against the job description...');
      const analysis = await geminiService.analyzeCVAgainstJob(cleanedText, jobDescription.trim());
      
      setAnalysisResult(analysis);
      toast.success('CV analysis completed successfully!');
      
    } catch (err) {
      console.error('CV analysis error:', err);
      const errorMessage = err.message || 'Failed to analyze CV. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered CV Review</h1>
          <p className="text-lg text-gray-600">
            Upload your CV and get personalized feedback to improve your job application success rate.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError('')}
            >
              <span className="sr-only">Dismiss</span>
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Job Description */}
          <div className="space-y-6">
            {/* CV Upload Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Your CV</h2>
              
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="mt-4">
                    <label htmlFor="cv-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Click to upload your CV
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PDF or DOCX files up to 10MB
                      </span>
                    </label>
                    <input
                      id="cv-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Job Description Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here or describe the role you're applying for..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-2 text-sm text-gray-500">
                Provide a detailed job description to get more accurate feedback.
              </p>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyzeCV}
              disabled={isAnalyzing || !uploadedFile || !jobDescription.trim()}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing CV...
                </div>
              ) : (
                'Analyze My CV'
              )}
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
            
            {!analysisResult ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="mt-4 text-gray-500">
                  Upload your CV and provide a job description to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Match Score */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Overall Match</h3>
                    <div className="text-2xl font-bold text-blue-600">{analysisResult.overallMatch?.score || 0}%</div>
                  </div>
                  <p className="text-gray-700">{analysisResult.overallMatch?.summary}</p>
                </div>

                {/* Suitability Verdict */}
                <div className={`rounded-lg p-4 border ${
                  analysisResult.suitability?.verdict === 'Highly Suitable' ? 'bg-green-50 border-green-200' :
                  analysisResult.suitability?.verdict === 'Suitable' ? 'bg-blue-50 border-blue-200' :
                  analysisResult.suitability?.verdict === 'Needs Improvement' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Suitability Assessment</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                    analysisResult.suitability?.verdict === 'Highly Suitable' ? 'bg-green-100 text-green-800' :
                    analysisResult.suitability?.verdict === 'Suitable' ? 'bg-blue-100 text-blue-800' :
                    analysisResult.suitability?.verdict === 'Needs Improvement' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {analysisResult.suitability?.verdict || 'Unknown'}
                  </div>
                  <p className="text-gray-700">{analysisResult.suitability?.reasoning}</p>
                </div>

                {/* Strengths */}
                {analysisResult.strengths && analysisResult.strengths.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {analysisResult.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Areas for Improvement */}
                {analysisResult.weaknesses && analysisResult.weaknesses.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {analysisResult.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-600 mr-2">•</span>
                          <span className="text-gray-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing Skills */}
                {analysisResult.missingSkills && analysisResult.missingSkills.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Missing Skills
                    </h3>
                    <ul className="space-y-2">
                      {analysisResult.missingSkills.map((skill, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-600 mr-2">•</span>
                          <span className="text-gray-700">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Recommendations
                    </h3>
                    <div className="space-y-3">
                      {analysisResult.recommendations.map((rec, index) => (
                        <div key={index} className="border-l-4 border-blue-400 pl-4">
                          <div className="flex items-center mb-1">
                            <span className="font-medium text-gray-900">{rec.category}</span>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {rec.priority} priority
                            </span>
                          </div>
                          <p className="text-gray-700">{rec.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keyword Optimization */}
                {analysisResult.keywordOptimization && (
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Keyword Optimization
                    </h3>
                    {analysisResult.keywordOptimization.missingKeywords && analysisResult.keywordOptimization.missingKeywords.length > 0 && (
                      <div className="mb-3">
                        <p className="font-medium text-gray-900 mb-2">Missing Keywords:</p>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.keywordOptimization.missingKeywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-gray-700">{analysisResult.keywordOptimization.suggestions}</p>
                  </div>
                )}

                {/* Formatting Score */}
                {analysisResult.formatting && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Formatting Score</h3>
                      <div className="text-xl font-bold text-gray-600">{analysisResult.formatting.score}/10</div>
                    </div>
                    <p className="text-gray-700">{analysisResult.formatting.suggestions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVReviewPage;