import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} CareerCoach. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="https://twitter.com/careercoach"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            Twitter
          </a>
          <a
            href="https://facebook.com/careercoach"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700"
          >
            Facebook
          </a>
          <a
            href="https://linkedin.com/company/careercoach"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            LinkedIn
          </a>
          <a
            href="/privacy-policy"
            className="hover:underline"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
